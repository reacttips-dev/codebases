export function assertNever(obj: never): never {
    throw new Error(`Unexpected object ${obj}`);
}
