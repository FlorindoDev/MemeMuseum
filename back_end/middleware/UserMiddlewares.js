import { User } from "../models/DataBase.js"
import { MissingFieldError } from "../utils/error/index.js";


export let isUserPrsent = (err) => async (req, res, next) => {

    let user = await User.findOne({
        where: {
            email: req.body.email
        },
    }
    );

    user !== null ? next(err) : next();

}

export function isEmailPasswordPresent(req, res, next) {

    if (!req.body.email) {
        return next(new MissingFieldError("email"))
    }

    if (!req.body.password) {
        return next(new MissingFieldError("password"))
    }

    next();
}

export function isNickNamePresent(req, res, next) {

    if (!req.body.nickName) {
        return next(new MissingFieldError("nickName"))
    }

    next();

}
