import express from "express"
import { upLoad as upLoadOnGoogle } from "../middleware/GoogleStorage.js"
import { enforceAuthentication, isOwnMeme } from "../middleware/authorization.js"
import { MemesController } from "../controllers/MemesController.js";
import { isMaxTagsReach, isUserAlreadyVote } from "../middleware/MemeMiddlewares.js";
import { queryParamsToList } from "../middleware/Middlewares.js";
import { TagController } from "../controllers/TagController.js";
import { VoteController } from "../controllers/VoteController.js";

import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
const imageParser = upload.fields([{ name: 'image', maxCount: 1 }])

//TODO: Spostare alcuni path in altri controller

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

//TODO fare i modo che possoa ricercare per tags
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

//TODO: Far in modo che posso agiornare e canellare dei tags
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
router.post('/:id/tags', [enforceAuthentication, isOwnMeme, isMaxTagsReach], (req, res, next) => {

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
router.get('/:id/tags', queryParamsToList(['nametags']), (req, res, next) => {

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
 *   "paths": {
 *     "/memes/{id}/votes": {
 *       "post": {
 *         "summary": "Vote for a meme",
 *          "security": [
 *              {
 *                  "bearerAuth": []
 *              }
 *          ],
 *         "description": "Registers a user's vote for a specific meme by ID.",
 *         "tags": ["Memes"],
 *         "parameters": [
 *           {
 *             "name": "id",
 *             "in": "path",
 *             "required": true,
 *             "description": "ID of the meme to vote for",
 *             "schema": {
 *               "type": "string"
 *             }
 *           }
 *         ],
 *         "requestBody": {
 *           "required": true,
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/MemeVote"
 *               },
 *              "example": {
 *                   "upVote": true
 *                 }
 *             }
 *           }
 *         },
 *         "responses": {
 *           "200": {
 *             "description": "Vote successfully recorded"
 *           },
 *           "400": {
 *             "description": "Invalid request"
 *           },
 *           "500": {
 *             "description": "Internal server error"
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
router.post('/:id/votes', [enforceAuthentication, isUserAlreadyVote], (req, res, next) => {


    if (req.isVotePresent) {

        let what = { upVote: req.body.upVote }

        let where = {
            where: {
                UserIdUser: req.idUser,
                MemeIdMeme: req.params.id
            }
        }

        VoteController.updateMemeVotes(what, where).then(() => {
            res.status(200);
            res.send();


        }).catch(err => {
            next(err);
        });

    } else {

        VoteController.saveVote(req).then(() => {
            res.status(200);
            res.send();
        }).catch((err) => {
            next(err)
        });
    }
});



/**
 * @swagger
 * {
 *   "paths": {
 *     "/memes/{id}/votes": {
 *       "get": {
 *         "summary": "get Vote of a meme",
 *         "description": "da i voti di un meme",
 *         "tags": ["Memes"],
 *         "parameters": [
 *           {
 *             "name": "id",
 *             "in": "path",
 *             "required": true,
 *             "description": "ID of the meme to vote for",
 *             "schema": {
 *               "type": "string"
 *             }
 *           },
 *           {
 *              "name": "count",
 *              "in": "query",
 *              "description": "Ti da il numero di upvote e downvote",
 *              "required": false,
 *              "schema": {
 *                  "type": "boolean",
 *                  "default": false
 *              }
 *           }
 *         ],
 *         "responses": {
 *           "200": {
 *             "description": "Vote successfully getted"
 *           },
 *           "400": {
 *             "description": "Invalid request"
 *           },
 *           "500": {
 *             "description": "Internal server error"
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
router.get('/:id/votes', (req, res, next) => {

    let filters = {
        where: {
            MemeIdMeme: req.params.id
        }
    }

    req.query.count = req.query.count === undefined ? false : true;

    VoteController.getMemeVotes(filters).then((result) => {

        if (req.query.count) {
            let upVote = result.filter(vote => {
                if (vote.dataValues.upVote) return true;
                return false;
            });

            let downvote = result.length - upVote.length;

            result = { upVote: upVote.length, downvote: downvote };
        }

        res.status(200);
        res.json(result);
    }).catch(err => {
        next(err);
    });

});


/**
 * @swagger
 * {
 *   "paths": {
 *     "/memes/{id}/votes": {
 *       "delete": {
 *         "summary": "Remove a user's vote on a meme",
 *         "description": "Permette a un utente autenticato di rimuovere il proprio voto da un meme.",
 *         "tags": ["Memes"],
 *         "parameters": [
 *           {
 *             "name": "id",
 *             "in": "path",
 *             "required": true,
 *             "description": "ID del meme dal quale rimuovere il voto",
 *             "schema": {
 *               "type": "string"
 *             }
 *           }
 *         ],
 *         "responses": {
 *           "200": {
 *             "description": "Voto rimosso con successo"
 *           },
 *           "401": {
 *             "description": "Utente non autenticato"
 *           },
 *           "500": {
 *             "description": "Errore interno del server"
 *           }
 *         },
 *         "security": [
 *           {
 *             "bearerAuth": []
 *           }
 *         ]
 *       }
 *     }
 *   }
 * }
 */
router.delete('/:id/votes', enforceAuthentication, (req, res, next) => {

    let filter = {
        where: {
            UserIdUser: req.idUser,
            MemeIdMeme: req.params.id
        }
    }
    VoteController.deleteMemeVote(filter).then((result) => {

        res.status(200);
        res.json({ numDeleted: result })
    }).catch(err => {
        next(err);
    })


});