import { HOOKS_V2_MODAL_ID } from "pages/workspace/config/stateToWsConfigMap";
import {
    CLOSE_UNLOCK_FEATURE_MODAL,
    OPEN_UNLOCK_FEATURE_MODAL,
} from "../action_types/unlock_modal_action_types";
import {
    IUnlockModalConfigTypes,
    UnlockModalConfigType,
} from "../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";

type UnlockModalActiveSlide<T extends UnlockModalConfigType> = IUnlockModalConfigTypes[T];

export interface IUnlockModalActionPayload<T extends UnlockModalConfigType> {
    modal: T;
    slide?: UnlockModalActiveSlide<T>;
    location: string;
    isNoTouch?: boolean;
}

interface IHooksV2ActionPayload {
    modal: typeof HOOKS_V2_MODAL_ID;
    slide: string;
    location: string;
}

export function openUnlockModal<T extends UnlockModalConfigType>(
    unlockHook: IUnlockModalActionPayload<T>,
) {
    return {
        type: OPEN_UNLOCK_FEATURE_MODAL,
        payload: {
            unlockHook,
        },
    };
}

export function openHooksV2UnlockModal(unlockHook: IHooksV2ActionPayload) {
    return {
        type: OPEN_UNLOCK_FEATURE_MODAL,
        payload: { unlockHook },
    };
}

export function closeUnlockModal() {
    return {
        type: CLOSE_UNLOCK_FEATURE_MODAL,
    };
}
