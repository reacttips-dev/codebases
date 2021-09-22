import NaptimeClient from 'bundles/naptimejs/client/NaptimeClient';
import stringUniq from 'bundles/naptimejs/util/stringUniq';
import memoize from 'js/lib/memoize';

/**
 * Parses a NaptimeClient to pull the requested fields and includes out, to be merged with existing
 * list of requested fields and includes.
 *
 * Note: all items requested in `includes` are _also_ added to `fields`, because of the way that Naptime works.
 *
 * @param  {NaptimeClient} NaptimeClient to parse fields and includes from
 * @param  {Map[string, array]} Existing mapping of resource names -> list of requested fields
 * @param  {Map[string, array]} Existing mapping of resource names -> list of requested includes
 */
export const parseRequest = function (client, fields, includes) {
  const existingFields = fields[client.resourceName] || [];
  fields[client.resourceName] = existingFields.concat(client.getFields()).concat(client.getIncludes());

  const existingIncludes = includes[client.resourceName] || [];
  includes[client.resourceName] = existingIncludes.concat(client.getIncludes());
};

/**
 * Converts a mapping of resource names -> strings to a string format that can be appended to a url for Naptime
 * Mostly converts items to the format resourceName(field1, field2).
 * However, for the base resource (i.e. courses.v1 if we're requesting /api/courses.v1), this omits the resourceName
 * from the string.
 *
 * @param  {Map[string, array]} Mapping of resource names -> list of strings (either fields or includes)
 * @param  {string} Base resource type for the request
 * @return {string} string representation of the data, to be added to the url
 */
export const stringifyResourceData = memoize(function (data, base) {
  return Object.keys(data)
    .map((resource) => {
      const elements = data[resource];
      if (elements.length > 0) {
        const uniqElements = stringUniq(elements);
        if (resource === base) {
          return uniqElements.join(',');
        } else {
          const nestedResourceRequires = [];
          const fields = [];
          uniqElements.forEach((element) => {
            // We want to move any nested resource requires to the top-level, such as:
            // resource.v1(prop),resource.v2(prop)
            // NOT: resource.v1(prop,resource.v2(prop))
            if (element.indexOf('(') === -1) {
              fields.push(element);
            } else {
              nestedResourceRequires.push(element);
            }
          });
          const totalResourceRequires = [`${resource}(${stringUniq(fields).join(',')})`].concat(nestedResourceRequires);
          return totalResourceRequires.join(',');
        }
      }

      return undefined;
    })
    .filter((x) => x)
    .join(',');
});

/**
 * Recursively parses a list of props passed to the NaptimeJS container to determine all subcomponents,
 * used for url construction to ensure we make as few requests to the server as possible.
 *
 * @param  {object} list of props (containing NaptimeClients and other fields)
 * @param  {Array} existing list of subcomponents (used for merging in recursive calls)
 * @return {Array} list of NaptimeJS components used down the tree.
 */
export const parseSubcomponents = function (props, context, subcomponents = []) {
  let currentSubcomponents = subcomponents;

  Object.keys(props).forEach((propKey) => {
    const client = props[propKey];

    if (client instanceof NaptimeClient) {
      currentSubcomponents = currentSubcomponents.concat(client.getSubcomponents());
      client.getSubcomponents().forEach((subcomponent) => {
        const naptimeSubcomponent = subcomponent.naptimeConnectorComponent || subcomponent;
        const defaultData = naptimeSubcomponent.getWrappedComponentProps({});
        if (defaultData) {
          currentSubcomponents = parseSubcomponents(defaultData, context, currentSubcomponents);
        }
      });
    }
  });

  return currentSubcomponents;
};

export const constructUrl = function (props, context, subcomponents = []) {
  const fields = {};
  const includes = {};
  const naptimeClientKeys = Object.keys(props).filter((propKey) => props[propKey] instanceof NaptimeClient);

  const requestsToMake = {};
  naptimeClientKeys.forEach((clientKey) => {
    parseRequest(props[clientKey], fields, includes);

    const client = props[clientKey];
    if (client.isValid()) {
      requestsToMake[clientKey] = client;
    }
  });

  // Parse subcomponent fields + includes
  subcomponents = subcomponents.length === 0 ? parseSubcomponents(props, context) : subcomponents;
  subcomponents.forEach((component) => {
    const naptimeWrapper = component.naptimeConnectorComponent || component;
    const defaultData = naptimeWrapper.getWrappedComponentProps({});
    Object.keys(defaultData).forEach((key) => {
      const client = defaultData[key];
      if (client instanceof NaptimeClient) {
        parseRequest(client, fields, includes);
      }
    });
  });

  return Object.keys(requestsToMake).map((key) => {
    const client = requestsToMake[key];
    const uri = client.getUri();

    // Add fields to url
    const fieldsStr = stringifyResourceData(fields, client.resourceName);
    if (fieldsStr.length) {
      uri.addQueryParam('fields', fieldsStr);
    }

    // Add includes to url
    const includesStr = stringifyResourceData(includes, client.resourceName);
    if (includesStr.length) {
      uri.addQueryParam('includes', includesStr);
    }

    // Convert back to commas and return url
    const url = uri.toString().replace(/%2C/g, ',');

    return { url, client };
  });
};
