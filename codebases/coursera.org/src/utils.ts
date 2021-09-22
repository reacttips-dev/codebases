/**
 * Adapted from apollo-link-state/utils.ts
 */
import { DocumentNode, DirectiveNode } from 'graphql';

import { checkDocument, removeDirectivesFromDocument } from 'apollo-utilities';

const connectionRemoveConfig = {
  test: (directive: DirectiveNode) => directive.name.value === 'rest',
  remove: true,
};

const removed = new Map();
export function removeRestSetsFromDocument(query: DocumentNode): DocumentNode {
  const cached = removed.get(query);
  if (cached) return cached;

  checkDocument(query);

  const docClone = removeDirectivesFromDocument(
    [connectionRemoveConfig],
    query,
  );

  removed.set(query, docClone);
  return docClone;
}
