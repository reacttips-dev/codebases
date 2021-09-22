import { IRootScopeService } from "angular";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import {
    ISecondaryBarContext,
    SecondaryBarContext,
} from "components/SecondaryBar/Utils/SecondaryBarContext";
import React, { FC, useContext, useMemo } from "react";
import { CompanyResearchSection } from "./NavBarSections/CompanyResearchSection";
import ExploreModulesItem from "components/SecondaryBar/Components/ExploreModulesItem";
import { IndustryResearchSection } from "./NavBarSections/IndustryResearchSection";
import { CompetitiveTrackingSection } from "./NavBarSections/CompetitiveTracking/CompetitiveTrackingSection";

export const MarketResearchSecBarBody: FC = () => {
    const { currentPage, params } = useContext<ISecondaryBarContext>(SecondaryBarContext);

    const services = useMemo(() => {
        return {
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            rootScope: Injector.get<IRootScopeService>("$rootScope"),
        };
    }, []);

    return (
        <>
            <CompetitiveTrackingSection
                currentPage={currentPage}
                params={params}
                navigator={services.swNavigator}
            />
            <IndustryResearchSection
                currentPage={currentPage}
                navigator={services.swNavigator}
                rootScope={services.rootScope}
            />
            <CompanyResearchSection
                currentPage={currentPage}
                navigator={services.swNavigator}
                rootScope={services.rootScope}
            />
            <ExploreModulesItem />
        </>
    );
};
