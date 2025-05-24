import { Meme } from '../models/DataBase.js'

import { MemeNotFoundError, MemeUploadError } from '../utils/error/index.js';


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

}