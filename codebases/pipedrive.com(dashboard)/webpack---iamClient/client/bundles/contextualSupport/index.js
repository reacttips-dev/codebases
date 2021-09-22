import { contextualSupportStore, contextualSupportHistory } from 'store';
import createSidebarApi from 'api/contextualSupport';
import createSetupMethod from 'api/setup';

export const { Sidebar, suggestArticles } = createSidebarApi(contextualSupportStore, contextualSupportHistory);
export const setup = createSetupMethod([contextualSupportStore]);
