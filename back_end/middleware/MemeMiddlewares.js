import { toManyTags } from "../utils/error/index.js";
import { TagController } from "../controllers/TagController.js";
import { MemesController } from "../controllers/MemesController.js";


export function isMaxTagsReach(req, res, next) {

    if (req.body.length > 5) return next(new toManyTags());
    TagController.getMemeTags(req.params.id).then((result) => {
        if (result.length >= 5) {
            req.returned = true;
            return next(new toManyTags());
        }
    }).catch(() => { });
    req.returned = false;
    next();


}

export let isMemeExists = (reqPositionName, reqFieldName) => (req, res, next) => {

    MemesController.getMemeFromId(req[reqPositionName][reqFieldName]).then(() => {
        return next();
    }).catch((err) => {
        return next(err);
    });

}
