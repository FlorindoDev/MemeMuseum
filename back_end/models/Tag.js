import { DataTypes } from "sequelize";


/**
 * @swagger
 * {
 *   "components": {
 *     "schemas": {
 *       "Tag": {
 *         "type": "object",
 *         "properties": {
 *           "name": {
 *             "type": "string"
 *           }
 *         },
 *         "required": ["name"]
 *       }
 *     }
 *   }
 * }
 */
export function createModel(database) {
    database.define('Tag', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        }
    }


    );


}