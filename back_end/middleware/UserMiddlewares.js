import { User } from "../models/DataBase.js"



export let isUserPrsent = (err) => async (req, res, next) => {

    let user = await User.findOne({
        where: {
            email: req.body.email
        },
    }
    );

    user !== null ? next(err) : next();

}
