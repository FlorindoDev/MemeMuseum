import { Meme, Tag, MemeVote } from '../models/DataBase.js'

import { MemeNotFoundError, MemeUploadError, FailToSaveTags, TagsNotFoundError, FailToSaveVote, VoteNotFoundError } from '../utils/error/index.js';


export class MemesController {

    static checkPageAndIdUser(rawPageSize, rawPage, rawidUser) {

        const isPageSizeCorrect = rawPageSize > 0 && rawPageSize <= 10;

        let pageSize = (rawPageSize !== undefined && isPageSizeCorrect) ? rawPageSize : 10;

        let page = (rawPage !== undefined && rawPage > 0) ? rawPage : 1;

        let idUser = (rawidUser >= 1) ? rawidUser : null;

        return { pages: page, size: pageSize, iduser: idUser };
    }

    static async getAllMemes(pageSize, page, idUser, emptyCheck = true) {

        let objectRequest = {
            limit: pageSize,
            offset: (page - 1) * pageSize,
        };

        if (idUser !== null) objectRequest.where = { UserIdUser: idUser };


        let result = await Meme.findAll(objectRequest);

        if (emptyCheck && result.length === 0) {
            return Promise.reject(new MemeNotFoundError());
        }

        return result;

    }

    static async saveMeme(req) {
        let meme;

        if (req.body.description !== undefined) {
            meme = new Meme(
                {
                    image: req.profilepicUrl,
                    description: req.body.description,
                    UserIdUser: req.idUser
                }
            );

        } else {
            meme = new Meme({ image: req.profilepicUrl, UserIdUser: req.idUser });
        }

        let result = await meme.save();

        if (!result) {
            return Promise.reject(new MemeUploadError());
        }

        return result;

    }

    static async getMemeFromId(id, emptyCheck = true) {
        let result = await Meme.findByPk(id);

        if (emptyCheck && result === null) {
            return Promise.reject(new MemeNotFoundError());
        }

        return result;

    }

    static async saveTags(idMeme, req) {

        let tags = [];

        let meme = await MemesController.getMemeFromId(idMeme);

        req.body.forEach(element => {
            tags.push(
                new Tag({
                    name: element.name.toLowerCase()
                })
            );
        });


        const existingTags = await Promise.all(
            tags.map(tag => Tag.findOne({ where: { name: tag.name } }))
        ).catch(() => {
            return Promise.reject(new FailToSaveTags());
        });


        let NonPrsentTags = tags.filter(tag => {

            for (let i = 0; i < existingTags.length; i++) {
                if (existingTags[i] != null && tag.name === existingTags[i].dataValues.name) return false;

            }
            return true;

        });


        let savedTags = await Promise.all(
            NonPrsentTags.map(tag => tag.save())      //map funzione di ordine superire 
        ).catch(() => {
            return Promise.reject(new FailToSaveTags());
        });

        let addedTags = savedTags.concat(existingTags);


        addedTags = addedTags.filter(tag => {
            if (tag === null) return false;
            return true
        })

        await meme.addTags(addedTags);
        return addedTags;
    }

    static async getMemeTags(idMeme, filters = {}, emptyCheck = true) {

        let meme = await MemesController.getMemeFromId(idMeme);

        let result = await meme.getTags(filters);

        if (emptyCheck && result.length === 0) return Promise.reject(new TagsNotFoundError());

        return result;

    }

    static isTagInList(tag, list) {
        let flag = false;
        for (let i = 0; i < list.length; i++) {
            if (tag.dataValues.name === list[i]) flag = true;
        }
        return flag;
    }

    static async saveVote(req) {

        let vote = new MemeVote({
            upVote: req.body.upVote,
            UserIdUser: req.idUser,
            MemeIdMeme: req.params.id
        })

        let result = await vote.save();

        if (!result) {
            return Promise.reject(new FailToSaveVote());
        }

        return result;


    }

    static async getMemeVotes(filters = {}, emptyCheck = true) {

        let result = await MemeVote.findAll(filters);

        if (emptyCheck && result.length === 0) return Promise.reject(new VoteNotFoundError());

        return result;

    }

    static async updateMemeVotes(what, where) {
        return await MemeVote.update(what, where);
    }

}