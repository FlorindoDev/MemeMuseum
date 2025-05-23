import { AppErrorHttp } from "../AppError.js";

const BED_REQUEST = 400;
const CONFLICT = 409;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;
const SERVICE_UNAVAILABLE = 503
const FORBIDDEN = 403

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

export class VoteAlreadyExistsError extends AppErrorHttp {
    constructor() {
        super(CONFLICT, "Voto gia esistente", "VOTE_EXISTS");
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

export class VoteNotFoundError extends AppErrorHttp {
    constructor() {
        super(NOT_FOUND, "non ci sono voti", "VOTE_NOT_EXISTS");
    }
}

export class MemeNotFoundError extends AppErrorHttp {
    constructor() {
        super(NOT_FOUND, "non ci sono memes", "MEME_NOT_EXISTS");
    }
}

export class TagsNotFoundError extends AppErrorHttp {
    constructor() {
        super(NOT_FOUND, "non ci sono tags per questo meme", "TAGS_NOT_EXISTS");
    }
}

export class toManyTags extends AppErrorHttp {
    constructor() {
        super(FORBIDDEN, "puoi mettere massimo 5 tags", "TO_MANY_TAGS");
    }
}

/* ****************************************************************** */

//Codici 500
export class FailToUpdateUser extends AppErrorHttp {
    constructor() {
        super(INTERNAL_SERVER_ERROR, "errore in aspetato durate Update user, riprova più tardi", "PROCESSING_USER_UPDATE_ERROR");
    }
}

export class FailToSaveTags extends AppErrorHttp {
    constructor() {
        super(INTERNAL_SERVER_ERROR, "errore in aspetato durante save tags riprova più tardi", "PROCESSING_TAGS,SAVE_ERROR");
    }
}

export class FailToUploadFile extends AppErrorHttp {
    constructor() {
        super(INTERNAL_SERVER_ERROR, "Errore durante l’upload", "PROCESSING_UPLOAD_FILE_ERROR");
    }
}

export class FailToSaveVote extends AppErrorHttp {
    constructor() {
        super(INTERNAL_SERVER_ERROR, "Errore durante upload del voto", "PROCESSING_UPLOAD_VOTE_ERROR");
    }
}

export class SignUpError extends AppErrorHttp {
    constructor() {
        super(SERVICE_UNAVAILABLE, "Al momento il signup non è disponibile", "SIGNUP_ERROR");
    }
}

export class MemeUploadError extends AppErrorHttp {
    constructor() {
        super(SERVICE_UNAVAILABLE, "Al momento upload di meme non è disponibile", "MEME_UPLOAD_ERROR");
    }
}
