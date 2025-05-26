import { MissingFieldError } from "../utils/error/index.js";

export let isIdPresent = (campo) => (req, res, next) => {

    if (req[campo].id === undefined || isNaN(Number(req[campo].id))) return next(new MissingFieldError("id"));
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