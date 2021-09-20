import { FieldReadFunction } from '@apollo/client';

// Constructs the read function that will return provided default value in case of cache miss
export const readWithDefault = <T>(defaultValue: T): FieldReadFunction<T> => {
  return (existing) => (existing !== undefined ? existing : defaultValue);
};
