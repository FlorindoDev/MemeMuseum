import { DataTypes } from "sequelize";


/**
 * @swagger
 * {
 *   "components": {
 *     "schemas": {
 *       "Meme": {
 *         "type": "object",
 *         "properties": {
 *           "idMeme": {
 *             "type": "integer",
 *             "format": "int32",
 *             "description": "Identificativo univoco del meme"
 *           },
 *           "image": {
 *             "type": "string",
 *             "description": "URL dell’immagine"
 *           },
 *           "description": {
 *             "type": "string",
 *             "description": "Testo descrittivo (facoltativo)"
 *           },
 *           "upVoteNum": {
 *             "type": "integer",
 *             "description": "Numero di voti positivi"
 *           },
 *           "downVoteNum": {
 *             "type": "integer",
 *             "description": "Numero di voti negativi"
 *           },
 *           "commentNum": {
 *             "type": "integer",
 *             "description": "Numero di commenti"
 *           }
 *         },
 *         "required": ["image", "upVoteNum", "downVoteNum", "commentNum","idMeme"]
 *       }
 *     }
 *   }
 * }
 */
export function createModel(database) {
    database.define('Meme', {
        idMeme: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        upVoteNum: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        downVoteNum: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        commentNum: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }
    );
}
