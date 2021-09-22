export function objToParams(obj: Record<string, string>): string {
  const Keys = Object.keys(obj).map((key) => {
    return `${key}=${obj[key]}`;
  });
  return Keys.join('&');
}

export function getPath({ userId, courseForumId }: { userId: number; courseForumId: string }) {
  return `${userId}~${courseForumId}`;
}

export function subparams(fieldsArray: string[]): string {
  return fieldsArray.join('%2C');
}

export function fieldsArgument(fieldsArray: string[]): string {
  return 'fields=' + subparams(fieldsArray);
}

export const SUBFIELD_DELIMITER = '%2C';

export function linkedToArguments<LinkedItemsType>(linkedItems: LinkedItemsType) {
  const names: string[] = [];
  const keys = Object.keys(linkedItems);

  for (let i = 0; i < keys.length; i += 1) {
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const { api, fields } = linkedItems[keys[i]];
    if (fields && Array.isArray(fields)) {
      names.push(api + '(' + fields.join(SUBFIELD_DELIMITER) + ')');
    }
  }

  return names.join(SUBFIELD_DELIMITER);
}

export function includesAsField(linkedItems: {}) {
  const keys = Object.keys(linkedItems);
  if (keys.length > 0) {
    return 'includes=' + Object.keys(linkedItems).reduce((prev, current) => prev + '%2C' + current);
  } else {
    return '';
  }
}

interface BaseInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
  path?: string;
  fields?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  includes?: any;
}

export function getURI<Args extends BaseInterface>(args: Args) {
  let paramsStr = objToParams(args.params);
  let path = typeof args?.path === 'string' ? args.path : getPath(args.params);
  let fields = args.fields && fieldsArgument(args.fields);
  if (args.includes) {
    paramsStr += '&' + includesAsField(args.includes);
  }
  const includes = args.includes && linkedToArguments(args.includes);
  if (fields && includes) {
    fields += `%2C${includes}`;
  }

  if (path) {
    path += '?';
  }
  if (paramsStr) {
    path += paramsStr;
  }
  if (fields) {
    path += '&' + fields;
  }

  return path;
}
