import { z } from "zod";

export let idRequired = {
    id: z.string().refine((val) => { return !isNaN(Number(val)); }, { message: "valore deve essere un numero" }),
}

export let idNotRequired = {
    id: z.string().optional()
        .refine((val) => val === undefined || !isNaN(Number(val)), {
            message: "Il valore deve essere un numero (in stringa)",
        })
}

export function unionChecks(checks = []) {

    return checks.reduce((acc, schema) => acc.and(schema));

}

export function orUnionChecks(checks = []) {

    return checks.reduce((acc, schema) => acc.or(schema));

}