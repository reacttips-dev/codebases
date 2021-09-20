import {
  DocumentNode,
  OperationDefinitionNode,
  SelectionSetNode,
  FieldNode,
} from 'graphql';

/**
 * Creates a selection set from object. This is the eqivalent
 * of what is returned from gql`query {}` where it includes a
 * selection set of fields based on the object provided
 */
const selectionSetFromObj = (obj: unknown): SelectionSetNode | null => {
  if (
    typeof obj === 'number' ||
    typeof obj === 'boolean' ||
    typeof obj === 'string' ||
    typeof obj === 'undefined' ||
    obj === null
  ) {
    // No selection set here
    return null;
  }

  if (Array.isArray(obj)) {
    // GraphQL queries don't include arrays
    return selectionSetFromObj(obj[0]);
  }

  // Now we know it's an object
  const selections: FieldNode[] = [];

  Object.keys(obj as { [key: string]: unknown }).forEach((key) => {
    const nestedSelSet: SelectionSetNode | null = selectionSetFromObj(
      (obj as { [key: string]: unknown })[key],
    );

    const field: FieldNode = {
      kind: 'Field',
      name: {
        kind: 'Name',
        value: key,
      },
      selectionSet: nestedSelSet || undefined,
    };
    selections.push(field);
  });

  const selectionSet: SelectionSetNode = {
    kind: 'SelectionSet',
    selections,
  };
  return selectionSet;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export const queryFromPojo = (obj: unknown): DocumentNode => {
  const op: OperationDefinitionNode = {
    kind: 'OperationDefinition',

    operation: 'query',

    name: {
      kind: 'Name',

      value: 'GeneratedClientQuery',
    },

    selectionSet: selectionSetFromObj(obj) || {
      kind: 'SelectionSet',

      selections: [],
    },
  };

  const out: DocumentNode = {
    kind: 'Document',

    definitions: [op],
  };

  return out;
};
