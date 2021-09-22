import { subscribe } from 'graphql';
import type { Resolvers } from 'owa-graph-schema';
import type { Operation } from '@apollo/client';
import { getOperationArgs } from './getOperationArgs';

export default async function subscribeGql(
    resolvers: Resolvers,
    operation: Operation,
    globalContext: any
) {
    const args = await getOperationArgs(resolvers, operation, globalContext);
    return subscribe(args);
}
