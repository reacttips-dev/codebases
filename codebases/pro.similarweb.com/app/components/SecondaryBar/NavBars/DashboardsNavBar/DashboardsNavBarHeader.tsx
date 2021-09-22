import { NavBarHeaderWithButton } from "@similarweb/ui-components/dist/navigation-bar";
import React, { FC, useCallback, useMemo } from "react";
import { i18nFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { connect } from "react-redux";
import { SwTrack } from "services/SwTrack";

interface IDashboardsNavBarHeaderProps {
    /**
     * Current page. injected via redux routing store
     */
    currentPage: string;
}

const DashboardsNavBarHeader: FC<IDashboardsNavBarHeaderProps> = (props) => {
    const { currentPage } = props;

    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
            swNavigator: Injector.get<any>("swNavigator"),
            swSettings,
        };
    }, []);

    const handleClick = useCallback(() => {
        services.swNavigator.go("dashboard");
    }, [services]);

    const handleButtonClick = useCallback(() => {
        SwTrack.all.trackEvent("Dashboards", "click", "Side Bar/Add a New Dashboard");
        services.swNavigator.go("dashboard-gallery");
    }, [services]);

    const isButtonDisabled = useMemo(() => {
        return (
            services.swNavigator.current().disableNewDashboardButton ||
            services.swSettings.components.Dashboard.resources.IsReadonly
        );
    }, [services, currentPage]);

    return (
        <NavBarHeaderWithButton
            text={services.translate("sidenav.dashboard.title")}
            onClick={handleClick}
            buttonText={services.translate("sidenav.dashboard.addnew")}
            buttonIcon={{
                iconName: "add",
                iconSize: "xs",
            }}
            onButtonClick={handleButtonClick}
            isButtonDisabled={isButtonDisabled}
        />
    );
};

const mapStateToProps = (state) => {
    const { currentPage } = state.routing;
    return { currentPage };
};

const connected = connect(mapStateToProps)(DashboardsNavBarHeader);
export default connected;
