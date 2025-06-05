import { z } from "zod";
import { idRequired } from "./utils.schema.js";
import { idMemeRequiredQuery } from "../schemas/meme.schema.js";
import { idUserRequiredQuery } from "../schemas/user.schema.js";
import { unionChecks, orUnionChecks } from "../schemas/utils.schema.js";
import { upVoteRequiredBody } from "../schemas/comments_votes.schema.js";

let content = z.object({
    content: z.string(),
});

let count = z.object({
    count: z.string().optional().default("false")
        .refine((val) => { return !isNaN(Boolean(val)); }, { message: "il valore deve essere un true o false" }),
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

export let idMemeOridUser = (data) => {
    console.log(data);
    return data.idmeme || data.iduser;
}

export const schemaCommentsPost = unionChecks([idMemeRequiredQuery, contentRequiredBody]);
export const schemaCommentsGet = unionChecks([countNotRequiredQuery, orUnionChecks([idUserRequiredQuery, idMemeRequiredQuery])]);
export const schemaCommentsVotesPost = unionChecks([upVoteRequiredBody, idCommentRequiredParams]);
export const schemaCommentsVotesGet = unionChecks([idCommentRequiredParams, countNotRequiredQuery])
