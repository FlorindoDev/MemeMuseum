import { AuthController } from "../controllers/AuthController.js";
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
            next(new Error(401, "Unauthorized"));
        } else {
            req.username = decodedToken.user;
            next();
        }
    });
}