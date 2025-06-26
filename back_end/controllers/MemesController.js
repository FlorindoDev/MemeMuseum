import { Meme, Tag, User } from '../models/DataBase.js'
import { Op } from "sequelize";
import { MemeNotFoundError, MemeUploadError } from '../utils/error/index.js';


export class MemesController {

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

    static createFilterForGetMeme(query, nametags, username) {

        const includes = [];
        const whereConditions = [];

        const objectRequest = {
            limit: query.size,
            offset: (query.pages - 1) * query.size,
            attributes: [
                'idMeme',
                'image',
                'description',
                'createdAt',
                'updatedAt',
                'UserIdUser'
            ],
            group: ['Meme.idMeme']

        };

        if (nametags) {
            includes.push({
                model: Tag,
                required: true,
                duplicating: false,
                attributes: [],
                through: { attributes: [] }
            });
            whereConditions.push({
                [Op.or]: nametags.map(tag => ({
                    '$Tags.name$': {
                        [Op.iLike]: `%${tag}%`
                    }
                }))
            });
        }

        if (username) {
            includes.push({
                model: User,
                required: true,
                attributes: []
            });
            whereConditions.push({
                '$User.nickName$': {
                    [Op.iLike]: `%${username}%`
                }
            });

        }

        if (query.iduser) {
            whereConditions.push({ UserIdUser: query.iduser });
        }

        if (whereConditions.length) {
            objectRequest.where = { [Op.and]: whereConditions };
        }

        objectRequest.include = includes;

        return objectRequest;
    }

}