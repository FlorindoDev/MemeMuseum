import { Comment } from '../models/DataBase.js'
import { FailToSaveComment, CommentNotFoundError } from '../utils/error/index.js';

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

    static createFilterGetVote(idmeme, iduser) {
        let filters = { where: {} }

        if (idmeme !== undefined) {
            filters.where.MemeIdMeme = idmeme;
        }

        if (iduser !== undefined) {
            filters.where.UserIdUser = iduser;
        }

        return filters;
    }

    static async deleteComment(idcomment) {

        let result = await CommentController.getCommentMeme({ where: { idComment: idcomment } });

        return result[0].destroy();

    }
}