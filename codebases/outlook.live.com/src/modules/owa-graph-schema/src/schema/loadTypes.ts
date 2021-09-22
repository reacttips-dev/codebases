import { default as schemaUri } from '../__generated__/schema.all.min.graphql';

export async function loadTypes(): Promise<string> {
    if (!process.env.JEST_WORKER_ID) {
        const resp = await fetch(schemaUri);
        return resp.text();
    } else {
        // In tests, the "schemaUri" is transformed to just be the source
        return schemaUri;
    }
}

export function loadTypesForTests(): string {
    return schemaUri;
}
