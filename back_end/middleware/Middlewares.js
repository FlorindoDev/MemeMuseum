export let queryParamsToList = (listParams = []) => (req, res, next) => {

    listParams.forEach((value) => {
        if (req.query[value] !== undefined) req[value] = req.query[value].split(',');
    })
    next();

}