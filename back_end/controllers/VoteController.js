import { MemeVote } from '../models/DataBase.js'
import { FailToSaveVote, VoteNotFoundError } from '../utils/error/index.js';


export class VoteController {

    static async saveVote(req) {

        let vote = new MemeVote({
            upVote: req.body.upVote,
            UserIdUser: req.idUser,
            MemeIdMeme: req.query.id
        })

        let result = await vote.save();

        if (!result) {
            return Promise.reject(new FailToSaveVote());
        }

        return result;


    }

    static async getMemeVotes(filters = {}, emptyCheck = true) {

        let result = await MemeVote.findAll(filters);

        if (emptyCheck && result.length === 0) return Promise.reject(new VoteNotFoundError());

        return result;

    }

    static async updateMemeVotes(what, where) {
        return await MemeVote.update(what, where);
    }

    static async deleteMemeVote(filter = {}) {

        return await MemeVote.destroy(filter);

    }
}