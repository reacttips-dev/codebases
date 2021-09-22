/* eslint-disable import/prefer-default-export */

import EnumValue from 'bundles/ondemand/models/EnumValue';

type EnumMap = Record<string, EnumValue>;

export const createEnumMap = (
  ...enumValues: EnumValue[]
): {
  map: EnumMap;
  get: (key: string) => EnumValue;
} => {
  const map = enumValues.reduce<EnumMap>((acc, enumValue) => {
    acc[enumValue.value] = enumValue;
    return acc;
  }, {});

  return {
    map,
    get(key: string) {
      return map[key] || new EnumValue(key, key);
    },
  };
};
