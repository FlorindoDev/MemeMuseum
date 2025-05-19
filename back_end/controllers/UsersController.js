import { User } from "../models/DataBase.js"
import { UserNotFoundError, FailToUpdateUser } from "../utils/error/index.js";

export class UsersController {


    static async getAllUsers(pageSize, page) {
        let result = await User.findAll({
            attributes: ['idUser', 'nickName', 'email', 'profilePic', 'createdAt', 'updatedAt'],
            limit: pageSize,
            offset: (page - 1) * pageSize,
        });

        if (result.length === 0) {
            return Promise.reject(new UserNotFoundError());
        }

        return result;

    }

    static async getUserFromId(id) {
        let result = await User.findByPk(id, {
            attributes: ['idUser', 'nickName', 'email', 'profilePic', 'createdAt', 'updatedAt'],
        });

        if (result === null) {
            return Promise.reject(new UserNotFoundError());
        }

        return result;

    }

    static checkPage(rawPageSize, rawPage) {

        const isPageSizeCorrect = rawPageSize > 0 && rawPageSize <= 10;


        let pageSize = (rawPageSize !== undefined && isPageSizeCorrect) ? rawPageSize : 10;
        let page = (rawPage !== undefined && rawPage > 0) ? rawPage : 1;

        return { pages: page, size: pageSize };
    }

    static async updateProfilePic(id, link) {
        let result = await User.update(
            {
                profilePic: link
            },
            {
                where: {
                    idUser: id
                }
            }
        );

        if (result[0] == 0) {
            return Promise.reject(new FailToUpdateUser());
        }

        return result;
    }

}