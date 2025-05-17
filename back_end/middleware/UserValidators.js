import { User } from "../models/DataBase.js"
import { Error } from "../utils/Error.js";

export async function isUserPrsent(req, res, next) {
    let user = await User.findOne({
        where: {
            email: req.body.email
        },
    }
    );

    if (user !== null) {
        next(new Error(409, "l'utente esiste già"))
    }
    next();
}