import { z } from "zod";
import { idRequired } from "./utils.schema.js";

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
