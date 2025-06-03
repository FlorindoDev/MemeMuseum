

export function unionChecks(checks = []) {

    return checks.reduce((acc, schema) => acc.and(schema));

}