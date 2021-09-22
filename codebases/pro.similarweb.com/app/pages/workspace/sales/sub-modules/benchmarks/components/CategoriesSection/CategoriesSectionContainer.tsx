import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import useSimilarSitesTrackingService from "pages/sales-intelligence/sub-modules/right-sidebar/hooks/useSimilarSitesTrackingService";
import { TOPICS_TRANSLATION_KEY } from "pages/workspace/sales/sub-modules/benchmarks/constants";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useRightSidebarTrackingService from "pages/sales-intelligence/hooks/useRightSidebarTrackingService";
import CategoriesSection from "./CategoriesSection";
import { RootState, ThunkDispatchCommon } from "store/types";
import { setActiveBenchmarkCategoryAction } from "../../store/action-creators";
import { selectActiveWebsite } from "../../../opportunities-lists/store/selectors";
import {
    selectActiveBenchmarkCategory,
    selectActiveBenchmarksMode,
    selectActiveTopic,
    selectBenchmarkCategories,
    selectCompetitors,
    selectCompetitorsFetching,
} from "../../store/selectors";

type CategoriesSectionContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

const CategoriesSectionContainer = (props: CategoriesSectionContainerProps) => {
    const { selectedDomain, selectedTopic, similarSites } = props;

    const translate = useTranslation();
    const sidebarTrackingService = useRightSidebarTrackingService();
    const trackingService = useSimilarSitesTrackingService(selectedDomain);

    const handleCategorySelect = (category: string) => {
        sidebarTrackingService.trackBenchmarksCategoryChanged(
            translate(`si.insights.type.${category}`),
            translate(`${TOPICS_TRANSLATION_KEY}.${selectedTopic}`),
        );
        props.onCategorySelect(category);
    };

    const onSimilarSitesButtonClick = () => {
        trackingService.trackPanelOpenedViaToolbar(similarSites.length);
    };

    return (
        <CategoriesSection
            {...props}
            onCategorySelect={handleCategorySelect}
            onSimilarSitesButtonClick={onSimilarSitesButtonClick}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    selectedCategory: selectActiveBenchmarkCategory(state),
    selectedMode: selectActiveBenchmarksMode(state),
    selectedTopic: selectActiveTopic(state),
    selectedDomain: selectActiveWebsite(state)?.domain,
    categories: selectBenchmarkCategories(state),
    similarSites: selectCompetitors(state),
    similarSitesFetching: selectCompetitorsFetching(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            onCategorySelect: setActiveBenchmarkCategoryAction,
        },
        dispatch,
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesSectionContainer) as React.FC;
