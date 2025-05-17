import { User } from "../models/DataBase.js";
import Jwt from "jsonwebtoken";

export class AuthController {

    static async saveUser(req) {

        let user = new User(
            {
                idUser: req.body.idUser,
                nickName: req.body.nickName,
                email: req.body.email,
                profilePic: req.body.profilePic,
                password: req.body.password
            }
        );
        return user.save();
    }


    static async checkCredentials(req) {

        let user = new User({
            email: req.body.email,
            password: req.body.password
        });

        let found = await User.findOne({
            where: {
                email: user.email,
                password: user.password
            },
        }
        );

        return found !== null
    }

    static issueToken(username) {
        return Jwt.sign({ user: username }, process.env.TOKEN_SECRET, { expiresIn: `1d` });
    }


}