import { Meme, Tag, database } from '../models/DataBase.js'

import { MemeNotFoundError, MemeUploadError, FailToSaveTags } from '../utils/error/index.js';


export class MemesController {

    static checkPageAndIdUser(rawPageSize, rawPage, rawidUser) {

        const isPageSizeCorrect = rawPageSize > 0 && rawPageSize <= 10;

        let pageSize = (rawPageSize !== undefined && isPageSizeCorrect) ? rawPageSize : 10;

        let page = (rawPage !== undefined && rawPage > 0) ? rawPage : 1;

        let idUser = (rawidUser >= 1) ? rawidUser : null;

        return { pages: page, size: pageSize, iduser: idUser };
    }

    static async getAllMemes(pageSize, page, idUser) {

        let objectRequest = {
            limit: pageSize,
            offset: (page - 1) * pageSize,
        };

        if (idUser !== null) objectRequest.where = { UserIdUser: idUser };


        let result = await Meme.findAll(objectRequest);

        if (result.length === 0) {
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
            meme = new Meme({ image: req.profilepicUrl });
        }

        let result = await meme.save();

        if (!result) {
            return Promise.reject(new MemeUploadError());
        }

        return result;

    }

    static async getMemeFromId(id) {
        let result = await Meme.findByPk(id);

        if (result === null) {
            return Promise.reject(new MemeNotFoundError());
        }

        return result;

    }

    //TODO: se un tag eseite non lancare eccezione ma assegnalo al meme
    static async saveTags(idMeme, req) {

        let tags = [];

        let meme = await MemesController.getMemeFromId(idMeme);

        req.body.forEach(element => {
            tags.push(
                new Tag({
                    name: element.name
                })
            );
        });

        const transaction = await database.transaction();


        const savedTags = await Promise.all(
            tags.map(tag => tag.save({ transaction }))      //map funzione di ordine superire 
        ).catch((err) => {
            //console.log(err);
            transaction.rollback();
            return Promise.reject(new FailToSaveTags());
        });

        transaction.commit();

        return await meme.addTag(savedTags);
    }

}