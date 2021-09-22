import React, { FC, useCallback } from "react";
import { NavBarHomepageToggle } from "@similarweb/ui-components/dist/navigation-bar/src/NavBarItems/NavBarHomepageItem/NavBarHomepageToggle";
import { swSettings } from "common/services/swSettings";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { openUnlockModalV2 } from "services/ModalService";

export interface ISecondaryBarSectionItemProps {
    featureKey?: string;
    children?: string;
}

const ExploreModulesItem: FC<ISecondaryBarSectionItemProps> = ({
    featureKey = "NT_SearchBM",
    children,
}) => {
    const openHook = useCallback(() => openUnlockModalV2(featureKey), [featureKey]);

    const translate = useTranslation();

    const isNoTouch = !!swSettings.components.Home.resources.IsNoTouchUser;
    const shouldShow =
        swSettings.components?.AvailableBusinessModules?.resources?.MIBusinessModules === "Hook";

    return (
        isNoTouch &&
        shouldShow && (
            <NavBarHomepageToggle
                isSelected={false}
                isOpened={false}
                isLocked={true}
                text={children || translate("explore_more_modules")}
                onClick={openHook}
            />
        )
    );
};

export default ExploreModulesItem;
