import { coachmarksStore, contextualSupportStore, contextualSupportHistory, gettingStartedStore } from 'store';
import createContextualSupportApi from 'api/contextualSupport';
import createSetupMethod from 'api/setup';

export * from 'bundles/coachmarks';
export * from 'bundles/gettingStarted';
export * from 'bundles/contextualSupport';

export const { Sidebar, suggestArticles } = createContextualSupportApi(contextualSupportStore, contextualSupportHistory);
export const setup = createSetupMethod([coachmarksStore, contextualSupportStore, gettingStartedStore]);
