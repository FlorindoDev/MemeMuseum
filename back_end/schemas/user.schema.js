import { z } from "zod";

const rfc5322EmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

let password = z.object({
    password: z.string().min(8).max(50),
});

let nickname = z.object({
    nickname: z.string().min(4).max(12),
});

let email = z.object({
    email: z.string().regex(rfc5322EmailRegex, "Email non valida"),
})

export const NickNameRequired = z.object({
    body: nickname,

});

export const EmailRequired = z.object({
    body: email,

})

export const PasswordRequired = z.object({
    body: password,

})



