import express from "express";
import { Error } from "../utils/Error.js";
import { enforceAuthentication } from "../middleware/authorization.js"
import { UsersController } from "../controllers/UsersController.js";


export const router = express.Router();

router.use(enforceAuthentication);

router.post('/users', (req, res, next) => {
    UsersController.getAllUsers().then((result) => {
        res.status = 200;
        res.json(result);
    });

});
