'use es6';
/**
 * DEPRECATED
 * ----------
 * These constants should no longer be used directly. Instead use the functions
 * defined in `crm_data/flux/LoadingStatus`.
 */

/**
 * An empty value that was loaded from the server is represented by `null`.
 */

export var EMPTY = null;
/**
 * An value that has not yet loaded from the server is represented
 * by `undefined`.
 *
 * By using `undefined`, abstractions like `ComponentWithLoadingState` can
 * systematically determine the loading state of a component.
 */

export var LOADING = undefined;