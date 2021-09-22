import { execute } from 'graphql';
import type { Resolvers } from 'owa-graph-schema';
import type { Operation } from '@apollo/client';
import { getOperationArgs } from './getOperationArgs';

export default async function executeGql(
    resolvers: Resolvers,
    operation: Operation,
    globalContext: any
) {
    const args = await getOperationArgs(resolvers, operation, globalContext);
    const result = await execute(args);
    operation.setContext(args.contextValue);
    return result;
}
