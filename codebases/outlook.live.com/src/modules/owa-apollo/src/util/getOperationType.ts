import type { Operation } from '@apollo/client';
import { getOperationAST } from 'graphql';

export function getOperationType(operation: Operation) {
    const { operation: operationType } = getOperationAST(operation.query, null)!;
    return operationType;
}
