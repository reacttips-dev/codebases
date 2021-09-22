import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { lazyUpdateUserConfigurationService } from 'owa-session-store/lib/lazyFunctions';
import { DefaultSettingPont } from '../constants';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import {
    getIsBitSet,
    setBit,
    ListViewBitFlagsMasks,
} from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';

export default function saveDefaultSettings() {
    const config = getUserConfiguration();

    if (config.UserOptions) {
        lazyUpdateUserConfigurationService
            .importAndExecute([
                {
                    key: 'GlobalReadingPanePositionReact',
                    valuetype: 'Integer32',
                    value: [`${config.UserOptions.GlobalReadingPanePositionReact}`],
                },
                {
                    key: 'ConversationSortOrderReact',
                    valuetype: 'Integer32',
                    value: [`${getConversationSortOrderValue(config)}`],
                },
                {
                    key: 'GlobalListViewTypeReact',
                    valuetype: 'Integer32',
                    value: [`${config.UserOptions.GlobalListViewTypeReact}`],
                },
                {
                    key: 'NewEnabledPonts',
                    valuetype: 'Integer32',
                    value: [
                        `${
                            config.UserOptions.NewEnabledPonts &&
                            config.UserOptions.NewEnabledPonts & ~DefaultSettingPont
                        }`,
                    ],
                },
            ])
            .then(response => {
                // If successfully initialized settings and the user is commercial and it's their first time in React (IsCommercialUserInitialized is false), set IsCommercialUserInitialized
                // bit to true so next time we use their React settings since they've already been initialized with the right values
                if (
                    response.Body.ResponseMessages?.Items?.[0].ResponseClass === 'Success' &&
                    !isConsumer() &&
                    !getIsBitSet(ListViewBitFlagsMasks.IsCommercialUserInitialized)
                ) {
                    setBit(
                        true /* IsCommercialUserInitialized */,
                        ListViewBitFlagsMasks.IsCommercialUserInitialized
                    );

                    lazyUpdateUserConfigurationService.importAndExecute(
                        [
                            {
                                key: 'ListViewBitFlags',
                                valuetype: 'Integer32',
                                value: [
                                    `${
                                        getUserConfiguration().ViewStateConfiguration
                                            ?.ListViewBitFlags
                                    }`,
                                ],
                            },
                        ],
                        'OWA.ViewStateConfiguration'
                    );
                }
            });
    }
}

function getConversationSortOrderValue(config: any) {
    let conversationSortOrderValue;
    switch (config.UserOptions.ConversationSortOrderReact) {
        case 'Chronological':
            conversationSortOrderValue = 0x1;
            break;
        case 'Tree':
            conversationSortOrderValue = 0x2;
            break;
        case 'NewestOnTop':
            conversationSortOrderValue = 0x4;
            break;
        case 'NewestOnBottom':
            conversationSortOrderValue = 0x8;
            break;
        case 'ChronologicalNewestOnTop':
            conversationSortOrderValue = 0x5;
            break;
        case 'ChronologicalNewestOnBottom':
            conversationSortOrderValue = 0x9;
            break;
        case 'TreeNewestOnBottom':
            conversationSortOrderValue = 0xa;
            break;
    }

    return conversationSortOrderValue;
}
