import { Meme } from '../models/Meme.js'


export class MemesController {

    static async saveUser(req) {

        let meme = new Meme(
            {
                idMeme: req.body.idMeme,
                image: req.body.image,
                description: req.body.description
            }
        );
        return meme.save();
    }

}