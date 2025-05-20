import express from "express"
import { upLoad as upLoadOnGoogle } from "../middleware/GoogleStorage.js"
import { enforceAuthentication, isOwnProfile } from "../middleware/authorization.js"
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
 *       "description": "Restituisce una paginazione di memes; i parametri `pagesize` e `page` sono opzionali.",
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


    let query = MemesController.checkPage(rawPageSize, rawPage);

    MemesController.getAllMemes(query.size, query.pages).then((result) => {

        res.status(200);
        res.json(result);

    }).catch((err) => {
        next(err)
    });

});