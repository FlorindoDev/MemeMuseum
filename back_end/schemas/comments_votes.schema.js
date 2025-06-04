import { z } from "zod";

let upVote = z.object({
    upVote: z.boolean(),
});

export const upVoteRequiredBody = z.object({
    body: upVote,
});


