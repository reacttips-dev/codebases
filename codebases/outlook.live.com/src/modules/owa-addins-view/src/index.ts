export { default as onItemNavigation } from './utils/navigations/OnItemNavigation';
export { SelectionType } from './utils/navigations/SelectionType';
export { default as closeNonPersistentTaskPaneAddinCommand } from './utils/entryPointOperations/closeNonPersistentTaskPaneAddinCommand';
export { default as openNonPersistentTaskPaneAddinCommand } from './utils/entryPointOperations/openNonPersistentTaskPaneAddinCommand';
export {
    lazyInitializeExtensibilityFrameworkComponent,
    removeExtensibilityFrameworkComponent,
} from './components/ExtensibilityFrameworkComponent';

export { default as createAddinOptionSurfaceItems } from './utils/createAddinOptionSurfaceItems';

export { default as launchAutoRunAddins } from './utils/entryPointOperations/launchAutoRunAddins';
export type { AddinCommandSurfaceItem } from 'owa-addins-types';
export type { AddinBarViewProps } from './components/AddinBarView';
