import { CommentVoteController } from "../controllers/CommentVoteController.js";
import { VoteAlreadyExistsError } from "../utils/error/index.js";

export function isCommentVoteAlreadyExists(req, res, next) {

    let filters = {
        where: {
            UserIdUser: req.idUser,
            CommentIdComment: req.params.id
        }
    };

    CommentVoteController.getCommentVote(filters, false).then((result) => {

        if (result.length === 0) {
            req.isVotePresent = false;
            return next();
        }


        if (result[0].dataValues.upVote === req.body.upVote) {
            return next(new VoteAlreadyExistsError());
        }

        req.isVotePresent = true;
        return next();
    }).catch((err) => {

        return next(err);
    });

}