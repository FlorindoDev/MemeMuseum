
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
 *             "example": 404
 *           },
 *          "code": {
 *             "type": "string",
 *             "description": "codice interno di errore",
 *             "example": "USER_NOT_EXISTS"
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
export class AppErrorHttp extends Error {
  constructor(statusCode, message, code = null) {
    super(message);
    this.status = statusCode;
    this.code = code                                  // per codici interni                               
    Error.captureStackTrace(this, this.constructor);  // si salva lo stackTrace
  }
}


export class AppError extends Error {
  constructor(message, code = null) {
    super(message);
    this.code = code                                  // per codici interni                               
    Error.captureStackTrace(this, this.constructor);  // si salva lo stackTrace
  }
}