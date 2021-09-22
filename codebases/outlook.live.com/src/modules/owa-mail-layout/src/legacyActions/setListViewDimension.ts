import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { updateUserConfigurationAndService } from 'owa-session-store/lib/utils/updateUserConfigurationAndService';
import {
    MAX_LIST_VIEW_WIDTH,
    MIN_LIST_VIEW_WIDTH,
    MAX_LIST_VIEW_HEIGHT,
    MIN_LIST_VIEW_HEIGHT,
} from '../internalConstants';
import { getListViewMaxWidth } from '../utils/getMaxWidths';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function setListViewDimension(listViewDimension: number, isWidth: boolean) {
    // We limit the list view dimension between min and max dimensions allowed
    let listViewDimensionToStore = listViewDimension;
    const maxDimension = isWidth ? getListViewMaxWidthDimensions() : MAX_LIST_VIEW_HEIGHT;
    const minDimension = isWidth ? MIN_LIST_VIEW_WIDTH : MIN_LIST_VIEW_HEIGHT;
    if (listViewDimension > maxDimension) {
        listViewDimensionToStore = maxDimension;
    } else if (listViewDimension < minDimension) {
        listViewDimensionToStore = minDimension;
    }

    const globalFolderViewState: any = JSON.parse(
        getUserConfiguration().ViewStateConfiguration?.GlobalFolderViewState || '{}'
    );

    if (isWidth) {
        globalFolderViewState.Width = listViewDimensionToStore;
    } else {
        globalFolderViewState.Height = listViewDimensionToStore;
    }

    const newValue = JSON.stringify(globalFolderViewState);
    updateUserConfigurationAndService(
        config => {
            if (config.ViewStateConfiguration) {
                config.ViewStateConfiguration.GlobalFolderViewState = newValue;
            }
        },
        [
            {
                key: 'GlobalFolderViewState',
                valuetype: 'String',
                value: [newValue],
            },
        ],
        'OWA.ViewStateConfiguration'
    );
}

function getListViewMaxWidthDimensions() {
    if (isFeatureEnabled('mon-tri-slvWithRightReadingPane')) {
        return getListViewMaxWidth();
    }

    return MAX_LIST_VIEW_WIDTH;
}
