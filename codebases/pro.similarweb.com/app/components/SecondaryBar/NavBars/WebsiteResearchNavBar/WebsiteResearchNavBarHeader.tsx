import { NavBarDefaultHeader } from "@similarweb/ui-components/dist/navigation-bar";
import React, { useCallback, useMemo } from "react";
import { i18nFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";

export const WebsiteResearchNavBarHeader = () => {
    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
            navigator: Injector.get<SwNavigator>("swNavigator"),
        };
    }, []);

    const handleClick = useCallback(() => {
        services.navigator.go("websites_root-home");
    }, [services]);

    return (
        <NavBarDefaultHeader
            text={services.translate("website.research.nav.header")}
            onClick={handleClick}
        />
    );
};
