import type { NavigationStack } from '../schema/NavigationStack';

export function createNavigationStack<T>(...initialValues: T[]): NavigationStack<T> {
    return {
        stack: initialValues ? initialValues : [],
    };
}
