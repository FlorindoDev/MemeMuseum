import { CommentVote } from "../models/DataBase.js";
import { VoteNotFoundError } from "../utils/error/index.js";

export class CommentVoteController {

    static async saveVote(req) {

        let vote = new CommentVote({
            upVote: req.body.upVote,
            UserIdUser: req.idUser,
            CommentIdComment: req.params.id
        })

        let result = await vote.save();

        if (!result) {
            return Promise.reject(new FailToSaveVote());
        }

        return result;


    }

    static async updateMemeVotes(what, where) {
        return await CommentVote.update(what, where);
    }

    static async getCommentVote(filters = {}, emptyCheck = true) {

        let result = await CommentVote.findAll(filters);

        if (emptyCheck && result.length === 0) return Promise.reject(new VoteNotFoundError());

        return result;
    }

    static async deleteCommentVote(filters = {}) {

        let result = await CommentVoteController.getCommentVote(filters);

        return result[0].destroy();

    }

}