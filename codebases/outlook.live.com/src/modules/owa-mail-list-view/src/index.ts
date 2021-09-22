import {
    createLazyComponent,
    LazyModule,
    LazyAction,
    LazyImport,
    registerLazyOrchestrator,
} from 'owa-bundling';
import renderMeetingPreviewPlaceHolder from './components/MailListItemMeetingPreviewPlaceholder';
import { onSelectFolderComplete } from 'owa-mail-shared-actions/lib/onSelectFolderComplete';
import './mutators/updateLastIndexToRenderMutator';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailListItemLazy"*/ './lazyIndex')
);

// Delayed Loaded Components
export const MailListItemExpansion = createLazyComponent(lazyModule, m => m.MailListItemExpansion);
export const MailListItemDismissButton = createLazyComponent(
    lazyModule,
    m => m.MailListItemDismissButton
);
export const FolderTag = createLazyComponent(lazyModule, m => m.FolderTag);
export const MailListItemMeetingPreview = createLazyComponent(
    lazyModule,
    m => m.MailListItemMeetingPreview,
    () => renderMeetingPreviewPlaceHolder()
);
export const MailListItemMeetingInfo = createLazyComponent(
    lazyModule,
    m => m.MailListItemMeetingInfo
);
export const MailListItemTxpInfo = createLazyComponent(lazyModule, m => m.MailListItemTxpInfo);
export const MailPersonaSearchResultsHeader = createLazyComponent(
    lazyModule,
    m => m.MailPersonaSearchResultsHeader
);
export const SpotlightFre = createLazyComponent(lazyModule, m => m.SpotlightFre);

export const lazyGetFlagContextMenu = new LazyAction(lazyModule, m => m.getFlagContextMenu);

export const lazyInitializeThirdRow = new LazyImport(lazyModule, m => m.initializeThirdRow);
registerLazyOrchestrator(
    onSelectFolderComplete,
    lazyModule,
    m => m.scrollToTopOfListViewOrchestrator
);
