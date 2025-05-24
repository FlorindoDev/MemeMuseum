import { Tag } from '../models/DataBase.js'
import { MemesController } from './MemesController.js';
import { FailToSaveTags, TagsNotFoundError } from '../utils/error/index.js';


export class TagController {

    static async saveTags(idMeme, req) {

        let tags = [];

        let meme = await MemesController.getMemeFromId(idMeme);

        req.body.forEach(element => {
            tags.push(
                new Tag({
                    name: element.name.toLowerCase()
                })
            );
        });


        const existingTags = await Promise.all(
            tags.map(tag => Tag.findOne({ where: { name: tag.name } }))
        ).catch(() => {
            return Promise.reject(new FailToSaveTags());
        });


        let NonPrsentTags = tags.filter(tag => {

            for (let i = 0; i < existingTags.length; i++) {
                if (existingTags[i] != null && tag.name === existingTags[i].dataValues.name) return false;

            }
            return true;

        });


        let savedTags = await Promise.all(
            NonPrsentTags.map(tag => tag.save())      //map funzione di ordine superire 
        ).catch(() => {
            return Promise.reject(new FailToSaveTags());
        });

        let addedTags = savedTags.concat(existingTags);


        addedTags = addedTags.filter(tag => {
            if (tag === null) return false;
            return true
        })

        await meme.addTags(addedTags);
        return addedTags;
    }

    static async getMemeTags(idMeme, filters = {}, emptyCheck = true) {

        let meme = await MemesController.getMemeFromId(idMeme);

        let result = await meme.getTags(filters);

        if (emptyCheck && result.length === 0) return Promise.reject(new TagsNotFoundError());

        return result;

    }

    static isTagInList(tag, list) {
        let flag = false;
        for (let i = 0; i < list.length; i++) {
            if (tag.dataValues.name === list[i]) flag = true;
        }
        return flag;
    }

}