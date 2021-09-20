import { FieldNode } from 'graphql';
import { getNestedResource } from './nestedResources';
import {
  UnsupportedNestedResourcePathError,
  UnsupportedFieldError,
} from '../errors';
import { QueryParams } from '../types';
import { getChildNodes } from './queryParsing';
import { singularize } from '../stringOperations';
import { getNetworkClient } from '../getNetworkClient';

const mergeQueryParams = (
  params1: QueryParams,
  params2: QueryParams,
): QueryParams => {
  const result = { ...params1 };

  return Object.entries(params2).reduce<QueryParams>(
    (mergedParams, [key, value]) => {
      // If we haven't seen this key yet, just use it's value
      if (!(key in result)) {
        mergedParams[key] = value;
        return mergedParams;
      }

      // Ignore value if it's the same as what already exists
      const existingValue = result[key];
      if (existingValue === value) {
        return mergedParams;
      }

      // Merge 2 string values
      if (typeof existingValue === 'string' && typeof value === 'string') {
        mergedParams[key] = [existingValue, value];
        return mergedParams;
      }

      // Merge an array and a string
      if (Array.isArray(existingValue) && typeof value === 'string') {
        mergedParams[key] = [...existingValue, value];
        return mergedParams;
      }

      // Merge a string and an array
      if (typeof existingValue === 'string' && Array.isArray(value)) {
        mergedParams[key] = [existingValue, ...value];
        return mergedParams;
      }

      // Merge 2 arrays
      if (Array.isArray(existingValue) && Array.isArray(value)) {
        mergedParams[key] = [...existingValue, ...value];
        return mergedParams;
      }

      return mergedParams;
    },
    result,
  );
};

/**
 * Recursively parse a given node in the Graphql query into an array of query
 * parameters eg. ['cards=all', 'card_fields=name,id', 'card_checklists=all']
 */
const parseQuery = (
  node: FieldNode,
  variables: QueryParams,
  nodeName: string = node.name.value,
  parentPath: string[] = [],
): QueryParams => {
  const path = [...parentPath, nodeName];
  const restResource = getNestedResource(path);

  // If there is no entry in VALID_NESTED_RESOURCES for this node,
  // something has gone horribly wrong with the recursion
  if (!restResource) {
    throw new UnsupportedNestedResourcePathError(path);
  }

  // Get the query params for this node
  const queryParams = restResource.nodeToQueryParams(node, variables);

  // If we are at a leaf node in the query, exit early.
  // This is uncommon, but handles nested primitive field values.
  if (!node.selectionSet) {
    return queryParams;
  }

  // Get a Set of all the valid nested resource names from the
  // VALID_NESTED_RESOURCES tree
  const validNestedResources = new Set(
    restResource.nestedResources?.map((resource) => resource.name),
  );
  const validFieldsWithNestedResources = new Set(
    restResource.fieldsWithNestedResources?.map((resource) => resource.name),
  );

  const childNodes = getChildNodes(node);

  // Validation on the child nodes
  childNodes.forEach((childNode) => {
    const name = childNode.name.value;

    // Throw an error if we are trying to query for field that is marked as
    // unsupported at this level of VALID_NESTED_RESOURCES
    if (
      restResource.unsupportedFields &&
      restResource.unsupportedFields.includes(name)
    ) {
      throw new UnsupportedFieldError(path, name);
    }
  });

  // Recursively create query params for all the nested resources below our node
  const nestedResourceParams = childNodes
    .filter(
      (childNode) =>
        validNestedResources.has(childNode.name.value) ||
        validFieldsWithNestedResources.has(childNode.name.value),
    )
    .map((childNode) =>
      parseQuery(childNode, variables, childNode.name.value, path),
    )
    .reduce(
      (flatParams, childParams) => mergeQueryParams(flatParams, childParams),
      {},
    );

  // Join all the params together
  return mergeQueryParams(queryParams, nestedResourceParams);
};

const queryParamsToString = (queryParams: QueryParams): string | null => {
  const asKeyValue = Object.entries(queryParams).reduce(
    // @ts-ignore
    (params, [key, value]) => {
      const isInvalidParamValue = value === undefined;

      if (isInvalidParamValue) {
        return params;
      }
      return [
        ...params,
        `${key}=${Array.isArray(value) && value.length === 0 ? '' : value}`,
      ];
    },
    [],
  );

  // When there is only one query parameter, and that parameter applies no field
  // expansions, then we don't want to return a URL. This is to account for the
  // case where we only request fields that are resolved by a custom resolver.
  // @ts-ignore
  if (asKeyValue.length === 1 && asKeyValue[0].endsWith('=')) {
    return null;
  }

  return asKeyValue.length > 0 ? asKeyValue.join('&') : null;
};

/**
 * Given the root node of a graphql query, generate an API URL that would
 * fetch the requested data. If no rootId is provided, attempted to grab
 * the rootId from the fieldNode's arguments
 */
export const queryToApiUrl = (
  rootNode: FieldNode,
  variables: QueryParams,
  rootId?: string,
) => {
  const networkClient = getNetworkClient();
  const rootName = singularize(rootNode.name.value);
  const queryParams = parseQuery(rootNode, variables, rootName);
  const queryParamsAsString = queryParamsToString(queryParams);

  // If there were no query strings, there's no reason to hit the API
  // so we return null to indicate that no request needs to happen
  if (!queryParamsAsString) {
    return null;
  }

  const rootIdPath = rootId ? `/${rootId}` : '';

  return encodeURI(
    networkClient.getUrl(`/1/${rootName}${rootIdPath}?${queryParamsAsString}`),
  );
};

export const queryToBatchApiUrl = (
  rootNode: FieldNode,
  variables: QueryParams,
  rootIds: string[],
) => {
  const urls = rootIds
    .map((rootId) => queryToApiUrl(rootNode, variables, rootId))
    .filter((url) => !!url) as string[];

  // We need to double encode all the commas in each url's query params
  const encodedUrls = urls
    .map(encodeURIComponent)
    .map((encodedUrl) => encodedUrl.replace(/%2C/g, '%252C'))
    .join(',');

  const networkClient = getNetworkClient();
  return networkClient.getUrl(`/1/batch?urls=${encodedUrls}`);
};
