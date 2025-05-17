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
 *             "format": "binary",
 *             "description": "Immagine profilo in formato blob"
 *           },
 *           "password": {
 *             "type": "string",
 *             "description": "Password salvata come hash SHA-256"
 *           }
 *         },
 *         "required": ["nickName", "email", "password","idUser"],
 *         "example": {
 *           "idUser": 1,
 *           "nickName": "johnDoe",
 *           "email": "john@example.com",
 *           "profilePic": null,
 *           "password": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd6"
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
            type: DataTypes.BLOB,
            allowNull: true,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                //TODO: Implementare il salt per previnire i Raimbow attack
                let hash = createHash("sha256");
                this.setDataValue('password', hash.update(value).digest("hex"));
            }
        }
    }, { // Other model options go here
        //the actual table name is inferred from the model name (pluralized) by default
    });
}

