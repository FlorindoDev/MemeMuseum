import { MemesController } from "./MemesController.js";
import { VoteController } from "./VoteController.js";
import { Op } from "sequelize";

export class DailyMemeController {

    static makeFilterForDailyMeme(req) {

        let query = { pages: req.checked.query.page, size: req.checked.query.pagesize, iduser: req.query.iduser };
        let filters = MemesController.createFilterForGetMeme(query, req.nametags, req.query.username);

        let range_date = {
            [Op.between]: [new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), new Date(Date.now())]
        }

        if (filters.where) {
            filters.where.createdAt = range_date;
        } else {
            filters.where = {
                createdAt: range_date
            }
        }

        return filters;
    }

    static insertInOreder(element, nameOfDiscriminator, array = []) {

        if (array.length === 0) {
            array[0] = element;
            return array;
        }

        for (let index = 0; index < array.length; index++) {

            if (element[nameOfDiscriminator] > array[index][nameOfDiscriminator]) {
                for (let i = array.length - 1; index <= i; i--) {
                    array[i + 1] = array[i];
                }
                array[index] = element;
                return array
            }
        }
        array.push(element);
        return array;

    }


    static getPoint(votes, createdAt) {

        let ore_dalla_publicazione = (Date.now() - Date.parse(createdAt)) / 1000 / 60 / 60

        return votes.upvote - votes.downvote - (ore_dalla_publicazione * 0.5);
    }

    static async getVotes(memes) {
        return Promise.allSettled(
            memes.map((val) => {
                let filter = { where: { MemeIdMeme: val.dataValues.idMeme } };
                return VoteController.getMemeVotes(filter);
            })
        );
    }

    static getNumVotes(votes) {

        let upVote = votes.filter(vote => {
            if (vote.dataValues.upVote) return true;
            return false;
        });

        let downvote = votes.length - upVote.length;
        return { upvote: upVote.length, downvote: downvote };
    }

    static async dailyMeme(filter) {
        let memes = [];
        let orderdMemes = [];
        let votes = { upvote: 0, downvote: 0 };


        memes = await MemesController.getAllMemes(filter);
        let results = await this.getVotes(memes);

        for (let index = 0; index < results.length; index++) {
            let meme_data = memes[index].dataValues;

            if (results[index].status === "fulfilled") votes = this.getNumVotes(results[index].value);

            meme_data.weight = this.getPoint(votes, meme_data.createdAt);
            orderdMemes = this.insertInOreder(meme_data, "weight", orderdMemes);


        }
        return orderdMemes;



    }
}