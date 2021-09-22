import React from "react";
import { openUnlockModal } from "services/ModalService";
import LocationService from "components/Modals/src/UnlockModal/LocationService";

/**
 * @param modal
 * @param slide
 * @param path - relative to the current location
 */
const useUnlockModal = (modal: string, slide: string, path?: string): (() => void) => {
    const currentLocation = LocationService.getCurrentLocation();
    const location = currentLocation + path ? `/${path}` : "";

    return React.useCallback(() => {
        openUnlockModal(
            {
                modal,
                slide,
            },
            location,
        );
    }, [modal, slide, location]);
};

export default useUnlockModal;
