import express from "express";
import { enforceAuthentication } from "../middleware/authorization.js";
import { CommentController } from "../controllers/CommentController.js";
import { isIdPresent, isFieldsPresent } from "../middleware/Middlewares.js";
import { isMemeExists } from "../middleware/MemeMiddlewares.js";

export const router = express.Router();

/**
 * @swagger
 * {
 *   "paths": {
 *     "/comments": {
 *       "post": {
 *         "summary": "Commet for a meme",
 *          "security": [
 *              {
 *                  "bearerAuth": []
 *              }
 *          ],
 *         "description": "Registers a user's comment for a specific meme by ID.",
 *         "tags": ["Comments"],
 *         "parameters": [
 *           {
 *             "name": "idmeme",
 *             "in": "query",
 *             "required": true,
 *             "description": "ID of the meme to comment for",
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
 *                 "$ref": "#/components/schemas/CommentVote"
 *               },
 *              "example": {
 *                   "content": "bel meme"
 *                 }
 *             }
 *           }
 *         },
 *         "responses": {
 *           "200": {
 *             "description": "Comment successfully recorded"
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
router.post('/', [enforceAuthentication, isIdPresent("query", "idmeme"), isMemeExists("query", "idmeme")], (req, res, next) => {

    CommentController.saveComment(req).then(() => {
        res.status(200);
        res.send();

    }).catch((err) => {
        next(err);
    })

});

/**
 * @swagger
 * {
 *   "paths": {
 *     "/comments": {
 *       "get": {
 *         "summary": "commenti di un meme o commenti fatti da un utente",
 *         "description": "da i commenti di un meme o i commenti fatti da un utente ",
 *         "tags": ["Comments"],
 *         "parameters": [
 *           {
 *             "name": "idmeme",
 *             "in": "query",
 *             "required": false,
 *             "description": "ID of the meme",
 *             "schema": {
 *               "type": "string"
 *             }
 *           },
 *           {
 *             "name": "iduser",
 *             "in": "query",
 *             "required": false,
 *             "description": "ID del utente",
 *             "schema": {
 *               "type": "string"
 *             }
 *           },
 *           {
 *              "name": "count",
 *              "in": "query",
 *              "description": "Ti da il numero di commenti",
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
router.get('/', isFieldsPresent("query", ["idmeme", "iduser"]), (req, res, next) => {

    let filters = CommentController.createFilterGetVote(req.query.idmeme, req.query.iduser);

    req.query.count = req.query.count === undefined ? "false" : "true";

    CommentController.getCommentMeme(filters).then((result) => {

        if (req.query.count === "true") {

            result = { comment: result.length };
        }

        res.status(200);
        res.json(result);
    }).catch(err => {
        next(err);
    });

});

//TODO aggiungu cancellazione commenti

