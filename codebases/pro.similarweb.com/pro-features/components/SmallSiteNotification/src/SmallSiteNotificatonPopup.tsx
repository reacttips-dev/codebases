import React, { FunctionComponent, useEffect, useRef } from "react";

import noop from "lodash/noop";

import { PopupClickContainer } from "@similarweb/ui-components/dist/popup-click-container";
import { SmallSiteNotification } from "./SmallSiteNotification";

interface ISmallSiteNotificationPopupProps {
    site: string;
    isOpen: boolean;
    onContinueClick: () => void;
    onEnterClick: () => void;
    trackPopup?: () => void;
}

const SmallSiteNotificationPopup: FunctionComponent<ISmallSiteNotificationPopupProps> = ({
    site,
    onContinueClick,
    onEnterClick,
    isOpen,
    trackPopup,
    children,
}) => {
    const popupRef = useRef<PopupClickContainer>();
    useEffect(() => {
        if (isOpen) {
            popupRef.current.openPopup();
            trackPopup();
        } else {
            popupRef.current.closePopup();
        }
    }, [isOpen]);

    const content = () => (
        <SmallSiteNotification
            site={site}
            onContinueClick={onContinueClick}
            onEnterClick={onEnterClick}
        />
    );

    const config = {
        enabled: false,
        placement: "bottom",
        onClickOut: noop,
    };

    return (
        <PopupClickContainer content={content} config={config} ref={popupRef}>
            {children}
        </PopupClickContainer>
    );
};

export default SmallSiteNotificationPopup;
