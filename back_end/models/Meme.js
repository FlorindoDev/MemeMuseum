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
 *             "format": "binary",
 *             "description": "Contenuto binario dell’immagine"
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
 *           },
 *           "date": {
 *             "type": "string",
 *             "format": "date-time",
 *             "description": "Data di creazione del meme"
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
            type: DataTypes.BLOB,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        upVoteNum: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        downVoteNum: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        commentNum: {
            type: DataTypes.INTEGER,
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
