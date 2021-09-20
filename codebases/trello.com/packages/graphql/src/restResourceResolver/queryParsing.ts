import { singularize, firstLetterToUpper } from '../stringOperations';
import { resolvers } from '../resolvers';
import { FieldNode, ArgumentNode, ValueNode } from 'graphql';
import { isResourceName } from './nestedResources';
import { QueryParam, QueryParams } from '../types';
import {
  MissingQueryVariableError,
  InvalidArgumentNodeError,
  PrimitiveValueParsingError,
  StringValueParsingError,
} from '../errors';

/**
 * This method inspects the resolvers map to check for custom resolvers
 * for a given parent->field. This is used to determine whether we want
 * this field to be included in the generated REST URL, or whether it
 * should be ignored (due to being handled by a custom resolver)
 */
const fieldHasCustomResolver = (
  parentName: string,
  fieldName: string,
): boolean => {
  const normalizedParentName = singularize(firstLetterToUpper(parentName));
  const resolverMap = resolvers as { [key: string]: object };

  return !!Object.keys(resolverMap).find(
    (key) =>
      key === normalizedParentName &&
      Object.keys(resolverMap[key]).includes(fieldName),
  );
};

/**
 * Gets all the child nodes of a given node that aren't __typename
 */
export const getChildNodes = (node: FieldNode): FieldNode[] => {
  if (!node.selectionSet) {
    return [];
  }
  return node.selectionSet.selections.filter(
    // @ts-ignore
    (fieldNode: FieldNode) => fieldNode.name.value !== '__typename',
  ) as FieldNode[];
};

/**
 * Gets all the child nodes of a given node that represent a 'field' in
 * the query (i.e they are not a nested resource or handled by a custom resolver)
 *
 * Note that _sometimes_ server expands nested resources by including them as a 'field'
 * for example expanding the 'labels' of a 'card' means including 'labels' in the 'fields'
 * parameter of 'card'. For this reason we allow nestedResources to be included in the childFieldNames
 * with the resourcesToInclude parameter (they still must be present as a child in the query)
 */
export const getChildFieldNames = (
  node: FieldNode,
  resourcesToInclude: string[] = [],
): string[] => {
  return getChildNodes(node)
    .map((childNode) => childNode.name.value)
    .filter((name) => {
      if (
        isResourceName(name, node.name.value) &&
        !resourcesToInclude.includes(name)
      ) {
        return false;
      }

      if (fieldHasCustomResolver(node.name.value, name)) {
        return false;
      }

      return true;
    });
};

/**
 * Get the ArgumentNode for a node matching a given name
 */
const getArgumentNode = (
  node: FieldNode,
  argumentName: string,
): ArgumentNode | undefined => {
  if (!node.arguments) {
    return undefined;
  }

  return node.arguments.find(
    (argumentNode) => argumentNode.name.value === argumentName,
  );
};

/**
 * Returns a primitive value from a value node (not a list, object, or null)
 * Throws if value node is not a primitive value
 */
const primitiveValueFromValueNode = (
  node: ValueNode,
): number | string | boolean => {
  switch (node.kind) {
    case 'IntValue':
    case 'FloatValue':
    case 'StringValue':
    case 'BooleanValue':
    case 'EnumValue':
      return node.value;
    default:
      throw new PrimitiveValueParsingError(node.kind);
  }
};

/**
 * Returns a string value from a value node
 */
const stringFromValueNode = (node: ValueNode): string => {
  switch (node.kind) {
    case 'IntValue':
    case 'FloatValue':
    case 'StringValue':
    case 'BooleanValue':
    case 'EnumValue':
      return `${node.value}`;
    default:
      throw new StringValueParsingError(node.kind);
  }
};

/**
 * Get the query param value from a ValueNode
 * Throws if the value in the node is not a valid query param (is an object,
 * multi-dimensional list, or null)
 */
export const queryParamFromValueNode = (
  node: ValueNode,
  variables: QueryParams,
): QueryParam => {
  switch (node.kind) {
    case 'IntValue':
    case 'FloatValue':
    case 'StringValue':
    case 'BooleanValue':
    case 'EnumValue':
      return primitiveValueFromValueNode(node);
    case 'ListValue':
      return node.values.map(stringFromValueNode);
    default:
      throw new InvalidArgumentNodeError(node.kind);
  }
};

/**
 * Get the value for an argument on the node
 */
export const getArgument = (
  node: FieldNode,
  argumentName: string,
  variables: QueryParams,
): QueryParam | undefined => {
  const argumentNode = getArgumentNode(node, argumentName);
  if (!argumentNode) {
    return undefined;
  }

  const argumentValueNode = argumentNode.value;

  // If the we were supplied a variable for this argument,
  // unpack it's value from the variables supplied to the resolver
  if (argumentValueNode.kind === 'Variable') {
    const variableValue = variables[argumentNode.name.value];

    // If we could not obtain the variable's value, it's because we are
    // 'too deep' in the query for non-hard-coded variables (we are parsing
    // entirely in the root resolver, so don't have access to deeper argument variables)
    if (!variableValue) {
      throw new MissingQueryVariableError(argumentValueNode.name.value);
    }

    return variables[argumentNode.name.value];
  }

  // Otherwise, this is a hard-coded argument, so we need to parse
  // it's value from the AST (it might be a hard coded array in the query
  // for example)
  return queryParamFromValueNode(argumentNode.value, variables);
};
