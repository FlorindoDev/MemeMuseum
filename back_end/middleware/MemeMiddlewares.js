import { MemesController } from "../controllers/MemesController.js";
import { toManyTags } from "../utils/error/index.js";
import { VoteAlreadyExistsError, VoteNotFoundError } from "../utils/error/index.js";

export function isMaxTagsReach(req, res, next) {

    if (req.body.length >= 5) return next(new toManyTags());

    MemesController.getMemeTags(req.params.id).then((result) => {
        if (result.length >= 5) {
            req.returned = true;
            return next(new toManyTags());
        }
    }).catch(() => { });
    req.returned = false;
    next();


}

export function isUserAlreadyVote(req, res, next) {

    let filters = {
        where: {
            UserIdUser: req.idUser,
            MemeIdMeme: req.params.id
        }
    };

    MemesController.getMemeVotes(filters).then((result) => {

        if (result.length === 0) {
            req.isVotePresent = false;
            return next();
        }


        if (result[0].dataValues.upVote === req.body.upVote) {
            return next(new VoteAlreadyExistsError());
        }

        req.isVotePresent = true;
        return next();
    }).catch(() => {

        return next(new VoteNotFoundError());
    });



}