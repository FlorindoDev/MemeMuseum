import { DataTypes } from "sequelize";


/**
 * @swagger
 * {
 *   "components": {
 *     "schemas": {
 *       "Comment": {
 *         "type": "object",
 *         "properties": {
 *           "idComment": {
 *             "type": "integer",
 *             "format": "int32",
 *             "description": "Identificativo univoco del commento"
 *           },
 *           "content": {
 *             "type": "string",
 *             "description": "Testo del commento"
 *           },
 *           
 *         },
 *         "required": ["content","idComment"]
 *       }
 *     }
 *   }
 * }
 */
export function createModel(database) {
    database.define('Comment', {
        idComment: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }


    );


}