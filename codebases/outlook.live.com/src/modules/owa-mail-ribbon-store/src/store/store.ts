import { createStore } from 'satcheljs';
import { LabelPreferenceId } from '../util/labelPreferencesIds';
import { RibbonId } from '../util/ribbonId';
import type { MailRibbonConfigStore } from './schema/mailRibbonConfigStore';

export const intialEmptyRibbonConfig: MailRibbonConfigStore = {
    homeTab: {
        layout: [],
        controlsInOverflow: [],
        staticGroupIdOrdering: [],
        removedDefaultGroups: [],
        showLabelsPreference: LabelPreferenceId.ShowAsSpacePermits,
    },
    viewTab: {
        layout: [],
        controlsInOverflow: [],
        staticGroupIdOrdering: [],
        removedDefaultGroups: [],
        showLabelsPreference: LabelPreferenceId.ShowAsSpacePermits,
    },
    messageTab: {
        layout: [],
        controlsInOverflow: [],
        staticGroupIdOrdering: [],
        removedDefaultGroups: [],
        showLabelsPreference: LabelPreferenceId.ShowAsSpacePermits,
    },
    selectedTab: RibbonId.Tab_Home,
};
export const getStore = createStore<MailRibbonConfigStore>(
    'MailRibbonConfiguration',
    intialEmptyRibbonConfig
);

export default getStore();
