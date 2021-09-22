import React from "react";
import { ClickOutsideWrapper } from "custom-hooks/useClickOutside";
import { PopupTargetContainer } from "./styledComponents";

interface IPopupTarget {
    children: React.ReactNode;
    isOpen: boolean;
    renderPopup: Function;
    closeFn: Function;
}

export const PopupTarget: React.FC<IPopupTarget> = ({ children, isOpen, renderPopup, closeFn }) => (
    <PopupTargetContainer>
        {children}
        {isOpen ? (
            <ClickOutsideWrapper onClickOutside={closeFn}>{renderPopup()}</ClickOutsideWrapper>
        ) : null}
    </PopupTargetContainer>
);
