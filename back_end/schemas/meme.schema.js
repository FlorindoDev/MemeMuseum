import { z } from "zod";
import { idRequired, idNotRequired, schemaPage, unionChecks } from "./utils.schema.js";
import { idUserNotRequiredQuery } from "./user.schema.js";

let idR = z.object({
    idmeme: idRequired.id
});

let idNotR = z.object({
    idmeme: idNotRequired.id
});

let description = z.object({
    description: z.string(),
});

let nametags = z.object({
    nametags: z.string().optional(),
});

let arraytags = z.object({
    name: z.string(),
});


let nametagsArray = z.array(arraytags);


export const idMemeNotRequiredQuery = z.object({
    query: idNotR
});

export const idMemeRequiredQuery = z.object({
    query: idR
});

export const descriptionNotRequiredBody = z.object({
    body: description
});

export const idMemeRequiredParams = z.object({
    params: z.object(idRequired),
});


export const nametagsNotRequiredQuery = z.object({
    query: nametags
});

export const nametagsArrayRequiredBody = z.object({
    body: nametagsArray
});


export const schemaTagsPost = unionChecks([idMemeRequiredParams, nametagsArrayRequiredBody]);
export const schemaTagsGet = unionChecks([idMemeRequiredParams, nametagsNotRequiredQuery]);
export const schemaMemeGet = unionChecks([schemaPage, idUserNotRequiredQuery, nametagsNotRequiredQuery]);