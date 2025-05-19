import express from "express";
import { isUserPrsent } from "../middleware/UserValidators.js";
import { isEmailPasswordPresent } from "../middleware/UserValidators.js";
import { isNickNamePresent } from "../middleware/UserValidators.js";
import { AuthController } from "../controllers/AuthController.js";
import { Error } from "../utils/Error.js";

export const router = express.Router();

router.use(isEmailPasswordPresent);

const ErrorUserAbsenct = new Error(409, "l'utente esiste già");

/**
 * @swagger
 *   "/auth/signup": {
 *     "post": {
 *       "summary": "Registra un nuovo user",
 *       "description": "Crea un nuovo account utente se non è già presente",
 *       "tags": ["Authentication"],
 *       "requestBody": {
 *         "required": true,
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "$ref": "#/components/schemas/User"
 *             },
 *             "example": {
 *               "nickName": "johnDoe",
 *               "email": "john@example.com",
 *               "password": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd6"
 *             }
 *           }
 *         }
 *       },
 *       "responses": {
 *         "200": {
 *           "description": "User successfully registered"
 *         },
 *         "409": {
 *           "description": "User already exists",
 *           "content": {
 *             "application/json": {
 *               "schema": { "$ref": "#/components/schemas/Error" }
 *             }
 *           }
 *         },
 *         "503": {
 *           "description": "Service unavailable, signup temporarily disabled",
 *           "content": {
 *             "application/json": {
 *               "schema": { "$ref": "#/components/schemas/Error" }
 *             }
 *           }
 *         },
 *         "400": {
 *           "description": "email or password missing in the body",
 *           "content": {
 *             "application/json": {
 *               "schema": { "$ref": "#/components/schemas/Error" }
 *             }
 *           }
 *         },
 *         "default": {
 *           "description": "Unexpected error",
 *           "content": {
 *             "application/json": {
 *               "schema": { "$ref": "#/components/schemas/Error" }
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 */
router.post('/signup', [isNickNamePresent, isUserPrsent(ErrorUserAbsenct)], (req, res, next) => {
    AuthController.saveUser(req).then((result) => {
        if (result) {
            res.status(200);
            res.send();
        } else {
            return next(new Error(503, "Al momento il signup non è disponibile"));
        }
    }).catch((err) => {
        next(err)
    });

});

/**
 * @swagger
 * {
 *   "/auth/login": {
 *     "post": {
 *       "summary": "Autenticazione utente",
 *       "description": "Verifica le credenziali e restituisce un token JWT",
 *       "requestBody": {
 *         "required": true,
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "$ref": "#/components/schemas/User"
 *             },
 *             "example": {
 *               "email": "mario.rossi@example.com",
 *               "password": "P@ssw0rd!"
 *             }
 *           }
 *         }
 *       },
 *       "responses": {
 *         "200": {
 *           "description": "Token rilasciato con successo",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "object",
 *                 "properties": {
 *                   "token": {
 *                     "type": "string",
 *                     "description": "JWT di autenticazione"
 *                   }
 *                 }
 *               },
 *               "example": {
 *                 "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               }
 *             }
 *           }
 *         },
 *          "400": {
 *           "description": "email or passoword missing in the body",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/Error"
 *               }
 *             }
 *           }
 *         },
 *         "401": {
 *           "description": "Email o password sbagliate",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/Error"
 *               }
 *             }
 *           }
 *         }
 *       },
 *       "tags": ["Authentication"]
 *     }
 *   }
 * }
 */
router.post('/login', (req, res, next) => {
    AuthController.checkCredentials(req).then((result) => {
        if (result) {
            res.status(200);
            res.json({ token: AuthController.issueToken(req.body.email) })
        } else {
            return next(new Error(401, "Email o password sbagliate"));
        }

    }).catch((err) => {
        next(err)
    });

});
