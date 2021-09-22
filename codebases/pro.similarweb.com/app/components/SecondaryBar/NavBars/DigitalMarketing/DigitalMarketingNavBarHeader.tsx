import { NavBarDefaultHeader } from "@similarweb/ui-components/dist/navigation-bar";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

export const DigitalMarketingNavBarHeader = () => {
    const translate = useTranslation();
    const navigator = useMemo(() => {
        return Injector.get<SwNavigator>("swNavigator");
    }, []);

    const handleClick = useCallback(() => {
        navigator.go("digitalmarketing-home");
    }, [navigator]);

    return (
        <NavBarDefaultHeader
            text={translate("aquisitionintelligence.navbar.header")}
            onClick={handleClick}
        />
    );
};
