import { z } from "zod";
import { idRequired, idNotRequired, unionChecks } from "./utils.schema.js";

const rfc5322EmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

let password = z.object({
    password: z.string({
        required_error: "Il campo password è obbligatorio"
    }).min(8).max(50),
});

let nickname = z.object({
    nickName: z.string({
        required_error: "Il campo nickname è obbligatorio"
    }).min(4).max(12),
});

let email = z.object({
    email: z.string({
        required_error: "Il campo email è obbligatorio"
    }).regex(rfc5322EmailRegex, "Email non valida"),
});

let idR = z.object({
    iduser: idRequired.id
});

let idNotR = z.object({
    iduser: idNotRequired.id
});

let nicknameNotRequired = z.object({
    nickName: z.string().min(4).max(12).optional(),
});

let emailNotRequired = z.object({
    email: z.string().regex(rfc5322EmailRegex, "Email non valida").optional(),
});

let passwordNotRequired = z.object({
    password: z.string().min(8).max(50).optional(),
});

export const idUserRequiredQuery = z.object({
    query: idR
});

export const NickNameRequiredBody = z.object({
    body: nickname,

});

export const EmailRequiredBody = z.object({
    body: email,

});

export const PasswordRequiredBody = z.object({
    body: password,

});

export const idUserRequredParams = z.object({
    params: z.object(idRequired),

});

export const idUserNotRequiredQuery = z.object({
    query: idNotR
});

export const NickNameNotRequiredBody = z.object({
    body: nicknameNotRequired,

});

export const EmailNotRequiredBody = z.object({
    body: emailNotRequired,

});

export const PasswordNotRequiredBody = z.object({
    body: passwordNotRequired,

});

export const schemaUserPut = unionChecks([idUserRequredParams, NickNameNotRequiredBody, PasswordNotRequiredBody, EmailNotRequiredBody]);