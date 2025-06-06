import { MissingFieldError, VoteAlreadyExistsError, VoteNotFoundError } from "../utils/error/index.js";
import { VoteController } from "../controllers/VoteController.js";


export function isUserAlreadyVote(req, res, next) {

    let filters = {
        where: {
            UserIdUser: req.idUser,
            MemeIdMeme: req.query.idmeme
        }
    };

    VoteController.getMemeVotes(filters, false).then((result) => {

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