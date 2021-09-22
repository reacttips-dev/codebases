export function getTopOfStack<T>(stack: T[]): T {
    if (stack.length === 0) {
        return null;
    }
    return stack[stack.length - 1];
}

export function push<T>(item: T, stack: T[]): void {
    stack.push(item);
}

export function updateTop<T>(item: T, stack: T[]): void {
    if (stack.length === 0) {
        return null;
    }
    stack[stack.length - 1] = item;
}

export function pop<T>(stack: T[]): T {
    return stack.pop();
}
