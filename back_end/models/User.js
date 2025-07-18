import { DataTypes } from "sequelize";
import { createHash } from "crypto";


/**
 * @swagger
 * {
 *   "components": {
 *     "schemas": {
 *       "User": {
 *         "type": "object",
 *         "properties": {
 *           "idUser": {
 *             "type": "integer",
 *             "format": "int32",
 *             "description": "Identificativo univoco auto-incrementale"
 *           },
 *           "nickName": {
 *             "type": "string",
 *             "description": "Nickname scelto dall'utente",
 *             "example": "johnDoe"
 *           },
 *           "email": {
 *             "type": "string",
 *             "format": "email",
 *             "description": "Email dell'utente",
 *             "example": "john@example.com"
 *           },
 *           "profilePic": {
 *             "type": "string",
 *             "description": "URL dell’immagine"
 *           },
 *           "password": {
 *             "type": "string",
 *             "description": "Password"
 *           },
 *          "createdAt": {
 *              "type": "string",
 *              "example": "2025-05-17T16:22:54.589Z",
 *              "description": "non neccessario anche se messo verrà ignorato"
 *          },
 * 
 *          "updatedAt": {
 *              "type": "string",
 *              "example": "2025-05-17T16:22:54.589Z",
 *              "description": "non neccessario anche se messo verrà ignorato"
 *          }
 *         },
 *         "required": ["nickName", "email", "password","idUser"],
 *         "example": {
 *           "idUser": 1,
 *           "nickName": "johnDoe",
 *           "email": "john@example.com",
 *           "profilePic": null,
 *           "password": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd6",
 *           "createdAt": "2025-05-17T16:18:36.773Z",
 *           "updatedAt": "2025-05-17T16:18:36.773Z"
 *         }
 *       }
 *     }
 *   }
 * }
 */
export function createModel(database) {
    database.define('User', {
        idUser: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },

        nickName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        profilePic: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                let hash = createHash("sha256");
                this.setDataValue('password', hash.update(value).digest("hex"));
            }
        }
    }, {
    });
}

