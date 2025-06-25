import express from "express";
import { enforceAuthentication, isOwnComment } from "../middleware/authorization.js";
import { CommentController } from "../controllers/CommentController.js";
import { validate } from "../middleware/Middlewares.js";
import { isMemeExists } from "../middleware/MemeMiddlewares.js";
import { isCommentVoteAlreadyExists } from "../middleware/CommentVoteMiddlewares.js";
import { CommentVoteController } from "../controllers/CommentVoteController.js";
import { isCommentExists } from "../middleware/CommentMiddlewares.js";
import { queryParamsToList } from "../middleware/Middlewares.js";
import { schemaCommentsGet, schemaCommentsPost, schemaCommentsVotesGet, schemaCommentsVotesPost, idCommentRequiredParams } from "../schemas/comments.schema.js";


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
router.post('/', [enforceAuthentication, validate(schemaCommentsPost), isMemeExists("query", "idmeme")], (req, res, next) => {

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
 *          {
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
 *          {
 *             "name": "orderby",
 *             "in": "query",
 *             "required": false,
 *             "description": "elemento per cui vuoi ordinare: `upvote,ASC/DESC` o `downvote,ASC/DESC`",
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
 *             "description": "Comments successfully getted"
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
router.get('/', validate(schemaCommentsGet, true), queryParamsToList(["orderby"]), (req, res, next) => {

    let filters;
    let paginazione = { pages: req.checked.query.page, size: req.checked.query.pagesize }
    try {
        filters = CommentController.createFilterGetComment(paginazione, req.query.idmeme, req.query.iduser, req.orderby, req.query.count);
    } catch (err) {
        console.log(err);
        next(err);
    }


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


/**
 * @swagger
 * {
 *   "paths": {
 *     "/comments/{id}": {
 *       "get": {
 *         "summary": "commento restiuito tramite id",
 *         "description": "commento restiuito tramite id ",
 *         "tags": ["Comments"],
 *         "parameters": [
 *           {
 *             "name": "id",
 *             "in": "path",
 *             "required": true,
 *             "description": "ID of the comment",
 *             "schema": {
 *               "type": "string"
 *             }
 *           }
 *         ],
 *         "responses": {
 *           "200": {
 *             "description": "Comment successfully getted"
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
router.get('/:id', validate(idCommentRequiredParams), (req, res, next) => {


    CommentController.getCommentMeme({ where: { idComment: req.params.id } }).then((result) => {

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
 *     "/comments/{id}": {
 *       "delete": {
 *         "summary": "cancellazione comment tramite id",
 *         "description": "cancella un commento in base al `id`  ",
 *          "security": [
 *              {
 *                  "bearerAuth": []
 *              }
 *          ],
 *         "tags": ["Comments"],
 *         "parameters": [
 *           {
 *             "name": "id",
 *             "in": "path",
 *             "required": true,
 *             "description": "ID of the comment",
 *             "schema": {
 *               "type": "string"
 *             }
 *           }
 *         ],
 *         "responses": {
 *           "200": {
 *             "description": "Comment successfully deleted"
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
router.delete('/:id', enforceAuthentication, validate(idCommentRequiredParams), isOwnComment, (req, res, next) => {


    CommentController.deleteComment(req.params.id).then((result) => {

        res.status(200);
        res.send();

    }).catch(err => {
        next(err);
    });

});

/**
 * @swagger
 * {
 *   "paths": {
 *     "/comments/{id}/comments-votes": {
 *       "post": {
 *         "summary": "Vote for a Comment",
 *          "security": [
 *              {
 *                  "bearerAuth": []
 *              }
 *          ],
 *         "description": "Registers a user's vote for a specific comment by ID.",
 *         "tags": ["Comments"],
 *         "parameters": [
 *           {
 *             "name": "id",
 *             "in": "path",
 *             "required": true,
 *             "description": "ID of the comment to vote for",
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
router.post('/:id/comments-votes', [enforceAuthentication, validate(schemaCommentsVotesPost), isCommentExists, isCommentVoteAlreadyExists], (req, res, next) => {


    if (req.isVotePresent) {

        let what = { upVote: req.body.upVote }

        let where = {
            where: {
                UserIdUser: req.idUser,
                CommentIdComment: req.params.id
            }
        }

        CommentVoteController.updateMemeVotes(what, where).then(() => {
            res.status(200);
            res.send();


        }).catch(err => {
            next(err);
        });

    } else {

        CommentVoteController.saveVote(req).then(() => {
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
 *     "/comments/{id}/comments-votes": {
 *       "get": {
 *         "summary": "voti di un Comment ",
 *         "description": "da i voti di un comment dato `id`",
 *         "tags": ["Comments"],
 *         "parameters": [
 *           {
 *             "name": "id",
 *             "in": "path",
 *             "required": false,
 *             "description": "ID of the comment",
 *             "schema": {
 *               "type": "string"
 *             }
 *           },
 *          {
 *           "name": "iduser",
 *           "in": "query",
 *           "description": "id utente",
 *           "required": false,
 *           "schema": {
 *             "type": "integer"
 *           }
 *         },
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
 *             "description": "Votes successfully getted"
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
router.get('/:id/comments-votes', validate(schemaCommentsVotesGet), (req, res, next) => {

    let filters = { where: { CommentIdComment: req.params.id } };

    if (req.query.iduser) filters.where.UserIdUser = req.query.iduser;

    CommentVoteController.getCommentVote(filters).then((result) => {

        if (req.query.count === "true") {
            let upVote = result.filter(vote => {
                if (vote.dataValues.upVote) return true;
                return false;
            });

            let downvote = result.length - upVote.length;

            result = { upvote: upVote.length, downvote: downvote };
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
 *     "/comments/{id}/comments-votes": {
 *       "delete": {
 *         "summary": "Remove a user's vote on a Comment",
 *         "description": "Permette a un utente autenticato di rimuovere il proprio voto da un commento.",
 *         "tags": ["Comments"],
 *         "parameters": [
 *           {
 *             "name": "id",
 *             "in": "path",
 *             "required": true,
 *             "description": "ID del comment dal quale rimuovere il voto",
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
router.delete('/:id/comments-votes', enforceAuthentication, validate(idCommentRequiredParams), (req, res, next) => {

    let filter = {
        where: {
            UserIdUser: req.idUser,
            CommentIdComment: req.params.id
        }
    }

    CommentVoteController.deleteCommentVote(filter).then(() => {

        res.status(200);
        res.send();

    }).catch(err => {
        next(err);
    })


});
