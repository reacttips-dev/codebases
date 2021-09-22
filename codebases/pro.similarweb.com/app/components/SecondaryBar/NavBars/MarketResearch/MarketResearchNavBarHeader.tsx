import { NavBarDefaultHeader } from "@similarweb/ui-components/dist/navigation-bar";
import React, { useCallback, useMemo } from "react";
import { i18nFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

export const MarketResearchBarHeader = () => {
    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
            navigator: Injector.get<SwNavigator>("swNavigator"),
        };
    }, []);

    const handleClick = useCallback(() => {
        services.navigator.go("marketresearch-home");
    }, [services]);

    return (
        <NavBarDefaultHeader
            text={services.translate("marketintelligence.navbar.header")}
            onClick={handleClick}
        />
    );
};
