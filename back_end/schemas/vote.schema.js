import { z } from "zod"
import { idRequired } from "./utils.schema.js"


let upVote = z.object({
    upVote: z.boolean(),
});

export const upVoteRequiredBody = z.object({
    body: upVote,
});


export const idVoteRequiredParams = z.object({
    params: z.object(idRequired),
})