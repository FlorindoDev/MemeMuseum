import { z } from "zod";
import { idRequired, idNotRequired, schemaPage, unionChecks } from "./utils.schema.js";
import { idUserNotRequiredQuery, NickNameNotRequiredQuery } from "./user.schema.js";

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
    name: z.string().min(3).max(15),
});


let nametagsArray = z.array(arraytags);

let orderby = z.object({
    orderby: z.string().optional()
        .refine((val) => {
            if (val === undefined) return true;

            let params = val.split(',');
            let element_to_order = ["upvote", "downvote"];
            let type_of_order = ["ASC", "DESC"];

            element_to_order = element_to_order.filter((val) => { return val === params[0] ? true : false });
            type_of_order = type_of_order.filter((val) => { return val === params[1] ? true : false });


            if (element_to_order.length !== 0 && type_of_order.length !== 0) return true;
            return false;

        }, { message: "il primo volore deve essere upvote o downvote il secondo ASC o DESC (es. upvote,ASC)" }),
});

let orderbydate = z.object({
    orderbydate: z.string().optional()
        .refine((val) => {
            if (val === undefined) return true;

            let type_of_order = ["ASC", "DESC"];

            type_of_order = type_of_order.filter((order) => { return order === val ? true : false });


            if (type_of_order.length !== 0) return true;
            return false;

        }, { message: "il valore deve essere ASC o DESC" }),
});


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

export const orderbyNotRequiredQuery = z.object({
    query: orderby
});

export const orderbydateNotRequiredQuery = z.object({
    query: orderbydate
});

export const schemaTagsPost = unionChecks([idMemeRequiredParams, nametagsArrayRequiredBody]);
export const schemaTagsGet = unionChecks([idMemeRequiredParams, nametagsNotRequiredQuery]);
export const schemaMemeGet = unionChecks([orderbydateNotRequiredQuery, orderbyNotRequiredQuery, NickNameNotRequiredQuery, schemaPage, idUserNotRequiredQuery, nametagsNotRequiredQuery]);