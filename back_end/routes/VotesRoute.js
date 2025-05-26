import express from "express"
import { enforceAuthentication } from "../middleware/authorization.js"
import { isUserAlreadyVote, isBodyVoteCorrect } from "../middleware/VoteMiddlewares.js";
import { VoteController } from "../controllers/VoteController.js";

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
 *             "name": "id",
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
router.post('/', [isBodyVoteCorrect, enforceAuthentication, isUserAlreadyVote], (req, res, next) => {


    if (req.isVotePresent) {

        let what = { upVote: req.body.upVote }

        let where = {
            where: {
                UserIdUser: req.idUser,
                MemeIdMeme: req.query.id
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
 *         "summary": "get Vote of a meme",
 *         "description": "da i voti di un meme",
 *         "tags": ["Votes"],
 *         "parameters": [
 *           {
 *             "name": "id",
 *             "in": "query",
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
router.get('/', (req, res, next) => {

    let filters = {
        where: {
            MemeIdMeme: req.query.id
        }
    }

    req.query.count = req.query.count === undefined ? "false" : "true";

    VoteController.getMemeVotes(filters).then((result) => {

        if (req.query.count === "true") {
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
 *     "/votes": {
 *       "delete": {
 *         "summary": "Remove a user's vote on a meme",
 *         "description": "Permette a un utente autenticato di rimuovere il proprio voto da un meme.",
 *         "tags": ["Votes"],
 *         "parameters": [
 *           {
 *             "name": "id",
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
router.delete('/', enforceAuthentication, (req, res, next) => {

    let filter = {
        where: {
            UserIdUser: req.idUser,
            MemeIdMeme: req.query.id
        }
    }
    VoteController.deleteMemeVote(filter).then((result) => {

        res.status(200);
        res.json({ numDeleted: result })
    }).catch(err => {
        next(err);
    })


});