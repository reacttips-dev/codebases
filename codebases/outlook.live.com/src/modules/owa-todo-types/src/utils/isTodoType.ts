import type { Todo } from '../index';

export function isTodoType(todo: any): todo is Todo {
    return todo?.__type === 'Todo';
}
