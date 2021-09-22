import * as constants from './constants';
import ClientTypeOptInState from 'owa-service/lib/contract/ClientTypeOptInState';
import type DefaultSetting from './DefaultSettings';
import getDefaultListViewType from './utils/getDefaultListViewType';
import { logUsage } from 'owa-analytics';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { getIsBitSet, ListViewBitFlagsMasks } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import ReadingPanePosition from 'owa-session-store/lib/store/schema/ReadingPanePosition';

export default function getDefaultSettings(): DefaultSetting | null {
    const userConfig = getUserConfiguration();
    const userOptions = userConfig.UserOptions;
    if (!userOptions) {
        return null;
    }

    if (
        (isConsumer() &&
            // User have opted-in previously
            (userOptions.ClientTypeOptInState === ClientTypeOptInState.React ||
                // This is not the first time in this experiment
                (userOptions.NewEnabledPonts &&
                    userOptions.NewEnabledPonts & constants.DefaultSettingPont) === 0)) ||
        getIsBitSet(ListViewBitFlagsMasks.IsCommercialUserInitialized)
    ) {
        return null; /* No default settings since we can use React settings from server */
    }

    logUsage('settingUpdate');

    // Otherwise, return settings from JSMVVM
    return {
        GlobalReadingPanePositionReact:
            userOptions.GlobalReadingPanePosition ||
            ReadingPanePosition.Off /* Whatever is in jsMVVM */,
        ConversationSortOrderReact:
            userOptions.ConversationSortOrder || 'Chronological' /* Whatever is in jsMVVM */,
        GlobalListViewTypeReact: getDefaultListViewType(userConfig) /* Whatever is in jsMVVM */,
    };
}
