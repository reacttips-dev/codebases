import { SWReactIcons } from "@similarweb/icons";
import * as classNames from "classnames";
import I18n from "components/React/Filters/I18n";
import * as React from "react";
import { allTrackers } from "services/track/track";
import styled from "styled-components";
import { getModal } from "../../../../.pro-features/components/Modals/src/UnlockModal/mapModuleToConfig";
import { StyledPill } from "../../../../.pro-features/styled components/StyledPill/src/StyledPill";
import { openUnlockModal } from "../../../../app/services/ModalService";

const ItemIcon: any = styled(SWReactIcons)`
    display: flex;
    width: 32px;
    height: 32px;
`;
const GreenPill = styled(StyledPill)`
    background-color: #4fc3a0;
    margin-left: 5px;
`;
const OrangePill = styled(StyledPill)`
    background-color: #f58512;
    margin-left: 5px;
`;

interface ITopNavSubPopupContentProps {
    /**
     * ClosePopup function gets injected into the TopNavSubPopupContent component
     * via the PopupHoverContainer component. upon rendering this component as a popup's
     * content, the popup automatically renders it with closePopup as a property.
     */
    closePopup?: () => void;
    items: any[];
}

function onSubMenuItemClick(menuItem, subMenuItem, closePopup) {
    allTrackers.trackEvent("Topbar", "click", `${menuItem.trackName}/${subMenuItem}`);
    if (menuItem.isDisabled) {
        const modal = getModal(menuItem.modules[0]);
        openUnlockModal({ modal });
    } else {
        if (menuItem.openInNewWindow) {
            (window as Window).open(menuItem.link);
        } else {
            (window as Window).location.href = menuItem.link;
        }
    }
    if (typeof closePopup === "function") {
        closePopup();
    }
}

const TopNavSubPopupContent: React.StatelessComponent<ITopNavSubPopupContentProps> = ({
    items,
    closePopup,
}) => {
    let _links = [];
    items.forEach((item, index) => {
        let _containerClasses = classNames("itemLinkContainer", {
            selected: item.selected,
            active: !item.isDisabled,
        });
        let _beta = item.beta ? <GreenPill>BETA</GreenPill> : "";
        let _new = item.new ? <OrangePill>NEW</OrangePill> : "";
        _links.push(
            <a
                key={index}
                className={_containerClasses}
                onClick={() => onSubMenuItemClick(item, item.icon, closePopup)}
            >
                <div className="iconContainer">
                    <ItemIcon iconName={item.icon} />
                </div>
                <div className="textContainer">
                    <div className="titleContainer">
                        <I18n>{item.title}</I18n>
                        {_new}
                        {_beta}
                    </div>
                    <div className="descriptionContainer">
                        <I18n>{item.description}</I18n>
                    </div>
                </div>
            </a>,
        );
    });
    return <div className={"TopNavSubPopupContent"}>{_links}</div>;
};
export default TopNavSubPopupContent;
