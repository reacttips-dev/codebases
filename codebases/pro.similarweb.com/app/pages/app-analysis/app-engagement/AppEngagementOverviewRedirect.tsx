import React from "react";
import { useSelector } from "react-redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { AppEngagementOverviewContainer } from "pages/app-analysis/app-engagement/AppEngagementOverviewContainer";
import { chosenItems } from "common/services/chosenItems";

export const AppEngagementOverviewRedirect = (props) => {
    const services = React.useMemo(
        () => ({
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
        }),
        [],
    );

    const params = useSelector((state) => {
        const {
            routing: { params },
        } = state;
        return params;
    });

    if (chosenItems[0].AppStore !== "Google" && params.country !== "840") {
        // fix #SIM-30202: engagement overview available only to US for IOS apps.
        services.swNavigator.updateParams({ country: 840 }, { location: "replace" });
        return null;
    }

    return <AppEngagementOverviewContainer {...props} />;
};

SWReactRootComponent(AppEngagementOverviewRedirect, "AppEngagementOverviewRedirect");
