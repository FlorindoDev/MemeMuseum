import { z } from "zod";
import { idRequired } from "./utils.schema.js";
import { idMemeRequiredQuery } from "../schemas/meme.schema.js";
import { idUserRequiredQuery } from "../schemas/user.schema.js";
import { unionChecks, orUnionChecks, schemaPage } from "../schemas/utils.schema.js";
import { upVoteRequiredBody } from "../schemas/comments_votes.schema.js";
import { idUserNotRequiredQuery } from "../schemas/user.schema.js";

let content = z.object({
    content: z.string(),
});

let count = z.object({
    count: z.string().optional().default("false")
        .refine((val) => { return !isNaN(Boolean(val)); }, { message: "il valore deve essere un true o false" }),
});


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

export const idCommentRequiredParams = z.object({
    params: z.object(idRequired),
})

export const contentRequiredBody = z.object({
    body: content,
});


export const countNotRequiredQuery = z.object({
    query: count
});

export const orderbyNotRequiredQuery = z.object({
    query: orderby
});

export let idMemeOridUser = (data) => {
    console.log(data);
    return data.idmeme || data.iduser;
}

export const schemaCommentsPost = unionChecks([idMemeRequiredQuery, contentRequiredBody]);
export const schemaCommentsGet = unionChecks([schemaPage, countNotRequiredQuery, orderbyNotRequiredQuery, orUnionChecks([idUserRequiredQuery, idMemeRequiredQuery])]);
export const schemaCommentsVotesPost = unionChecks([upVoteRequiredBody, idCommentRequiredParams]);
export const schemaCommentsVotesGet = unionChecks([idCommentRequiredParams, countNotRequiredQuery, idUserNotRequiredQuery])
