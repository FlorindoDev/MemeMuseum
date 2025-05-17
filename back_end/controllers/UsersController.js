import { User } from "../models/DataBase.js"

export class UsersController {


    static async getAllUsers(pageSize, page) {
        return await User.findAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
        });
    }

}