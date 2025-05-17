import { User } from "../models/DataBase.js"

export class UsersController {

    //TODO: è di prova , poi cambialo
    static async getAllUsers() {
        return await User.findAll();
    }

}