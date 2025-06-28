import { Meme, Tag, User, MemeVote } from '../models/DataBase.js'
import { Op, Sequelize } from "sequelize";
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

    static createFilterForGetMeme(query, nametags, username, orderby, orderbydate) {

        const includes = [];
        const whereConditions = [];

        const objectRequest = {
            subQuery: false,
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

        objectRequest.order = [];

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

        if (orderby !== undefined) {
            let vote = orderby[0] === "upvote" ? true : false;

            includes.push({
                model: MemeVote,
                attributes: [],
                required: false  // per includere anche i meme con 0 upvote
            });

            objectRequest.attributes = {

                include: [
                    [Sequelize.literal(`COUNT(CASE WHEN "MemeVotes"."upVote" = ${vote} THEN 1 ELSE NULL END)`), orderby[0]]
                ]
            };
            objectRequest.group = ['Meme.idMeme'];
            objectRequest.order = [[orderby[0], orderby[1].toUpperCase()]];
        }

        if (query.iduser) {
            whereConditions.push({ UserIdUser: query.iduser });
        }

        if (orderbydate) {
            objectRequest.order.push(["createdAt", orderbydate])
        }

        if (whereConditions.length) {
            objectRequest.where = { [Op.and]: whereConditions };
        }

        objectRequest.include = includes;

        return objectRequest;
    }

}