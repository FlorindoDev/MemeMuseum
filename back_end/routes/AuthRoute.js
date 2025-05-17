import express from "express";
import { isUserPrsent } from "../middleware/UserValidators.js";
import { AuthController } from "../controllers/AuthController.js";
import { Error } from "../utils/Error.js";

export const router = express.Router();

/**
 * @swagger
 *   "/signup": {
 *     "post": {
 *       "summary": "Register a new user",
 *       "description": "Crea un nuovo account utente se non è già presente",
 *       "tags": ["Authentication"],
 *       "requestBody": {
 *         "required": true,
 *         "content": {
 *           "application/json": {
 *             "schema": {
 *               "$ref": "#/components/schemas/User"
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
 *               "schema": {
 *                 "$ref": "#/components/schemas/Error"
 *               }
 *             }
 *           }
 *         },
 *         "503": {
 *           "description": "Service unavailable, signup temporarily disabled",
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "$ref": "#/components/schemas/Error"
 *               }
 *             }
 *           }
 *         },
 *         "default": {
 *           "description": "Unexpected error",
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
 */
router.post('/signup', isUserPrsent(new Error(409, "l'utente esiste già")), (req, res, next) => {
    AuthController.saveUser(req).then((result) => {
        if (result) {
            res.status(200);
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
router.post('/auth', (req, res, next) => {
    AuthController.checkCredentials(req).then((result) => {
        if (result) {
            res.json({ token: AuthController.issueToken(req.body.email) })
            res.send();
        } else {
            next(new Error(401, "Email o password sbagliate"))
        }

    });

});
