import { IRootScopeService } from "angular";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import {
    ISecondaryBarContext,
    SecondaryBarContext,
} from "components/SecondaryBar/Utils/SecondaryBarContext";
import React, { FC, useCallback, useContext, useMemo } from "react";

// Sections
import { WebsiteAnalysisSection } from "components/SecondaryBar/NavBars/WebsiteResearchNavBar/NavBarSections/WebsiteAnalysis/WebsiteAnalysisSection";
import { IndustryAnalysisSection } from "./NavBarSections/IndustryAnalysis/IndustryAnalysisSection";
import { SegmentsAnalysisSection } from "./NavBarSections/SegmentAnalysis/SegmentAnalysisSection";
import { KeywordAnalysisSection } from "./NavBarSections/KeywordAnalysis/KeywordAnalysisSection";

export const WebsiteResearchSecBarBody: FC = () => {
    const {
        params,
        currentModule,
        currentPage,
        toggleSecondaryBar,
        setSecondaryBarType,
    } = useContext<ISecondaryBarContext>(SecondaryBarContext);

    const services = useMemo(() => {
        return {
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            rootScope: Injector.get<IRootScopeService>("$rootScope"),
        };
    }, []);

    const handleSectionClick = useCallback((id: string, params?: any) => {
        services.swNavigator.go(id, params);
    }, []);

    return (
        <>
            <WebsiteAnalysisSection
                currentPage={currentPage}
                currentModule={currentModule}
                navigator={services.swNavigator}
                rootScope={services.rootScope}
                onSectionClick={handleSectionClick}
                toggleSecondaryBar={toggleSecondaryBar}
            />
            <SegmentsAnalysisSection
                currentPage={currentPage}
                currentModule={currentModule}
                navigator={services.swNavigator}
                rootScope={services.rootScope}
                onSectionClick={handleSectionClick}
                toggleSecondaryBar={toggleSecondaryBar}
            />
            <IndustryAnalysisSection
                params={params}
                currentPage={currentPage}
                currentModule={currentModule}
                navigator={services.swNavigator}
                rootScope={services.rootScope}
                onSectionClick={handleSectionClick}
                toggleSecondaryBar={toggleSecondaryBar}
            />
            <KeywordAnalysisSection
                currentPage={currentPage}
                currentModule={currentModule}
                navigator={services.swNavigator}
                rootScope={services.rootScope}
                onSectionClick={handleSectionClick}
                toggleSecondaryBar={toggleSecondaryBar}
            />
        </>
    );
};
