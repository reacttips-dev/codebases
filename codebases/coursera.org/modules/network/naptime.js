// @flow
import invariant from 'invariant';
import Uri from 'jsuri';
import { type FetchOptions } from 'apollo-link-http';

export function parseNaptimeResourceName(typename: string): string {
  const matchResults = typename.match(/(.*)(V[0-9])(Resource)/);

  let resourceName;
  let resourceVersion;
  if (matchResults) {
    resourceName = matchResults[1];
    resourceVersion = matchResults[2];
  }

  let naptimeResourceName;
  if (resourceName != null && resourceVersion != null) {
    naptimeResourceName = `${resourceName.charAt(0).toLowerCase()}${resourceName.slice(
      1
    )}.${resourceVersion.toLowerCase()}`;
  } else {
    throw new Error(`Unable to parse Naptime resource name from GraphQL type \`${typename}\``);
  }

  return naptimeResourceName;
}

type NaptimeUrlInput = {
  uri: string,
  resourceName: string,
  handler: {
    name: string,
    args: { [string]: string },
  },
  fetchOptions: FetchOptions,
  headers: HeadersInit,
};

const REQUIRED_OPERATION_ARGS = {
  create: ['body'],
  update: ['id', 'body'],
  delete: ['id'],
  action: ['action'],
};
export function constructNaptimeUrl({ uri, resourceName, handler }: NaptimeUrlInput): string {
  const baseUri = new Uri(uri);
  let url;
  if (baseUri.host()) {
    url = `${baseUri.protocol()}://${baseUri.host()}/api/${resourceName}`;
  } else {
    url = `/api/${resourceName}`;
  }

  const requiredArgs = REQUIRED_OPERATION_ARGS[handler.name];
  const missingRequiredArgs = requiredArgs.every((requiredArg) => handler.args[requiredArg]);
  invariant(missingRequiredArgs, `The \`${handler.name}\` handler requires arguments: ${requiredArgs.join(', ')}`);

  if (handler.name === 'update' || handler.name === 'delete') {
    url = `${url}/${handler.args.id}`;
  }

  const naptimeUri = new Uri(url);
  if (handler.name === 'action') {
    Object.keys(handler.args)
      .filter((key) => key !== 'body')
      .forEach((key) => {
        naptimeUri.addQueryParam(key, handler.args[key]);
      });
  }

  return naptimeUri.toString();
}

export function performNaptimeMutation({
  handler,
  resourceName,
  fetchOptions = {},
  /** Context headers. */
  headers,
  uri,
}: NaptimeUrlInput): Promise<*> {
  const naptimeURI: string = constructNaptimeUrl({
    handler,
    resourceName,
    uri,
    fetchOptions,
  });

  let method;
  switch (handler.name) {
    case 'update':
      method = 'PUT';
      break;
    case 'delete':
      method = 'DELETE';
      break;
    case 'create':
    case 'action':
    default:
      method = 'POST';
      break;
  }

  let body;
  if (handler.args) {
    body = handler.args.body;
  }

  if (method === 'POST' && !body) {
    body = '{}';
  }

  // $FlowFixMe
  return fetch(naptimeURI, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(fetchOptions ? fetchOptions.headers : {}),
      // Headers provided by the context are more request specific, so we give them precedence.
      ...(headers || {}),
    },
    method,
    body,
  });
}
