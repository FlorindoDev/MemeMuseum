import express from "express";
import { isUserPrsent } from "../middleware/UserValidators.js";
import { AuthController } from "../controllers/AuthController.js";
import { Error } from "../utils/Error.js";

export const router = express.Router();




/**
 * @swagger
 *   "/signup": {
 *       "post": {
 *         "summary": "Register a new user",
 *         "description": "Crea un nuovo account utente se non è già presente",
 *         "tags": ["Authentication"],
 *         "requestBody": {
 *           "required": true,
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/User"
 *               }
 *             }
 *           }
 *         },
 *         "responses": {
 *           "200": {
 *             "description": "User successfully registered"
 *           },
 *           "409": {
 *             "description": "User already exists"
 *           },
 *           "503": {
 *             "description": "Service unavailable, signup temporarily disabled",
 *             "content": {
 *               "application/json": {
 *                 "schema": {
 *                   "type": "object",
 *                   "properties": {
 *                     "message": {
 *                       "type": "string",
 *                       "example": "Al momento il signup non è disponibile"
 *                     }
 *                   }
 *                 }
 *               }
 *             }
 *           },
 *           "default": {
 *             "description": "Unexpected error",
 *             "content": {
 *               "application/json": {
 *                 "schema": {
 *                   "type": "object",
 *                   "properties": {
 *                     "message": {
 *                       "type": "string",
 *                       "example": "Errore interno del server"
 *                     }
 *                   }
 *                 }
 *               }
 *             }
 *           }
 *         }
 *       }
 *     }
 */
router.post('/signup', isUserPrsent, (req, res, next) => {
    AuthController.saveUser(req).then((result) => {
        console.log(result);
        if (result) {
            res.statusCode = 200
            res.send();
        } else {
            next(new Error(503, "Al momento il signup non è disponibile"))
        }
    });

});

/**
 * @swagger
 * {
 *   "/auth": {
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
 *         "401": {
 *           "description": "Email o password sbagliate",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "object",
 *                 "properties": {
 *                   "error": {
 *                     "type": "string"
 *                   }
 *                 }
 *               },
 *               "example": {
 *                 "error": "Email o password non valide"
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
router.post('/auth', (req, res, next) => {
    AuthController.checkCredentials(req).then((result) => {
        console.log(result);
        if (result) {
            res.json({ token: AuthController.issueToken(req.body.email) })
            res.send();
        } else {
            next(new Error(401, "Email o password sbagliate"))
        }

    });

});
