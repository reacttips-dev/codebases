import { JSONString } from './customScalarTypes';

/**
 * An extremely paranoid deserialization of a JSONString. What comes out will be either the
 * deserialized object, or null.
 */
export const deserializeJSONString = <TResult>(
  jsonString?: JSONString | null,
): TResult | null => {
  if (!jsonString) {
    return null;
  }

  let result: TResult | null = null;
  try {
    result = JSON.parse(jsonString) as TResult;
  } catch {
    console.warn('Failed to deserialize JSONString: ', jsonString);
  }

  return result;
};
