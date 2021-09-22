import type Subtodo from '../schema/Subtodo';
import { getGuid } from 'owa-guid';

export function createSubtodo(partialSubtodo: Partial<Subtodo>): Subtodo {
    partialSubtodo = partialSubtodo !== null ? partialSubtodo : {};

    return {
        ...partialSubtodo,
        CompletedDateTime: partialSubtodo.CompletedDateTime
            ? partialSubtodo.CompletedDateTime
            : null,
        Id: partialSubtodo.Id ? partialSubtodo.Id : getGuid(),
        IsCompleted: partialSubtodo.IsCompleted ? partialSubtodo.IsCompleted : false,
        OrderDateTime: partialSubtodo.OrderDateTime ? partialSubtodo.OrderDateTime : null,
        Subject: partialSubtodo.Subject ? partialSubtodo.Subject : null,
    };
}
