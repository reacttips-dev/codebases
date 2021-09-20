/* eslint-disable import/no-default-export */
import { HasRequiredKeys } from 'app/gamma/src/util/types';

const keys = <T>(obj: T) => Object.keys(obj) as (keyof T)[];

type ArrayKeys<T> = {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  [K in keyof T]-?: T[K] extends (infer U)[] | undefined ? K : never;
}[keyof T];

export type NormalizationPerAttributeOptions = string | object | undefined;

type NormalizationPerModelOptions<Model> = {
  [attr in keyof Model]?: NormalizationPerAttributeOptions;
  // Use of this helper is discouraged - it's likely that it's better to add a
  // helper method to a package like @trello/boards, @trello/cards, etc to
  // derive values from a Model
};

type FromResponse<ApiResponse, T> = (
  response: ApiResponse,
  existing?: T,
  options?: NormalizationPerAttributeOptions,
) => T;

type NormalizerMap<ApiResponse, Model> = {
  [key in keyof Model]-?: FromResponse<ApiResponse, Model[key]>;
};

type FromHelper<ApiResponse> = <K extends keyof ApiResponse>(
  key: K,
) => FromResponse<ApiResponse, ApiResponse[K]>;

type CombineHelper<ApiResponse> = <K extends keyof ApiResponse, T>(
  keys: K[],
  callback: (response: HasRequiredKeys<ApiResponse, K>) => T,
) => FromResponse<ApiResponse, T | Extract<ApiResponse[K], undefined>>;

type FallbackHelper<ApiResponse> = <T>(
  result: FromResponse<ApiResponse, T | undefined>,
  defaultValue: T,
) => FromResponse<ApiResponse, T>;

type HasHelper<ApiResponse> = <K extends keyof ApiResponse, T>(
  key: K,
  callback: (value: Exclude<ApiResponse[K], undefined>) => T,
) => FromResponse<ApiResponse, T | Extract<ApiResponse[K], undefined>>;

type PatchHelper<ApiResponse, Model> = <K extends keyof Model>(
  key: K,
  callback: (
    value: Model[K],
    options?: NormalizationPerAttributeOptions,
  ) => FromResponse<ApiResponse, Model[K]>,
  defaultValue: Model[K],
) => FromResponse<ApiResponse, Model[K]>;

type MapHelper<ApiResponse> = <
  K extends ArrayKeys<ApiResponse>,
  T,
  V = Exclude<ApiResponse[K], undefined> extends (infer U)[] ? U : never
>(
  key: K,
  callback: (value: V) => T,
) => FromResponse<ApiResponse, T[] | Extract<ApiResponse[K], undefined>>;

type ClientOnlyHelper<ApiResponse> = <T>() => FromResponse<
  ApiResponse,
  T | undefined
>;

interface NormalizerHelpers<ApiResponse, Model> {
  from: FromHelper<ApiResponse>;
  fallback: FallbackHelper<ApiResponse>;
  has: HasHelper<ApiResponse>;
  patch: PatchHelper<ApiResponse, Model>;
  map: MapHelper<ApiResponse>;
  clientOnly: ClientOnlyHelper<ApiResponse>;
  // DEPRECATED
  DEPRECATED_combine: CombineHelper<ApiResponse>;
}

type CreateNormalizer<ApiResponse, Model> = (
  helpers: NormalizerHelpers<ApiResponse, Model>,
) => NormalizerMap<ApiResponse, Model>;

function isDefined<T>(value: T): value is Exclude<T, undefined> {
  return value !== undefined;
}

function firstDefinedValue<T, U>(
  values: T[],
  defaultValue: U,
): Exclude<T, undefined> | U {
  const found = values.find(isDefined);
  if (isDefined(found)) {
    return found;
  } else {
    return defaultValue;
  }
}

function hasAllKeys<ApiResponse, K extends keyof ApiResponse>(
  response: ApiResponse,
  requiredKeys: K[],
): response is ApiResponse & HasRequiredKeys<ApiResponse, K> {
  return requiredKeys.every(
    (key) => response[key as K & keyof ApiResponse] !== undefined,
  );
}

/*
Takes a callback that will be given a map of helper functions and is expected to return
a map from keys on the model to normalizer functions.

Normalizer functions look like this:

(response: ApiResponse, existing?: T, options?: NormalizationPerAttributeOptions) => T

... but you are encouraged to use the following helper functions that get passed to
the callback

from(keyOnResponse)

  e.g. from('someKey')

  A normalizer that returns 'someKey' from the response

has(keyOnResponse, callback)

  e.g. has('someKey', someValue => `${someValue}`)

  A normalizer that checks to see if a key is defined on the response, and passes
  the value from the response to the callback if it is.  If the key isn't on the
  response, returns undefined.  (You may want to wrap this in a call to fallback
  if the model won't accept undefined)

DEPRECATED_combine(keysOnResponse, callback)

  e.g. combine(['foo', 'bar'], ({ foo, bar }) => [foo, bar].join())

  This is similar to has, but operates on multiple keys.

  A normalizer that checks to see if multiple keys are defined on the response, and
  passes the values from the response to the callback if all of them are.  If any
  key isn't defined on the response, returns undefined.  (You may want to wrap this
  in a call to fallback if the model won't accept undefined)

  Use of this helper is discouraged - it's likely that it's better to add a
  helper method to a package like @trello/boards, @trello/cards, etc to
  derive values from a Model.  It still exists while we remove existing uses.

map(keyOnResponse, callback)

  e.g. map('entries', entry => entry.id)

  A normalizer that checks to see if a key is corresponds to a defined array on
  the response, and returns the result of calling the callback function on each
  value in the array.

fallback(normalizer, defaultValue)

  e.g. fallback(someNormalizer, "default value")
       fallback(from('someKey'), "default value")

  A normalizer that takes another normalizer, runs it and then returns either the
  result (if the result is defined), the existing value on the model, or else the
  provided default value.

patch(keyOnModel, callback, defaultValue)

  e.g. patch('maxValue', maxValue =>
         fallback(has('value', value => Math.max(maxValue, value)), maxValue)
       , 0)

clientOnly()

  e.g. clientOnly()

  A normalizer that ignores the response and just keeps whatever the current
  value for the key is on any existing model

A call might look like this

interface PersonResponse {
  id: string,
  first?: string,
  last?: string,
  title?: string,
  age?: number
}

interface PersonModel {
  id: string,
  fullName?: string,
  age?: number,
  job?: string,
  isAdult: boolean,
}

genericNormalizer<PersonResponse, PersonModel>(({ from }) => ({
  id: from('id'),
  age: from('age'),
  job: from('title'),
  fullName: combine(['first', 'last'], ({ first, last }) => [first, last].join(' ')),
  isAdult: fallback(has('age', age => age >= 18), false)
}))
*/
export default <ApiResponse, Model>(
  callback: CreateNormalizer<ApiResponse, Model>,
) => {
  const fallback: FallbackHelper<ApiResponse> = <T>(
    normalizer: FromResponse<ApiResponse, T | undefined>,
    defaultValue: T,
  ): FromResponse<ApiResponse, T> => (
    response: ApiResponse,
    existing?: T,
    options?: NormalizationPerAttributeOptions,
  ) =>
    firstDefinedValue(
      [normalizer(response, existing, options), existing],
      defaultValue,
    );

  const from: FromHelper<ApiResponse> = <K extends keyof ApiResponse>(
    key: K,
  ): FromResponse<ApiResponse, ApiResponse[K]> => {
    return (response: ApiResponse): ApiResponse[K] => {
      return response[key];
    };
  };

  const has: HasHelper<ApiResponse> = <K extends keyof ApiResponse, T>(
    key: K,
    fx: (value: Exclude<ApiResponse[K], undefined>) => T,
  ): FromResponse<ApiResponse, T | Extract<ApiResponse[K], undefined>> => {
    return (response: ApiResponse): T | Extract<ApiResponse[K], undefined> => {
      const value = response[key];
      if (isDefined(value)) {
        return fx(value);
      } else {
        return value as Extract<ApiResponse[K], undefined>;
      }
    };
  };

  const combine: CombineHelper<ApiResponse> = <K extends keyof ApiResponse, T>(
    requiredKeys: K[],
    fx: (subset: HasRequiredKeys<ApiResponse, K>) => T,
  ): FromResponse<ApiResponse, T | Extract<ApiResponse[K], undefined>> => {
    return (response: ApiResponse): T | Extract<ApiResponse[K], undefined> => {
      return hasAllKeys(response, requiredKeys)
        ? fx(response)
        : (undefined as Extract<ApiResponse[K], undefined>);
    };
  };

  const patch: PatchHelper<ApiResponse, Model> = <K extends keyof Model>(
    key: K,
    fx: (
      value: Model[K],
      options: NormalizationPerAttributeOptions,
    ) => FromResponse<ApiResponse, Model[K]>,
    defaultValue: Model[K],
  ): FromResponse<ApiResponse, Model[K]> => {
    return (
      response: ApiResponse,
      existing?: Model[K],
      options?: NormalizationPerAttributeOptions,
    ): Model[K] => {
      const value = existing !== undefined ? existing : defaultValue;

      return fx(value, options)(response);
    };
  };

  const map: MapHelper<ApiResponse> = <
    K extends ArrayKeys<ApiResponse>,
    T,
    V = Exclude<ApiResponse[K], undefined> extends (infer U)[] ? U : never
  >(
    key: K,
    mapper: (value: V) => T,
  ): FromResponse<ApiResponse, T[] | Extract<ApiResponse[K], undefined>> => {
    return (
      response: ApiResponse,
    ): T[] | Extract<ApiResponse[K], undefined> => {
      const value = response[key];

      return Array.isArray(value)
        ? (value as V[]).map((entry: V) => mapper(entry))
        : (undefined as Extract<ApiResponse[K], undefined>);
    };
  };

  const clientOnly: ClientOnlyHelper<ApiResponse> = <T>(): FromResponse<
    ApiResponse,
    T | undefined
  > => {
    return (response: ApiResponse, existing?: T): T | undefined => {
      return existing;
    };
  };

  const helpers: NormalizerHelpers<ApiResponse, Model> = {
    DEPRECATED_combine: combine,
    fallback,
    from,
    has,
    clientOnly,
    map,
    patch,
  };

  const normalizers: NormalizerMap<ApiResponse, Model> = callback(helpers);

  return (
    response: ApiResponse,
    existing?: Model,
    options?: NormalizationPerModelOptions<Model>,
  ): Model => {
    const model: Partial<Model> = {};

    keys(normalizers).forEach((key) => {
      const existingValue = existing ? existing[key] : undefined;
      const keyOptions =
        options && Object.prototype.hasOwnProperty.call(options, key)
          ? options[key]
          : undefined;

      model[key] = fallback(normalizers[key], existingValue)(
        response,
        existingValue,
        keyOptions,
      );
    });

    return model as Model;
  };
};

export const normalizeDate = <T>(dateString: T): Date | Exclude<T, string> => {
  if (typeof dateString === 'string') {
    return new Date(dateString);
  } else {
    return dateString as Exclude<T, string>;
  }
};
