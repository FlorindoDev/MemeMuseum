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
 *         },
 *         "required": ["image","idMeme"]
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
        }
    }
    );
}
