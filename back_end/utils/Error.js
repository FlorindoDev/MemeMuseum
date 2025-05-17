/**
 * @swagger
 * {
 *   "components": {
 *     "schemas": {
 *       "Error": {
 *         "type": "object",
 *         "properties": {
 *           "status": {
 *             "type": "integer",
 *             "description": "Codice numerico dello status dell'errore",
 *             "example": 209
 *           },
 *           "message": {
 *             "type": "string",
 *             "description": "Descrizione testuale dell'errore",
 *             "example": "Non ci sono utenti"
 *           }
 *         },
 *         "required": ["status", "message"]
 *       }
 *     }
 *   }
 * }
 */
export class Error {

    constructor(status, message) {
        this.status = status;
        this.message = message;
    }
}