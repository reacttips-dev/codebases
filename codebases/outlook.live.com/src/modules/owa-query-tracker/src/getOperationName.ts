import type { DocumentNode } from 'graphql';

export function getOperationName(doc: DocumentNode): string {
    for (const d of doc.definitions) {
        if (d.kind === 'OperationDefinition') {
            return `${d.operation}:${d.name?.value || 'unknown'}`;
        }
    }

    return 'unknown';
}
