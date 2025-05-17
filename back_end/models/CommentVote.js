import { DataTypes } from "sequelize";

/**
 * @swagger
 * {
 *   "components": {
 *     "schemas": {
 *       "CommentVote": {
 *         "type": "object",
 *         "properties": {
 *           "idVote": {
 *             "type": "integer",
 *             "format": "int32",
 *             "description": "Identificativo univoco del voto sul commento"
 *           },
 *           "upVote": {
 *             "type": "boolean",
 *             "description": "true = upvote, false = downvote"
 *           },
 *           "date": {
 *             "type": "string",
 *             "format": "date-time",
 *             "description": "Data e ora del voto"
 *           }
 *         },
 *         "required": ["upVote", "idVote"]
 *       }
 *     }
 *   }
 * }
 */
export function createModel(database) {
    database.define('CommentVote', {
        idVote: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        upVote: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
    }
    );
}