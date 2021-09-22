import { IRootScopeService } from "angular";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import {
    ISecondaryBarContext,
    SecondaryBarContext,
} from "components/SecondaryBar/Utils/SecondaryBarContext";
import React, { FC, useContext, useState, useRef, useEffect } from "react";
import { AdCreativeResearchSection } from "./NavBarSections/AdCreativeResearchSection";
import { AffiliateResearchSection } from "./NavBarSections/AffiliateResearchSection";
import { CompetitiveAnalysisSection } from "./NavBarSections/CompetitiveAnalysisSection";
import { KeywordResearchSection } from "./NavBarSections/KeywordResearchSection";
import { MediaBuyingResearchSection } from "./NavBarSections/MediaBuyingResearchSection";
import ExploreModulesItem from "components/SecondaryBar/Components/ExploreModulesItem";

export const DigitalMarketingNavBarBody: FC = () => {
    const { currentModule, currentPage, params } = useContext<ISecondaryBarContext>(
        SecondaryBarContext,
    );

    const [currentSection, setCurrentSection] = useState<string>(String());
    const [maxSectionHeight, setMaxSectionHeight] = useState<string>(String());
    const containersRef = useRef(undefined);

    const updateMaxHeight = () => {
        const { clientHeight: containersHeight, children } = containersRef.current;
        const { length: childrenAmount } = children;
        // convert the children from HTML collection to array
        const childrenArray = [...children];
        const sortedChildrenByHeight = childrenArray.sort(
            (childA, childB) => childA.clientHeight - childB.clientHeight,
        );
        const { clientHeight: shortestChildElementHeight } = sortedChildrenByHeight[0];
        // use the shortest child element's height since it's the height of a collapse menu item
        setMaxSectionHeight(`${containersHeight - childrenAmount * shortestChildElementHeight}px`);
    };

    useEffect(() => {
        updateMaxHeight();
        window.addEventListener("resize", updateMaxHeight, { capture: true });
        return () => window.removeEventListener("resize", updateMaxHeight, { capture: true });
    }, [currentSection]);

    const services = {
        swNavigator: Injector.get<SwNavigator>("swNavigator"),
        rootScope: Injector.get<IRootScopeService>("$rootScope"),
    };

    const handleSectionClick = (id: string, params?: any) => {
        setCurrentSection(id);
    };
    return (
        <div ref={containersRef} style={{ height: "100%" }}>
            <CompetitiveAnalysisSection
                params={params}
                currentPage={currentPage}
                currentModule={currentModule}
                navigator={services.swNavigator}
                rootScope={services.rootScope}
                onSectionClick={handleSectionClick}
                currentSection={currentSection}
                maxHeight={maxSectionHeight}
            />
            <KeywordResearchSection
                params={params}
                currentPage={currentPage}
                navigator={services.swNavigator}
                onSectionClick={handleSectionClick}
                currentSection={currentSection}
                maxHeight={maxSectionHeight}
            />
            <AffiliateResearchSection
                currentPage={currentPage}
                navigator={services.swNavigator}
                rootScope={services.rootScope}
                onSectionClick={handleSectionClick}
                currentSection={currentSection}
                maxHeight={maxSectionHeight}
            />
            <MediaBuyingResearchSection
                currentPage={currentPage}
                navigator={services.swNavigator}
                rootScope={services.rootScope}
                onSectionClick={handleSectionClick}
                currentSection={currentSection}
                maxHeight={maxSectionHeight}
            />
            <AdCreativeResearchSection
                currentPage={currentPage}
                navigator={services.swNavigator}
                rootScope={services.rootScope}
                onSectionClick={handleSectionClick}
                currentSection={currentSection}
                maxHeight={maxSectionHeight}
            />
            <ExploreModulesItem />
        </div>
    );
};
