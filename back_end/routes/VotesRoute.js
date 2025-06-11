import express from "express"
import { enforceAuthentication } from "../middleware/authorization.js"
import { isUserAlreadyVote } from "../middleware/VoteMiddlewares.js";
import { VoteController } from "../controllers/VoteController.js";
import { isMemeExists } from "../middleware/MemeMiddlewares.js";
import { validate } from "../middleware/Middlewares.js";
import { idMemeRequiredQuery } from "../schemas/meme.schema.js";
import { idVoteRequiredParams, schemaVotesGet, schemaVotePost } from "../schemas/vote.schema.js";



export const router = express.Router();


/**
 * @swagger
 * {
 *   "paths": {
 *     "/votes": {
 *       "post": {
 *         "summary": "Vote for a meme",
 *          "security": [
 *              {
 *                  "bearerAuth": []
 *              }
 *          ],
 *         "description": "Registers a user's vote for a specific meme by ID.",
 *         "tags": ["Votes"],
 *         "parameters": [
 *           {
 *             "name": "idmeme",
 *             "in": "query",
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
router.post('/', [enforceAuthentication, validate(schemaVotePost), isMemeExists("query", "idmeme"), isUserAlreadyVote], (req, res, next) => {


    if (req.isVotePresent) {

        let what = { upVote: req.body.upVote }

        let where = {
            where: {
                UserIdUser: req.idUser,
                MemeIdMeme: req.query.idmeme
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
 *     "/votes": {
 *       "get": {
 *         "summary": "voti di un meme o voti fatti da un utente",
 *         "description": "da i voti di un meme o i voti fatti da un utente ",
 *         "tags": ["Votes"],
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
router.get('/', validate(schemaVotesGet), (req, res, next) => {

    let filters = VoteController.createFilterGetVote(req.query.idmeme, req.query.iduser);

    VoteController.getMemeVotes(filters).then((result) => {

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
 *     "/votes": {
 *       "delete": {
 *         "summary": "Remove a user's vote on a meme",
 *         "description": "Permette a un utente autenticato di rimuovere il proprio voto da un meme.",
 *         "tags": ["Votes"],
 *         "parameters": [
 *           {
 *             "name": "idmeme",
 *             "in": "query",
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
router.delete('/', enforceAuthentication, validate(idMemeRequiredQuery), (req, res, next) => {

    let filter = {
        where: {
            UserIdUser: req.idUser,
            MemeIdMeme: req.query.idmeme
        }
    }
    VoteController.deleteMemeVote(filter).then((result) => {

        res.status(200);
        res.json({ numDeleted: result })
    }).catch(err => {
        next(err);
    })


});


/**
 * @swagger
 * {
 *   "paths": {
 *     "/votes/{id}": {
 *       "get": {
 *         "summary": "restiuisce un voto dato id",
 *         "description": "restiuisce un voto dato `id`",
 *         "tags": ["Votes"],
 *         "parameters": [
 *           {
 *             "name": "id",
 *             "in": "path",
 *             "required": false,
 *             "description": "ID of the vote",
 *             "schema": {
 *               "type": "string"
 *             }
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
router.get('/:id', validate(idVoteRequiredParams), (req, res, next) => {

    VoteController.getMemeVotes({ where: { idVote: req.params.id } }).then((result) => {
        res.status(200);
        res.json(result[0]);
    }).catch(err => {
        next(err);
    });

});
