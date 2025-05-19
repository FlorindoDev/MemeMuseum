import express from "express";
import { Error } from "../utils/Error.js";
import { enforceAuthentication } from "../middleware/authorization.js"
import { UsersController } from "../controllers/UsersController.js";
import { upLoad as upLoadOnGoogle } from "../middleware/GoogleStorage.js"
import { isOwnProfile } from "../middleware/authorization.js"


//multer
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
const imageParser = upload.fields([{ name: 'image', maxCount: 1 }])


export const router = express.Router();


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
 *               },
 *                "example": {
 *                      "idUser": 1,
 *                      "nickName": "johnDoe",
 *                       "email": "john@example.com",
 *                       "profilePic": null,
 *                       "createdAt": "2025-05-17T16:18:36.773Z",
 *                       "updatedAt": "2025-05-17T16:18:36.773Z"
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
router.get('/', (req, res, next) => {

    const rawPageSize = req.query.pagesize;
    const rawPage = req.query.page;


    let query = UsersController.checkPage(rawPageSize, rawPage);

    UsersController.getAllUsers(query.size, query.pages).then((result) => {
        if (result.length !== 0) {
            res.status(200);
            res.json(result);
        } else {
            return next(new Error(209, "non ci sono utenti"));
        }

    }).catch((err) => {
        next(err)
    });

});


/**
 * @swagger
 * {
 *   "/users/{id}": {
 *     "get": {
 *       "tags": ["Users"],
 *       "summary": "Recupera un utente tramite ID",
 *       "description": "Restituisce le informazioni dettagliate di un utente in base all'ID specificato",
 *       "operationId": "getUserById",
 *       "parameters": [
 *         {
 *           "name": "id",
 *           "in": "path",
 *           "description": "ID dell'utente da recuperare",
 *           "required": true,
 *           "schema": {
 *             "type": "string"
 *           }
 *         }
 *       ],
 *       "produces": ["application/json"],
 *       "responses": {
 *         "200": {
 *           "description": "Lista di utenti trovati",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "object",
 *                 "items": { "$ref": "#/components/schemas/User" }
 *               },
 *                "example": {
 *                      "idUser": 1,
 *                      "nickName": "johnDoe",
 *                       "email": "john@example.com",
 *                       "profilePic": null,
 *                       "createdAt": "2025-05-17T16:18:36.773Z",
 *                       "updatedAt": "2025-05-17T16:18:36.773Z"
 *               }
 *             }
 *           }
 *         },
 *         "404": {
 *           "description": "Utente non trovato",
 *           "schema": {
 *             "$ref": "#/components/schemas/Error"
 *           },
 *           "examples": {
 *             "application/json": {
 *               "code": 209,
 *               "message": "non ci sono utenti"
 *             }
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

    UsersController.getUserFromId(req.params.id).then((result) => {
        if (result !== null) {
            res.status(200);
            res.json(result);
        } else {
            return next(new Error(209, "non ci sono utenti"));
        }
    }).catch((err) => {
        next(err)
    });
});


//TODO: se qulcuno  carica una foto fare in modo che la vecchi si cancelli
/**
 * @swagger
 * {
 *   "components": {
 *     "securitySchemes": {
 *       "bearerAuth": {
 *         "type": "http",
 *         "scheme": "bearer",
 *         "bearerFormat": "JWT",
 *         "description": "Inserisci il token JWT nel formato `Bearer <token>`"
 *       }
 *     }
 *   },
 *   "/users/{id}/upload-profile-pic": {
 *     "post": {
 *       "tags": ["Users"],
 *       "summary": "Upload user profile picture",
 *       "security": [
 *         {
 *           "bearerAuth": []
 *         }
 *       ],
 *       "parameters": [
 *         {
 *           "name": "id",
 *           "in": "path",
 *           "required": true,
 *           "schema": { "type": "string" },
 *           "description": "Deve essere id del tuo profilo"
 *         }
 *       ],
 *       "requestBody": {
 *         "required": true,
 *         "content": {
 *           "multipart/form-data": {
 *             "schema": {
 *               "type": "object",
 *               "properties": {
 *                 "image": {
 *                   "type": "string",
 *                   "format": "binary",
 *                   "description": "Image file to set as the user's profile picture"
 *                 }
 *               },
 *               "required": ["image"]
 *             }
 *           }
 *         }
 *       },
 *       "responses": {
 *         "200": {
 *           "description": "Profile picture updated successfully"
 *         },
 *         "500": {
 *           "description": "Something went wrong, please try again later"
 *         }
 *       }
 *     }
 *   }
 * }
 */
router.post('/:id/upload-profile-pic', [enforceAuthentication, isOwnProfile, imageParser, upLoadOnGoogle], (req, res, next) => {
    UsersController.updateProfilePic(req.params.id, req.profilepicUrl).then((result) => {
        if (result[0] == 1) {
            res.status(200);
            res.send();
            return;
        }
        return next(500, 'qualcosa è andato storto, riprova più tardi');

    }).catch((err) => {
        next(err)
    });

});



