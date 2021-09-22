import { IRootScopeService } from "angular";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import {
    ISecondaryBarContext,
    SecondaryBarContext,
} from "components/SecondaryBar/Utils/SecondaryBarContext";

import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Sections
import { AppAnalysisSection } from "./NavBarSections/AppAnalysisSection";
import { AppCategoryAnalysisSection } from "./NavBarSections/AppCategoryAnalysisSection";
import { GooglePlayKeywordsSection } from "./NavBarSections/GooglePlayKeywordsSection";

export const AppResearchSecBarBody: FC = () => {
    const { currentModule, currentPage } = useContext<ISecondaryBarContext>(SecondaryBarContext);

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
            <AppAnalysisSection
                currentPage={currentPage}
                currentModule={currentModule}
                navigator={services.swNavigator}
                rootScope={services.rootScope}
                onSectionClick={handleSectionClick}
            />
            <AppCategoryAnalysisSection
                currentPage={currentPage}
                currentModule={currentModule}
                navigator={services.swNavigator}
                rootScope={services.rootScope}
                onSectionClick={handleSectionClick}
            />
        </>
    );
};
