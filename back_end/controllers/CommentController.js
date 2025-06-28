import { Comment } from '../models/DataBase.js'
import { CommentVote } from '../models/DataBase.js';
import { FailToSaveComment, CommentNotFoundError } from '../utils/error/index.js';
import { Sequelize } from 'sequelize';

export class CommentController {

    static async saveComment(req) {

        let comment = new Comment({
            content: req.body.content,
            MemeIdMeme: req.query.idmeme,
            UserIdUser: req.idUser
        })

        let result;

        try {
            result = await comment.save();
        } catch {
            return Promise.reject(new FailToSaveComment());
        }


        return result

    }

    static async getCommentMeme(filters = {}, emptyCheck = true) {

        let result = await Comment.findAll(filters);

        if (emptyCheck && result.length === 0) return Promise.reject(new CommentNotFoundError());

        return result;
    }

    static createFilterGetComment(paginazione, idmeme, iduser, orderby, count) {

        let filters = { where: {} }

        if (count != "true") {
            filters.subQuery = false;
            filters.limit = paginazione.size;
            filters.offset = (paginazione.pages - 1) * paginazione.size;

        }

        if (idmeme !== undefined) {
            filters.where.MemeIdMeme = idmeme;
        }

        if (iduser !== undefined) {
            filters.where.UserIdUser = iduser;
        }

        if (orderby !== undefined) {
            filters.include = [{
                model: CommentVote,
                attributes: [],
                required: false  // per includere anche i meme con 0 upvote
            }];
            filters.attributes = {
                include: [
                    [
                        Sequelize.literal(`
                            COUNT(CASE WHEN "CommentVotes"."upVote" = true THEN 1 ELSE NULL END)
                            - 
                            COUNT(CASE WHEN "CommentVotes"."upVote" = false THEN 1 ELSE NULL END)
                        `),
                        'voteDifference'
                    ]
                ]
            };
            filters.group = ['Comment.idComment'];
            filters.order = [["voteDifference", orderby[1].toUpperCase()]];
        }
        return filters;
    }

    static async deleteComment(idcomment) {

        let result = await CommentController.getCommentMeme({ where: { idComment: idcomment } });

        return result[0].destroy();

    }
}