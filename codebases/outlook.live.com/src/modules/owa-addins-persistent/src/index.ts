export { default as getPersistedAddin } from './getPersistedAddin';
export { default as setPersistedAddin } from './setPersistedAddin';
export { default as addinSupportsPersistence } from './addinSupportsPersistence';
export {
    default as populatePersistedAddins,
    isPersistedAddinsInitialized,
} from './populatePersistedAddins';
export { default as createPersistedAddin } from './createPersistedAddin';
export { default as removeUninstalledPersistedAddins } from './removeUninstalledPersistedAddins';
export { default as isPersistedAddin } from './utils/isPersistedAddin';

export type { default as PersistedAddinCommand } from './schema/PersistedAddinCommand';
