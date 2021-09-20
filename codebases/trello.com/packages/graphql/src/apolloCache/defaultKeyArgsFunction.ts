import { KeyArgsFunction } from '@apollo/client/cache/inmemory/policies';

// We have to use it if both read and merge function are defined on the field
// Otherwise Apollo replaces it with `keyArgs: false`
// https://github.com/apollographql/apollo-client/blob/2553695750f62657542792e22d0abe9b50a7dab2/src/cache/inmemory/policies.ts#L462
export const defaultKeyArgsFunction: KeyArgsFunction = (args, context) =>
  args ? Object.keys(args) : context.fieldName;
