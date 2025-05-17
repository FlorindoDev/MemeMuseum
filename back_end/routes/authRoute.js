import express from "express";
import { isUserPrsent } from "../middleware/Validators.js";
import { AuthController } from "../controllers/AuthController.js";
import { Error } from "../utils/Error.js";

export const router = express.Router();

/**
 * @swagger
 * {
 *   "paths": {
 *     "/signup": {
 *       "post": {
 *         "summary": "Register a new user",
 *         "description": "Crea un nuovo account utente se non è già presente",
 *         "tags": ["Authentication"],
 *         "requestBody": {
 *           "required": true,
 *           "content": {
 *             "application/json": {
 *               "schema": {
 *                 "type": "object",
 *                 "required": ["name", "email", "password"],
 *                 "properties": {
 *                   "name": {
 *                     "type": "string",
 *                     "example": "Mario Rossi"
 *                   },
 *                   "email": {
 *                     "type": "string",
 *                     "format": "email",
 *                     "example": "mario.rossi@example.com"
 *                   },
 *                   "password": {
 *                     "type": "string",
 *                     "format": "password",
 *                     "example": "strongPassword123"
 *                   }
 *                 }
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
 *   }
 * }
 */
router.post('/signup', isUserPrsent, (req, res) => {
    AuthController.saveUser.then((result) => {
        if (result) {
            res.statusCode = 200
            res.send();
        } else {
            next(new Error(503), "Al momento il signup non è disponibile")
        }
    });

});