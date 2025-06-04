import { MissingFieldError, FieldError } from "../utils/error/index.js";

export let isIdPresent = (reqCampo, campo = "id") => (req, res, next) => {

    if (req[reqCampo][campo] === undefined || isNaN(Number(req[reqCampo][campo]))) return next(new MissingFieldError(`${campo}`));
    next();
}


export let queryParamsToList = (listParams = [], required = false) => (req, res, next) => {

    if (required) {
        listParams.forEach((value) => {
            if (req.query[value] === undefined) return next(new MissingFieldError(value));
        });
    }


    listParams.forEach((value) => {
        if (req.query[value] !== undefined) req[value] = req.query[value].split(',').map(item => item.toLowerCase().trim());
    })
    next();

}

export let isFieldsPresent = (where, list = [], leastOne = true) => (req, res, next) => {

    let resultList = list.map(field => {
        if (req[where][field] === undefined) return false;
        return true;
    });

    if (leastOne) {
        for (let i = 0; i < resultList.length; i++) {
            if (resultList[i]) return next();
        }
        return next(new MissingFieldError(`${list}`));
    }

    for (let i = 0; i < resultList.length; i++) {
        if (resultList[i]) return next(new MissingFieldError(`${list}`));
    }
    return next();

}

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (e) {
        return next(new FieldError(e.errors));
    }
};