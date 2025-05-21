import express from "express"
import { upLoad as upLoadOnGoogle } from "../middleware/GoogleStorage.js"
import { enforceAuthentication, isOwnMeme } from "../middleware/authorization.js"
import { MemesController } from "../controllers/MemesController.js";

import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
const imageParser = upload.fields([{ name: 'image', maxCount: 1 }])


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
    MemesController.saveMeme(req).then(() => {
        res.status(200);
        res.send();
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
 *       "description": "Restituisce una paginazione di memes; i parametri `pagesize`,`page` e `iduser` sono opzionali.",
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
 *          }
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
 *                      "upVoteNum": "1",
 *                      "downVoteNum": "0",
 *                      "commentNum": "2",
 *                      "createdAt": "2025-05-17T16:18:36.773Z",
 *                      "updatedAt": "2025-05-17T16:18:36.773Z"
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
router.get('/', (req, res, next) => {

    const rawPageSize = req.query.pagesize;
    const rawPage = req.query.page;
    const rawidUser = req.query.iduser;


    let query = MemesController.checkPageAndIdUser(rawPageSize, rawPage, rawidUser);

    MemesController.getAllMemes(query.size, query.pages, query.iduser).then((result) => {

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
 *                      "upVoteNum": "1",
 *                      "downVoteNum": "0",
 *                      "commentNum": "2",
 *                      "createdAt": "2025-05-17T16:18:36.773Z",
 *                      "updatedAt": "2025-05-17T16:18:36.773Z"
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
router.get('/:id', (req, res, next) => {

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
 *           {
 *             "bearerAuth": []
 *           }
 *         ],
 *       "description": "Aggiunge una lista di tag a un meme specificato tramite ID",
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
 *               },
 *              "example": [{"name": "Video giochi"}]  
 *             }
 *           }
 *         }
 *       },
 *       "responses": {
 *         "200": {
 *           "description": "Tag aggiunti con successo",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "object",
 *                 "properties": {
 *                   "success": {
 *                     "type": "boolean"
 *                   },
 *                   "memeId": {
 *                     "type": "string"
 *                   },
 *                   "addedTags": {
 *                     "type": "array",
 *                     "items": {
 *                       "$ref": "#/components/schemas/Tag"
 *                     }
 *                   }
 *                 }
 *               }
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
router.post('/:id/tags', [enforceAuthentication, isOwnMeme], (req, res, next) => {

    MemesController.saveTags(req.params.id, req).then(() => {

        res.status(200);
        res.send();

    }).catch((err) => {
        next(err)
    });

});