import { User } from "../models/DataBase.js"
import { Error } from "../utils/Error.js";


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
        return next(new Error(400, "campo email mancante"))
    }

    if (!req.body.password) {
        return next(new Error(400, "campo password mancante"))
    }

    next();
}

export function isNickNamePresent(req, res, next) {

    if (!req.body.nickName) {
        return next(new Error(400, "campo nickName mancante"))
    }

    next();

}
