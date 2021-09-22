import { createLazyComponent, LazyModule, LazyAction, LazyImport } from 'owa-bundling';

export { Team1 } from './services/UserVoiceFeedbackTags';
export type {
    UserVoiceFeedbackTags,
    UserVoiceFeedbackTxpTags,
} from './services/UserVoiceFeedbackTags';
export type { SuggestionDialogOptions } from './actions/showUserVoiceSuggestionDialog';
export { FeedbackMaxCharsAllowed } from './utils/UserVoiceConstantsForExport';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "UserVoice" */ './lazyIndex'));

export let lazyLaunchInAppFeedback = new LazyAction(lazyModule, m => m.launchInAppFeedback);
export let lazyPostSuggestionAndSendLogDatapoint = new LazyImport(
    lazyModule,
    m => m.postSuggestionAndSendLogDatapoint
);
export let lazyShowUserVoiceSuggestionDialog = new LazyImport(
    lazyModule,
    m => m.showUserVoiceSuggestionDialog
);
export let UserVoiceNps = createLazyComponent(lazyModule, m => m.UserVoiceNps);
export let UserVoiceIdeasPane = createLazyComponent(lazyModule, m => m.UserVoiceIdeasPane);

export let lazyUserVoiceSuggestionStore = new LazyImport(
    lazyModule,
    m => m.userVoiceSuggestionStore
);
