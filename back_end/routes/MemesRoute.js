import express from "express"
import { upLoad as upLoadOnGoogle } from "../middleware/GoogleStorage.js"
import { enforceAuthentication, isOwnMeme } from "../middleware/authorization.js"
import { MemesController } from "../controllers/MemesController.js";
import { isMaxTagsReach } from "../middleware/MemeMiddlewares.js";
import { queryParamsToList } from "../middleware/Middlewares.js";
import { TagController } from "../controllers/TagController.js";
import { schemaMemeGet, idMemeRequiredParams, schemaTagsPost, schemaTagsGet } from "../schemas/meme.schema.js";
import { validate } from "../middleware/Middlewares.js";
import { DailyMemeController } from "../controllers/DailyMemeController.js";

import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
const imageParser = upload.fields([{ name: 'image', maxCount: 1 }])

//TODO aggiungere possibilità di eliminare meme e aggiornare la descrizione (aggiungi i delete on cascade)

export const router = express.Router();

/**
 * @swagger
 * {
 *   "paths": {
 *     "/memes": {
 *       "post": {
 *         "tags": [
 *           "Memes"
 *         ],
 *         "summary": "Crea un nuovo meme",
 *         "security": [
 *           {
 *             "bearerAuth": []
 *           }
 *         ],
 *         "requestBody": {
 *           "required": true,
 *           "content": {
 *             "multipart/form-data": {
 *               "schema": {
 *                 "type": "object",
 *                 "properties": {
 *                   "image": {
 *                     "type": "string",
 *                     "format": "binary",
 *                     "description": "File immagine del meme (obbligatorio)"
 *                   },
 *                   "description": {
 *                     "type": "string",
 *                     "description": "Testo descrittivo del meme"
 *                   }
 *                 },
 *                 "required": [
 *                   "image"
 *                 ]
 *               }
 *             }
 *           }
 *         },
 *         "responses": {
 *           "200": {
 *             "description": "Meme salvato con successo"
 *           },
 *           "400": {
 *             "description": "Parametri mancanti o non validi"
 *           },
 *           "401": {
 *             "description": "Token JWT mancante o non valido"
 *           },
 *           "500": {
 *             "description": "Errore interno del server"
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
router.post('/', [enforceAuthentication, imageParser, upLoadOnGoogle], (req, res, next) => {
    MemesController.saveMeme(req).then((result) => {
        res.status(200);
        res.send(result);
    }).catch((err) => {
        next(err)
    });

});


/**
 * @swagger
 * {
 *   "/memes": {
 *     "get": {
 *       "tags": ["Memes"],
 *       "summary": "Recupera la lista dei memes",
 *       "description": "Restituisce una paginazione di memes; i parametri `pagesize`,`page`, `iduser` e `nametags` sono opzionali.",
 *       "parameters": [
 *         {
 *           "name": "pagesize",
 *           "in": "query",
 *           "description": "Numero di memes per pagina (1–10). Default: 10",
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
 *         },
 *          {
 *             "name": "orderby",
 *             "in": "query",
 *             "required": false,
 *             "description": "elemento per cui vuoi ordinare: `upvote,ASC/DESC` o `downvote,ASC/DESC`",
 *             "schema": {
 *               "type": "string"
 *             }
 *           },
 *              {
 *             "name": "orderbydate",
 *             "in": "query",
 *             "required": false,
 *             "description": "ordina per data: `ASC` o `DESC`",
 *             "schema": {
 *               "type": "string"
 *             }
 *           },
 *          {
 *           "name": "iduser",
 *           "in": "query",
 *           "description": "Id del utente di cui si vuole vedere i memes (>= 1)",
 *           "required": false,
 *           "schema": {
 *             "type": "integer",
 *             "minimum": 1
 *           }
 *          },
 *          {
 *           "name": "username",
 *           "in": "query",
 *           "description": "username del utente di cui si vuole vedere i memes",
 *           "required": false,
 *           "schema": {
 *             "type": "string",
 *           }
 *          },
 *          {
 *           "name": "nametags",
 *           "in": "query",
 *           "description": "Lista di nomi dei tag da filtrare, separati da virgola (es. name1,name2)",
 *           "required": false,
 *           "schema": {
 *             "type": "string"
 *           }
 *         }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "Lista di memes trovati",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "array",
 *                 "items": { "$ref": "#/components/schemas/Meme" }
 *               },
 *                "example": {
 *                      "idMeme": 1,
 *                      "image": "meme/url/image.png",
 *                      "description": "un gatto",
 *                      "createdAt": "2025-05-17T16:18:36.773Z",
 *                      "updatedAt": "2025-05-17T16:18:36.773Z",
 *                       "UserIdUser": 5
 *               }
 *             }
 *           }
 *         },
 *         "404": {
 *           "description": "Nessun memes trovato",
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
router.get('/', [validate(schemaMemeGet, true), queryParamsToList(['nametags', 'orderby'])], (req, res, next) => {

    let query = { pages: req.checked.query.page, size: req.checked.query.pagesize, iduser: req.query.iduser };

    let filters = MemesController.createFilterForGetMeme(query, req.nametags, req.query.username, req.orderby, req.query.orderbydate);

    MemesController.getAllMemes(filters).then((result) => {

        res.status(200);
        res.json(result);

    }).catch((err) => {
        next(err)
    });

});


/**
 * @swagger
 * {
 *   "/memes/fetchDailyMeme": {
 *     "get": {
 *       "tags": ["Memes"],
 *       "summary": "Recupera la lista dei memes",
 *       "description": "Restituisce una paginazione di memes; i parametri `pagesize`,`page`, `iduser` e `nametags` sono opzionali.",
 *       "parameters": [
 *         {
 *           "name": "pagesize",
 *           "in": "query",
 *           "description": "Numero di memes per pagina (1–10). Default: 10",
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
 *         },
 *          {
 *           "name": "iduser",
 *           "in": "query",
 *           "description": "Id del utente di cui si vuole vedere i memes (>= 1)",
 *           "required": false,
 *           "schema": {
 *             "type": "integer",
 *             "minimum": 1
 *           }
 *          },
 *          {
 *           "name": "username",
 *           "in": "query",
 *           "description": "username del utente di cui si vuole vedere i memes",
 *           "required": false,
 *           "schema": {
 *             "type": "string",
 *           }
 *          },
 *          {
 *           "name": "nametags",
 *           "in": "query",
 *           "description": "Lista di nomi dei tag da filtrare, separati da virgola (es. name1,name2)",
 *           "required": false,
 *           "schema": {
 *             "type": "string"
 *           }
 *         }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "Lista di memes trovati",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "array",
 *                 "items": { "$ref": "#/components/schemas/Meme" }
 *               },
 *                "example": {
 *                      "idMeme": 1,
 *                      "image": "meme/url/image.png",
 *                      "description": "un gatto",
 *                      "createdAt": "2025-05-17T16:18:36.773Z",
 *                      "updatedAt": "2025-05-17T16:18:36.773Z",
 *                       "UserIdUser": 5
 *               }
 *             }
 *           }
 *         },
 *         "404": {
 *           "description": "Nessun memes trovato",
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
router.get('/fetchDailyMeme', [validate(schemaMemeGet, true), queryParamsToList(['nametags'])], (req, res, next) => {

    let filters = DailyMemeController.makeFilterForDailyMeme(req);

    DailyMemeController.dailyMeme(filters).then((result) => {

        res.status(200);
        res.json(result);

    }).catch((err) => {
        next(err)
    });

});


/**
 * @swagger
 * {
 *   "/memes/{id}": {
 *     "get": {
 *       "tags": ["Memes"],
 *       "summary": "Recupera un meme tramite ID",
 *       "description": "Restituisce le informazioni dettagliate di un meme in base all'ID specificato",
 *       "operationId": "getMemeById",
 *       "parameters": [
 *         {
 *           "name": "id",
 *           "in": "path",
 *           "description": "ID dell'meme da recuperare",
 *           "required": true,
 *           "schema": {
 *             "type": "string"
 *           }
 *         }
 *       ],
 *       "produces": ["application/json"],
 *       "responses": {
 *         "200": {
 *           "description": "meme trovato",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "object",
 *                 "items": { "$ref": "#/components/schemas/Meme" }
 *               },
 *                "example": {
 *                      "idMeme": 1,
 *                      "image": "meme/url/image.png",
 *                      "description": "un gatto",
 *                      "createdAt": "2025-05-17T16:18:36.773Z",
 *                      "updatedAt": "2025-05-17T16:18:36.773Z",
 *                      "UserIdUser": 1
 *               }
 *             }
 *           }
 *         },
 *         "404": {
 *           "description": "Utente non trovato",
 *           "schema": {
 *             "$ref": "#/components/schemas/Error"
 *           }
 *         },
 *         "500": {
 *           "description": "Errore del server",
 *           "schema": {
 *             "$ref": "#/components/schemas/Error"
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
router.get('/:id', validate(idMemeRequiredParams), (req, res, next) => {

    MemesController.getMemeFromId(req.params.id).then((result) => {

        res.status(200);
        res.json(result);

    }).catch((err) => {
        next(err)
    });

});


/**
 * @swagger
 * {
 *   "/memes/{id}/tags": {
 *     "post": {
 *       "tags": ["Memes"],
 *       "summary": "Aggiunge tag a un meme",
 *       "security": [
 *         {
 *           "bearerAuth": []
 *         }
 *       ],
 *       "description": "Aggiunge una lista di tag a un meme specificato tramite ID, Messimo 5 tags per meme",
 *       "operationId": "addTagsToMeme",
 *       "parameters": [
 *         {
 *           "name": "id",
 *           "in": "path",
 *           "description": "ID del meme",
 *           "required": true,
 *           "schema": {
 *             "type": "string"
 *           }
 *         }
 *       ],
 *       "requestBody": {
 *         "required": true,
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "type": "array",
 *               "items": {
 *                 "$ref": "#/components/schemas/Tag"
 *               }
 *             },
 *             "example": [
 *               { "name": "Video giochi" }
 *             ]
 *           }
 *         }
 *       },
 *       "responses": {
 *         "200": {
 *           "description": "Tag aggiunti con successo",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "array",
 *                 "items": {
 *                   "$ref": "#/components/schemas/Tag"
 *                 }
 *               },
 *               "example": [
 *                 {
 *                   "idTag": 22,
 *                   "name": "Video giochi",
 *                   "createdAt": "2025-05-22T17:10:16.022Z",
 *                   "updatedAt": "2025-05-22T17:10:16.022Z"
 *                 }
 *               ]
 *             }
 *           }
 *         },
 *         "404": {
 *           "description": "Meme non trovato",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/Error"
 *               }
 *             }
 *           }
 *         },
 *          "403": {
 *           "description": "Hai superato il limite di tags per questo meme",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/Error"
 *               }
 *             }
 *           }
 *         },
 *         "500": {
 *           "description": "Errore del server",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/Error"
 *               }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
router.post('/:id/tags', [validate(schemaTagsPost), enforceAuthentication, isOwnMeme, isMaxTagsReach], (req, res, next) => {

    TagController.saveTags(req.params.id, req).then((result) => {

        if (!req.returned) {
            res.status(200);
            res.json(result);
        }


    }).catch((err) => {
        return next(err);
    });

});


/**
 * @swagger
 * {
 *   "/memes/{id}/tags": {
 *     "get": {
 *       "tags": ["Memes"],
 *       "summary": "Ritorna tags di un meme",
 *       "description": "Ritorna tags di un meme dato ID del meme. È possibile filtrare i tag passando un parametro opzionale 'nametags' con una lista di nomi separati da virgola.",
 *       "operationId": "getTagsToMeme",
 *       "parameters": [
 *         {
 *           "name": "id",
 *           "in": "path",
 *           "description": "ID del meme",
 *           "required": true,
 *           "schema": {
 *             "type": "string"
 *           }
 *         },
 *         {
 *           "name": "nametags",
 *           "in": "query",
 *           "description": "Lista di nomi dei tag da filtrare, separati da virgola (es. name1,name2)",
 *           "required": false,
 *           "schema": {
 *             "type": "string"
 *           }
 *         }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "Tag Restituiti con successo",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "array",
 *                 "items": {
 *                   "$ref": "#/components/schemas/Tag"
 *                 }
 *               },
 *               "example": [
 *                 {
 *                   "idTag": 22,
 *                   "name": "Video giochi",
 *                   "createdAt": "2025-05-22T17:10:16.022Z",
 *                   "updatedAt": "2025-05-22T17:10:16.022Z"
 *                 }
 *               ]
 *             }
 *           }
 *         },
 *         "404": {
 *           "description": "Meme non trovato",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/Error"
 *               }
 *             }
 *           }
 *         },
 *         "500": {
 *           "description": "Errore del server",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/Error"
 *               }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
router.get('/:id/tags', [validate(schemaTagsGet), queryParamsToList(['nametags'])], (req, res, next) => {

    TagController.getMemeTags(req.params.id).then((result) => {

        if (req.nametags !== undefined) {

            result = result.filter(tag => {
                return TagController.isTagInList(tag, req.nametags);
            });

        }

        res.status(200);
        res.json(result);

    }).catch((err) => {
        next(err);
    });

});


/**
 * @swagger
 * {
 *   "/memes/{id}/tags": {
 *     "delete": {
 *       "tags": ["Memes"],
 *       "summary": "Cancella tag associati a un meme",
 *       "security": [
 *         {
 *           "bearerAuth": []
 *         }
 *       ],
 *       "description": "Cancella tags di un meme dato ID del meme e specificando i tag in `nametags` con una lista di nomi separati da virgola.",
 *       "operationId": "deleteTagsToMeme",
 *       "parameters": [
 *         {
 *           "name": "id",
 *           "in": "path",
 *           "description": "ID del meme",
 *           "required": true,
 *           "schema": {
 *             "type": "string"
 *           }
 *         },
 *         {
 *           "name": "nametags",
 *           "in": "query",
 *           "description": "Lista di nomi dei tag da filtrare, separati da virgola (es. name1,name2)",
 *           "required": true,
 *           "schema": {
 *             "type": "string"
 *           }
 *         }
 *       ],
 *       "responses": {
 *         "200": {
 *           "description": "Tag Cancellati con successo",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "array",
 *                 "items": {
 *                   "$ref": "#/components/schemas/Tag"
 *                 }
 *               },
 *               "example": [
 *                 {
 *                   "idTag": 22,
 *                   "name": "Video giochi",
 *                   "createdAt": "2025-05-22T17:10:16.022Z",
 *                   "updatedAt": "2025-05-22T17:10:16.022Z"
 *                 }
 *               ]
 *             }
 *           }
 *         },
 *         "404": {
 *           "description": "Meme non trovato",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/Error"
 *               }
 *             }
 *           }
 *         },
 *         "500": {
 *           "description": "Errore del server",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/Error"
 *               }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
router.delete('/:id/tags', [validate(schemaTagsGet), enforceAuthentication, isOwnMeme, queryParamsToList(['nametags'], true)], (req, res, next) => {

    TagController.deleteTagsFromMeme(req.params.id, req.nametags).then((result) => {

        res.status(200);
        res.json({ deletedtags: result });

    }).catch((err) => {
        next(err);
    });

});


