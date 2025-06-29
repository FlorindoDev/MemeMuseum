import { MemesController } from "./MemesController.js";
import { VoteController } from "./VoteController.js";
import { Op } from "sequelize";

const BACKWARDS_RANGE = 15 //i post dei ultimi tot giorni 

export class DailyMemeController {

    static makeFilterForDailyMeme(req) {

        let query = { pages: req.checked.query.page, size: req.checked.query.pagesize, iduser: req.query.iduser };
        let filters = MemesController.createFilterForGetMeme(query, req.nametags, req.query.username, req.orderby, req.query.orderbydate);

        let range_date = {
            [Op.between]: [new Date(Date.now() - BACKWARDS_RANGE * 24 * 60 * 60 * 1000), new Date(Date.now())]
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

        let upvote = votes.upvote;
        let downvote = votes.downvote;
        const ore_dalla_pubblicazione = (Date.now() - createdAt) / 1000 / 60 / 60;

        const netVotes = votes.upvote - votes.downvote;
        const sign = netVotes > 0 ? 1 : netVotes < 0 ? -1 : 0;  // se netvotes è negativo rimmara negativo anche dopo al log
        const order = sign * Math.log10(Math.max(Math.abs(netVotes), 1)); // con log10 normalizzo , abs è valore assolutto
        const score = order + ore_dalla_pubblicazione / 45000; // man mano che ore aumentano order perde sempre di più 

        console.log({ upvote, downvote, netVotes, ore_dalla_pubblicazione, order, score });
        console.log(score);
        return score;
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
            votes = { upvote: 0, downvote: 0 };
            let meme_data = memes[index].dataValues;

            if (results[index].status === "fulfilled") votes = this.getNumVotes(results[index].value);

            meme_data.weight = this.getPoint(votes, meme_data.createdAt);
            orderdMemes = this.insertInOreder(meme_data, "weight", orderdMemes);


        }
        return orderdMemes;



    }
}