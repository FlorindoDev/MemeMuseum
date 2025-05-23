import { DataTypes } from "sequelize";


/**
 * @swagger
 * {
 *   "components": {
 *     "schemas": {
 *       "MemeVote": {
 *         "type": "object",
 *         "properties": {
 *           "idVote": {
 *             "type": "integer",
 *             "format": "int32",
 *             "description": "Identificativo univoco del voto"
 *           },
 *           "upVote": {
 *             "type": "boolean",
 *             "description": "true = upvote, false = downvote"
 *           }
 *         },
 *         "required": ["upVote","idVote"]
 *       }
 *     }
 *   }
 * }
 */
export function createModel(database) {
    database.define('MemeVote', {
        idVote: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        upVote: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    }
    );
}
