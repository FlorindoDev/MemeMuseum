import { AuthController } from "../controllers/AuthController.js";
import { UsersController } from "../controllers/UsersController.js";
import { User } from "../models/DataBase.js";
import { Error } from "../utils/Error.js";


export function enforceAuthentication(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1];
    if (!token) {
        next(new Error(401, "Unauthorized"));
        return;
    }
    AuthController.isTokenValid(token, (err, decodedToken) => {
        if (err) {
            return next(new Error(401, "Unauthorized"));
        } else {
            req.email_in_token = decodedToken.user;
            next();
        }
    });
}

export async function isOwnProfile(req, res, next) {
    await UsersController.getUserFromId(req.params.id).then((result) => {
        if (result === null) {
            return next(new Error(401, "Unauthorized"));
        }

        if (result.dataValues.email != req.email_in_token) return next(new Error(401, "Unauthorized"));

        next();
    });

}