import { CommentController } from "../controllers/CommentController.js";
import { CommentNotFoundError } from "../utils/error/index.js";

export function isCommentExists(req, res, next) {

    CommentController.getCommentMeme({ where: { idComment: req.params.id } }).then(() => {
        return next();
    }).catch(() => {
        return next(new CommentNotFoundError());
    });
}