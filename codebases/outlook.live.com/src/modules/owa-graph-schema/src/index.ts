/** DO NOT EXPORT ANY OTHER TYPES **/
export * from './__generated__/schema.all.interface';
export * from './defaultConfigurationConstant';
export * from './types/partialTypes';
export type { ResolverContext } from './types/resolverContext';
export type { GraphQLResolveInfo } from './types/graphQLResolveInfo';
export type { LocalStateResolverCallbacks } from './types/LocalStateResolverCallbacks';
export type { LocalStateMutationFn } from './types/LocalStateMutationFn';
export type { LocalStateEventContext } from './types/LocalStateEventContext';
export type { SessionDataWithGraphQL } from './types/SessionDataWithGraphQL';

export { loadTypes } from './schema/loadTypes';

type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

export function partialCast<T>(p: DeepPartial<T>): T {
    return p as T;
}
