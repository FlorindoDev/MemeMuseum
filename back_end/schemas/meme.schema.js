import { z } from "zod";
import { idRequired, idNotRequired } from "./utils.schema.js";

let idR = z.object({
    idmeme: idRequired.id
});

let idNotR = z.object({
    idmeme: idNotRequired.id
});

export const idMemeNotRequiredQuery = z.object({
    query: idNotR
});

export const idMemeRequiredQuery = z.object({
    query: idR
});

