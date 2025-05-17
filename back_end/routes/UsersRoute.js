import express from "express";
import { Error } from "../utils/Error.js";
import { enforceAuthentication } from "../middleware/authorization.js"
import { UsersController } from "../controllers/UsersController.js";


export const router = express.Router();


//TODO: levare era di prova
//router.use(enforceAuthentication);


/**
 * @swagger
 * {
 *   "/users": {
 *     "get": {
 *       "tags": ["Users"],
 *       "summary": "Recupera la lista degli utenti",
 *       "description": "Restituisce una paginazione di utenti; i parametri `pagesize` e `page` sono opzionali.",
 *       "parameters": [
 *         {
 *           "name": "pagesize",
 *           "in": "query",
 *           "description": "Numero di utenti per pagina (1–10). Default: 10",
 *           "required": false,
 *           "schema": {
 *             "type": "integer",
 *             "minimum": 1,
 *             "maximum": 10,
 *             "default": 10
 *           }
 *         },
 *         {
 *           "name": "page",
 *           "in": "query",
 *           "description": "Numero di pagina da visualizzare (>=1). Default: 1",
 *           "required": false,
 *           "schema": {
 *             "type": "integer",
 *             "minimum": 1,
 *             "default": 1
 *           }
 *         }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "Lista di utenti trovati",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "array",
 *                 "items": { "$ref": "#/components/schemas/User" }
 *               }
 *             }
 *           }
 *         },
 *         "209": {
 *           "description": "Nessun utente trovato",
 *           "content": {
 *             "application/json": {
 *               "schema": { "$ref": "#/components/schemas/Error" }
 *             }
 *           }
 *         },
 *       }
 *     }
 *   }
 * }
 */
router.get('/users', async (req, res, next) => {

    const rawPageSize = req.query.pagesize;
    const rawPage = req.query.page;

    const isPageSizeCorrect = rawPageSize > 0 && rawPageSize <= 10;


    let pageSize = (rawPageSize !== undefined && isPageSizeCorrect) ? rawPageSize : 10;
    let page = (rawPage !== undefined && rawPage > 0) ? rawPage : 1;

    UsersController.getAllUsers(pageSize, page).then((result) => {
        if (result.length !== 0) {
            res.status(200);
            res.json(result);
        } else {
            next(new Error(209, "non ci sono utenti"));
        }

    });

});
