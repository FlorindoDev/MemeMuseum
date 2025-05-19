import { AuthController } from "../controllers/AuthController.js";
import { UsersController } from "../controllers/UsersController.js";
import { UnauthorizedError } from "../utils/error/index.js";


export function enforceAuthentication(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1];
    if (!token) {
        next(new UnauthorizedError());
        return;
    }
    AuthController.isTokenValid(token, (err, decodedToken) => {
        if (err) {
            return next(new UnauthorizedError());
        } else {
            req.email_in_token = decodedToken.user;
            next();
        }
    });
}

export async function isOwnProfile(req, res, next) {
    await UsersController.getUserFromId(req.params.id).then((result) => {

        if (result === null) {
            return next(new UnauthorizedError());
        }

        if (result.dataValues.email != req.email_in_token) return next(new UnauthorizedError());

        next();
    });

}