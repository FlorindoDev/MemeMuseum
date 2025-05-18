import { User } from "../models/DataBase.js"

export class UsersController {


    static async getAllUsers(pageSize, page) {
        return await User.findAll({
            attributes: ['idUser', 'nickName', 'email', 'profilePic', 'createdAt', 'updatedAt'],
            limit: pageSize,
            offset: (page - 1) * pageSize,
        });
    }

    static async getUserFromId(id) {
        return await User.findByPk(id, {
            attributes: ['idUser', 'nickName', 'email', 'profilePic', 'createdAt', 'updatedAt'],
        });
    }

    static checkPage(rawPageSize, rawPage) {

        const isPageSizeCorrect = rawPageSize > 0 && rawPageSize <= 10;


        let pageSize = (rawPageSize !== undefined && isPageSizeCorrect) ? rawPageSize : 10;
        let page = (rawPage !== undefined && rawPage > 0) ? rawPage : 1;

        return { pages: page, size: pageSize };
    }

}