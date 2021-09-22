import { ExtensibilityModeEnum } from 'owa-addins-types';
import { resetNavigationStateAction } from 'owa-addins-apis/lib/utils/closeTaskPaneAddinCommandByControlId';
import { orchestrator } from 'satcheljs';

export interface NavigationState {
    hostItemIndex: string;
    mode: ExtensibilityModeEnum;
}

let navigationState: NavigationState = getInitialNavigationState();

export function getNavigationState(): NavigationState {
    return navigationState;
}

export function setNavigationState(state: NavigationState) {
    navigationState = state;
}

export function resetNavigationState() {
    navigationState = getInitialNavigationState();
}

orchestrator(resetNavigationStateAction, resetNavigationState);

function getInitialNavigationState(): NavigationState {
    return {
        hostItemIndex: null,
        mode: ExtensibilityModeEnum.Unknown,
    };
}
