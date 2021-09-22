// @flow
import type { DocumentNode } from 'graphql';
import { type FetchOptions, type Operation } from 'apollo-link-http';

import { performNaptimeMutation } from './naptime';
import { translateMutation, getVariableValues } from './naptimeGraphQLAdapter';

type FetchResponse = Response & { json: () => Promise<{ data: any }> };
export function transformMutationResponse(doc: DocumentNode, response: FetchResponse) {
  const {
    definitions: [definition],
  } = doc;

  if (definition.kind === 'OperationDefinition') {
    const {
      selectionSet: {
        selections: [firstField],
      },
    } = definition;

    if (firstField.kind === 'Field') {
      const resourceName = firstField.name.value;
      if (firstField.selectionSet) {
        const handler = firstField.selectionSet.selections[0];

        const typename = resourceName.match(/(.*)Resource/);
        const element = {
          __typename: typename && typename[1],
        };

        if (handler.kind === 'Field') {
          if (handler.selectionSet) {
            Object.assign(
              element,
              handler.selectionSet.selections.reduce((memo, fieldName) => {
                if (fieldName.kind === 'Field') {
                  return Object.assign(memo, {
                    // $FlowFixMe
                    [fieldName.name.value]: response.elements[0][fieldName.name.value],
                  });
                }
                return memo;
              }, {})
            );
          }
          return {
            data: {
              [resourceName]: {
                __typename: resourceName,
                [handler.name.value]: element,
              },
            },
          };
        }
      }
    }
  }

  return response;
}

export const transformResponse = (doc: DocumentNode) => (response: Response): Promise<Response> => {
  if (!response.ok) {
    return Promise.resolve(response);
  }
  // $FlowFixMe
  return response.json().then((originalJson) => {
    const { status, statusText, headers, url } = response;
    return new Response(JSON.stringify(transformMutationResponse(doc, originalJson)), {
      status,
      statusText,
      headers,
      url,
    });
  });
};

export default function naptimeFetch(operation: Operation) {
  const { query } = operation;
  const { headers, fetchOptions, uri } = operation.getContext();

  // I think this is where the "bug" is at. We need to respect the context in this fetch.
  // yarn build && cp -R dist/* ../../../web/node_modules/@coursera/graphql-utils/dist/

  // We'll assume that everything is a mutation right now.
  const operations = translateMutation(query);
  const { resource: resourceName, handler, variableMap } = operations[0];
  return performNaptimeMutation({
    uri,
    resourceName,
    handler: {
      name: handler,
      args: getVariableValues(variableMap, operation.variables),
    },
    headers,
    fetchOptions,
  }).then(transformResponse(query));
}
