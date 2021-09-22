import { UnlockModalConfigType } from "components/Modals/src/UnlockModal/unlockModalConfig";
import NgRedux from "ng-redux";
import { allTrackers } from "services/track/track";
import LocationService from "../../.pro-features/components/Modals/src/UnlockModal/LocationService";
import { Injector } from "../../scripts/common/ioc/Injector";
import { openContactUsModal as openContactUsModalAction } from "../actions/contactUsModalActions";
import {
    openHooksV2UnlockModal,
    openUnlockModal as openUnlockModalAction,
} from "../actions/unlockModalActions";
import {
    getWsConfigFromState,
    isHooksV2UnlockHook,
    HOOKS_V2_MODAL_ID,
} from "../pages/workspace/config/stateToWsConfigMap";

export function openStateUnlockModal(state, params?) {
    const { unlockHook } = getWsConfigFromState(state, params);
    const location = LocationService.getLocation(state, params);

    if (isHooksV2UnlockHook(unlockHook)) {
        openUnlockModalV2(unlockHook.slide);
    } else {
        openUnlockModal(unlockHook, location);
    }
}

export function openUnlockModal<T extends UnlockModalConfigType>(
    unlockHook: any,
    location = LocationService.getCurrentLocation(),
    trackClick = true,
) {
    if (unlockHook) {
        if (trackClick) {
            allTrackers.trackEvent("hook/Contact Us/Pop Up", "click", location);
        }

        const $ngRedux = Injector.get<NgRedux.INgRedux>("$ngRedux");
        $ngRedux.dispatch(
            openUnlockModalAction<UnlockModalConfigType>({ ...unlockHook, location }),
        );
    }
}

export type HookV2Type = "website" | "keywords" | "creatives" | "pages" | "";

export function openUnlockModalV2(featureKey: string, trackingSubName: HookV2Type = "") {
    const $ngRedux = Injector.get<NgRedux.INgRedux>("$ngRedux");
    $ngRedux.dispatch(
        openHooksV2UnlockModal({
            modal: HOOKS_V2_MODAL_ID,
            slide: featureKey,
            location: trackingSubName,
        }),
    );
}

export function openContactUsModal(label) {
    const $ngRedux = Injector.get<NgRedux.INgRedux>("$ngRedux");
    $ngRedux.dispatch(openContactUsModalAction(label));
}
