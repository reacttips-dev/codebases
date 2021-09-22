import { makeExecutableSchema } from '@graphql-tools/schema/es5';
import { Resolvers, loadTypes } from 'owa-graph-schema';
import type { Operation } from '@apollo/client';

let resolversSchemaMap = new Map();
let types: string | null = null;

export async function getOperationArgs(
    resolvers: Resolvers,
    operation: Operation,
    globalContext: any
) {
    let schema = resolversSchemaMap.get(resolvers);

    if (!schema || !types) {
        types = await loadTypes();

        schema = makeExecutableSchema({
            typeDefs: types,
            resolvers: resolvers as any,
        });

        resolversSchemaMap.set(resolvers, schema);
    }

    const { query, variables } = operation;
    const mergedContext = {
        ...globalContext,
        ...operation.getContext(),
    };

    operation.setContext(() => mergedContext);

    return {
        schema: schema,
        document: query,
        variableValues: variables,
        contextValue: mergedContext,
    };
}

export function resetStateForTests(typesForTest) {
    resolversSchemaMap.clear();
    types = typesForTest;
}
