import { DataTypes } from "sequelize";


/**
 * @swagger
 * {
 *   "components": {
 *     "schemas": {
 *       "Tag": {
 *         "type": "object",
 *         "properties": {
 *          "idTag": {
 *             "type": "integer",
 *              "format": "int32"
 *           },
 *           "name": {
 *             "type": "string"
 *           }
 *         },
 *         "required": ["name,idTag"]
 *       }
 *     }
 *   }
 * }
 */
export function createModel(database) {
    database.define('Tag', {

        idTag: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }


    );


}