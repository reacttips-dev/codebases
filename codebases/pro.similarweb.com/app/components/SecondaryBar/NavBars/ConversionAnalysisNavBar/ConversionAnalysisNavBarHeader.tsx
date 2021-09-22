import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { i18nFilter } from "filters/ngFilters";
import React, { FC, useCallback, useMemo } from "react";
import { NavBarDefaultHeader } from "@similarweb/ui-components/dist/navigation-bar";

export const ConversionAnalysisNavBarHeader: FC<any> = () => {
    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
            navigator: Injector.get<SwNavigator>("swNavigator"),
        };
    }, []);

    const handleClick = () => {
        services.navigator.go("conversion-homepage");
    };

    return (
        <NavBarDefaultHeader
            text={services.translate("conversion.sidenav.title")}
            onClick={handleClick}
        />
    );
};
