import { Meme } from '../models/DataBase.js'
import { MemeNotFoundError, MemeUploadError } from '../utils/error/index.js';


export class MemesController {

    static checkPage(rawPageSize, rawPage) {

        const isPageSizeCorrect = rawPageSize > 0 && rawPageSize <= 10;


        let pageSize = (rawPageSize !== undefined && isPageSizeCorrect) ? rawPageSize : 10;
        let page = (rawPage !== undefined && rawPage > 0) ? rawPage : 1;

        return { pages: page, size: pageSize };
    }

    static async getAllMemes(pageSize, page) {
        let result = await Meme.findAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
        });

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

}