import { User } from "../models/DataBase.js"
import { Error } from "../utils/Error.js";


export let isUserPrsent = (err) => async (req, res, next) => {
    let user = await User.findOne({
        where: {
            email: req.body.email
        },
    }
    );

    console.log(user);
    if (user !== null) {
        next(err);
    }
    next();
}
