import {
    getIsBitSet,
    ListViewBitFlagsMasks,
    setBit,
} from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import { getFallbackValueIfNull } from 'owa-options-core';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { lazyUpdateUserConfigurationService } from 'owa-session-store/lib/lazyFunctions';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { isReadingPaneSurfaceActionPinnedByUser } from 'owa-surface-actions';
import saveSurfaceActionsOption from '../actions/saveSurfaceActionsOption';
import selectSurfaceActionsOption from '../actions/selectSurfaceActionsOption';
import initializeHoverSurfaceAction from '../actions/initializeHoverSurfaceAction';
import getStore from '../store/store';
import {
    getOptionsForFeature,
    lazyLoadOptions,
    OwsOptionsFeatureType,
    SurfaceActionsOptions,
} from 'owa-outlook-service-options';

export default function pinLikeSurfaceAction() {
    initializeHoverSurfaceAction();
    lazyLoadOptions.importAndExecute().then(() => {
        if (
            !isConsumer() &&
            !getIsBitSet(ListViewBitFlagsMasks.LikeSurfaceActionFirstRun) &&
            !isReadingPaneSurfaceActionPinnedByUser('LikeUnlike')
        ) {
            const surfaceActions = getFallbackValueIfNull(
                getStore().readSurfaceActions,
                getOptionsForFeature<SurfaceActionsOptions>(OwsOptionsFeatureType.SurfaceActions)
                    .readSurfaceActions
            ).slice();

            selectSurfaceActionsOption('readSurfaceActions', surfaceActions, 'LikeUnlike', true);

            saveSurfaceActionsOption();

            setBit(true, ListViewBitFlagsMasks.LikeSurfaceActionFirstRun);

            lazyUpdateUserConfigurationService.importAndExecute(
                [
                    {
                        key: 'ListViewBitFlags',
                        valuetype: 'Integer32',
                        value: [
                            `${getUserConfiguration().ViewStateConfiguration.ListViewBitFlags}`,
                        ],
                    },
                ],
                'OWA.ViewStateConfiguration'
            );
        }
    });
}
