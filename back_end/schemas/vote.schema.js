import { z } from "zod";
import { idRequired } from "./utils.schema.js";
import { countNotRequiredQuery } from "../schemas/comments.schema.js";
import { idUserRequiredQuery } from "../schemas/user.schema.js";
import { unionChecks, orUnionChecks } from "../schemas/utils.schema.js";
import { idMemeRequiredQuery } from "./meme.schema.js";

let upVote = z.object({
    upVote: z.boolean(),
});

export const upVoteRequiredBody = z.object({
    body: upVote,
});


export const idVoteRequiredParams = z.object({
    params: z.object(idRequired),
});



export const schemaVotesGet = unionChecks([countNotRequiredQuery, orUnionChecks([idMemeRequiredQuery, idUserRequiredQuery])]);
export const schemaVotePost = unionChecks([upVoteRequiredBody, idMemeRequiredQuery])