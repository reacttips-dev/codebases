import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { i18nFilter } from "filters/ngFilters";
import React, { FC, useCallback, useMemo } from "react";
import { NavBarDefaultHeader } from "@similarweb/ui-components/dist/navigation-bar";

export const InsightsNavBarHeader: FC<any> = (props) => {
    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
            navigator: Injector.get<SwNavigator>("swNavigator"),
        };
    }, []);

    const handleClick = useCallback(() => {
        services.navigator.go("insights-home");
    }, [services]);

    return (
        <NavBarDefaultHeader
            text={services.translate("insights.navbar.header")}
            onClick={handleClick}
        />
    );
};
