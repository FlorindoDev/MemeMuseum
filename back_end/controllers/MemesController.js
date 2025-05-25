import { Meme, Tag } from '../models/DataBase.js'
import { Op } from "sequelize";
import { MemeNotFoundError, MemeUploadError } from '../utils/error/index.js';


export class MemesController {

    static checkPageAndIdUser(rawPageSize, rawPage, rawidUser) {

        const isPageSizeCorrect = rawPageSize > 0 && rawPageSize <= 10;

        let pageSize = (rawPageSize !== undefined && isPageSizeCorrect) ? rawPageSize : 10;

        let page = (rawPage !== undefined && rawPage > 0) ? rawPage : 1;

        let idUser = (rawidUser >= 1) ? rawidUser : null;

        return { pages: page, size: pageSize, iduser: idUser };
    }

    static async getAllMemes(filters = {}, emptyCheck = true) {


        let result = await Meme.findAll(filters);

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

    static createFilterForGetMeme(query, nametags) {

        let objectRequest = {
            limit: query.size,
            offset: (query.pages - 1) * query.size,
        };

        if (nametags !== undefined) {
            objectRequest.include = {
                model: Tag,
                required: true,         //forza innerjoin
                duplicating: false,     //evita che più volte lo stesso meme venga preso, se fosse true per ogni tags associato verrà stampato il meme(es 2 tag 2 volte stesso meme) e Impedisce l'uso di sottoquery
                attributes: []
            }
            objectRequest.where = {
                '$Tags.name$': {
                    [Op.in]: nametags
                }
            }
        }

        if (query.iduser !== null) {
            if (objectRequest.where === undefined) {
                objectRequest.where = { UserIdUser: query.iduser }
            } else {
                objectRequest.where.UserIdUser = query.iduser;
            }

        };

        return objectRequest;
    }

}