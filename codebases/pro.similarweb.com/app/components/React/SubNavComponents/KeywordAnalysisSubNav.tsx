import { default as React, FunctionComponent, useEffect, useState } from "react";
import { connect } from "react-redux";
import { SwNavigator } from "common/services/swNavigator";
import PageTitle from "components/React/PageTitle/PageTitle";
import { SubNav } from "components/sub-navigation-bar/SubNav";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { KeywordAnalysisFilters } from "pages/keyword-analysis/KeywordAnalysisFilters";
import { Injector } from "common/ioc/Injector";
import SubNavBackButton from "components/sub-navigation-bar/SubNavBackButton";
import { KeywordsQueryBar } from "components/compare/KeywordsQueryBar/KeywordsQueryBar";
import { adaptKeywordsQueryBarProps } from "components/compare/KeywordsQueryBar/KeywordsQueryBarHelper";
import useLocalStorage from "custom-hooks/useLocalStorage";
import {
    ProductTours,
    ProductToursLocalStorageKeys,
    showIntercomTour,
} from "services/IntercomProductTourService";
import { EducationContainer } from "components/educationbar/educationContainer";
import educationHook from "components/educationbar/educationHook";

interface IKeywordAnalysisSubNavProps {
    categories: any[];
    customCategories: any[];
    selectedCat: string;
    maxWidth: string;
    minWidth: string;
    trackName: string;
    trackContext: string;
    placeholderItem: object;
    removeItemTooltip: object;
    className: string;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onShare: (group) => void;
    hasKeywordsGroups: boolean;
    isKeywordMode?: boolean;
    hasKeywordsGroupsEnabled?: boolean;
    searchTerm?: string;
    isLoading?: boolean;
}

const IS_KEYWORD_GROUP = "*";

const KeywordAnalysisSubNav: FunctionComponent<IKeywordAnalysisSubNavProps> = (props) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");

    const { isLoading } = props;
    const homeState = swNavigator.current()?.homeState;
    const homeUrl = homeState ? swNavigator.href(homeState, null) : null;

    const [showEducationIcon, showEducationBar, setValues] = educationHook();

    const queryBarProps = adaptKeywordsQueryBarProps(props);
    queryBarProps.onSearchItemClick = (item) => {
        if (typeof item === "string") {
            swNavigator.go(
                swNavigator.current(),
                {
                    keyword: item,
                },
                { reload: true },
            );
        } else {
            swNavigator.go(
                swNavigator.current(),
                {
                    keyword: item.Id ? IS_KEYWORD_GROUP + item.Id : item.name,
                },
                { reload: true },
            );
        }
    };

    /**
     * Resolves which product tour should be shown for the keyword query bar.
     * this depends on the page the user is located on.
     */
    const resolveProductTourIds = () => {
        switch (homeState) {
            case "marketresearch_keywordmarketanalysis_home":
                return {
                    tourId: ProductTours.SearchInterestAnalysisQueryBar,
                    storageId: ProductToursLocalStorageKeys.SearchInterestAnalysisQueryBar,
                };

            case "keywordanalysis_home":
                return {
                    tourId: ProductTours.AnalyzeKeywordsQueryBar,
                    storageId: ProductToursLocalStorageKeys.AnalyzeKeywordsQueryBar,
                };

            case "keywordAnalysis-home":
            default:
                return {
                    tourId: ProductTours.KeywordAnalysisQueryBar,
                    storageId: ProductToursLocalStorageKeys.KeywordAnalysisQueryBar,
                };
        }
    };

    const { tourId, storageId } = resolveProductTourIds();
    const [hasViewedProductTour, setHasViewedProductTour] = useLocalStorage(storageId);

    const onCloseEducationBar = () => {
        setValues(true, false);
    };
    const onEducationIconClick = () => {
        setValues(false, true);
    };

    useEffect(() => {
        // Sorry for comparing a string to bool value, useLocalStorage is funky :(
        // In case the user is seeing the keywords query bar for the first time (in each available package)
        // show him a product tour
        if (!isLoading && hasViewedProductTour !== "true") {
            showIntercomTour(tourId);
            setHasViewedProductTour("true");
        }
    }, [isLoading, hasViewedProductTour, setHasViewedProductTour, tourId]);

    return (
        <SubNav
            backButton={homeUrl && <SubNavBackButton backStateUrl={homeUrl} />}
            topLeftComponent={<KeywordsQueryBar {...queryBarProps} />}
            bottomLeftComponent={
                <PageTitle
                    showEducationIcon={showEducationIcon}
                    onEducationIconClick={onEducationIconClick}
                />
            }
            bottomRightComponent={<KeywordAnalysisFilters />}
            education={
                showEducationBar && (
                    <EducationContainer onCloseEducationComponent={onCloseEducationBar} />
                )
            }
        />
    );
};

function mapStateToProps({ routing: { params } }) {
    const { keyword } = params;
    return {
        searchTerm: keyword,
    };
}
const connected = connect(mapStateToProps)(KeywordAnalysisSubNav);

SWReactRootComponent(connected, "KeywordAnalysisSubNav");
export default connected;
