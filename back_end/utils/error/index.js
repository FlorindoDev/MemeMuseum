import { AppErrorHttp } from "../AppError.js";

const BED_REQUEST = 400;
const CONFLICT = 409;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;
const SERVICE_UNAVAILABLE = 503

//Codici 400
export class MissingFieldError extends AppErrorHttp {
    constructor(fieldName) {
        super(BED_REQUEST, `Campo ${fieldName} mancante`, "MISSING_FIELD");
    }
}

export class MissingFile extends AppErrorHttp {
    constructor() {
        super(BED_REQUEST, "Nessun file caricato", "MISSING_FILE");
    }
}

export class UserAlreadyExistsError extends AppErrorHttp {
    constructor() {
        super(CONFLICT, "Utente con questa email già registrato", "USER_EXISTS");
    }
}

export class UnauthorizedError extends AppErrorHttp {
    constructor() {
        super(UNAUTHORIZED, "Non autorizzato", "UNAUTHORIZED");
    }
}

export class CredentialError extends AppErrorHttp {
    constructor() {
        super(UNAUTHORIZED, "Email o password sbagliate", "UNAUTHORIZED");
    }
}

export class UserNotFoundError extends AppErrorHttp {
    constructor() {
        super(NOT_FOUND, "non ci sono utenti", "USER_NOT_EXISTS");
    }
}

/* ****************************************************************** */

//Codici 500
export class FailToUpdateUser extends AppErrorHttp {
    constructor() {
        super(INTERNAL_SERVER_ERROR, "errore in aspetato riprova più tardi", "PROCESSING_USER_UPDATE_ERROR");
    }
}

export class FailToUploadFile extends AppErrorHttp {
    constructor() {
        super(INTERNAL_SERVER_ERROR, "Errore durante l’upload", "PROCESSING_UPLOAD_FILE_ERROR");
    }
}

export class SignUpError extends AppErrorHttp {
    constructor() {
        super(SERVICE_UNAVAILABLE, "Al momento il signup non è disponibile", "SIGNUP_ERROR");
    }
}
