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


    static async checkCredentials(req, res) {
        let user = User.findOne({
            where: {
                email: req.body.email,
                password: req.body.password
            },
        }
        );

        return user !== null
    }


}