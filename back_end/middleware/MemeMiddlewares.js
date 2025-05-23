import { MemesController } from "../controllers/MemesController.js";
import { toManyTags } from "../utils/error/index.js";

export function isMaxTagsReach(req, res, next) {

    if (req.body.length >= 5) return next(new toManyTags());

    MemesController.getMemeTags(req.params.id).then((result) => {
        if (result.length >= 5) return next(new toManyTags());
    }).catch(() => { });

    next();


}

