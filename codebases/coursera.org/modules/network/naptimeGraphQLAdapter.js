// @flow
import type {
  DocumentNode,
  FieldNode,
  OperationDefinitionNode,
  SelectionNode
} from 'graphql';

import { parseNaptimeResourceName } from './naptime';

type VariableMap = {
  [variableKey: string]: string
};

export function parseVariableMap(selection: SelectionNode): VariableMap {
  if (selection.kind === 'Field' && selection.arguments) {
    return selection.arguments.reduce(
      (memo, argument) => {
        const { name, value } = argument;
        let variableValue;
        if (value.kind === 'Variable') {
          variableValue = `$${value.name.value}`;
        }
        if (value.kind === 'StringValue') {
          variableValue = value.value;
        }
        return {
          ...memo,
          /**
           * The following expression differentiates between when the parameter is provided
           * a static string vs a variable.
           * See http://astexplorer.net/#/gist/1a09be10208d74e777dd9585a112c33b/53d1a4705b3eeedfbba627f4625b3e0052083fe1
           * We want to record both since we're passing all this along to `fetch`
           */
          [name.value]: variableValue
        };
      },
      {}
    );
  }

  return {};
}

type NaptimeHandler = {
  resource: string,
  handler: string,
  variableMap: VariableMap
};
function parseHandlersWithVariables(field: FieldNode): Array<NaptimeHandler> {
  const resource = parseNaptimeResourceName(field.name.value);
  if (field.selectionSet) {
    return field.selectionSet.selections
      .filter(
        selection =>
          selection.kind === 'Field' && selection.name.value !== '__typename'
      )
      .map(selection => {
        if (selection.kind === 'Field') {
          const handler = selection.name.value;
          const variableMap = parseVariableMap(selection);
          return { resource, handler, variableMap };
        }
        return null;
      })
      .filter(Boolean);
  }
  return [];
}

export function translateMutation(gqlDoc: DocumentNode): Array<NaptimeHandler> {
  const definitionNodes: Array<OperationDefinitionNode> = (gqlDoc.definitions.filter(
    definition => definition.kind === 'OperationDefinition' && definition.operation === 'mutation'
  ): any);

  return definitionNodes.reduce(
    (memo, definition) => {
      return memo.concat(
        definition.selectionSet.selections.reduce(
          (_memo, field) => {
            if (field.kind === 'Field') {
              return _memo.concat(parseHandlersWithVariables(field));
            }
            return _memo;
          },
          []
        )
      );
    },
    []
  );
}

export function getVariableValues(
  variableMap: VariableMap,
  requestVariables: Object
) {
  return Object.keys(variableMap).reduce(
    (memo, argument) => {
      const value = variableMap[argument].startsWith('$') ?
        requestVariables[variableMap[argument].slice(1)] :
        variableMap[argument];

      if (value === undefined) {
        throw new Error(
          `A required variable was not provided. See "${argument}"`
        );
      }

      return {
        ...memo,
        [argument]: value
      };
    },
    {}
  );
}
