import { AuthController } from "../controllers/AuthController.js";
import { MemesController } from "../controllers/MemesController.js";
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
            req.idUser = decodedToken.idUser;
            next();
        }
    });
}

export function isOwnProfile(req, res, next) {

    if (req.idUser != req.params.id) return next(new UnauthorizedError());

    next();

}

export function isOwnMeme(req, res, next) {

    MemesController.getMemeFromId(req.params.id).then((result) => {

        if (result.dataValues.UserIdUser !== req.idUser) {
            return next(new UnauthorizedError());
        }
        return next();
    }).catch((err) => {
        return next(err);
    })

}