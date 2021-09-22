import React from "react";
import { usePrevious } from "components/hooks/usePrevious";
import { ReportResult } from "../../sub-modules/saved-searches/types";
import {
    createSearchThunk,
    fetchTechnologiesFiltersThunk,
} from "../../sub-modules/saved-searches/store/effects";
import LegacyLGWizardWrapper from "./LegacyLGWizardWrapper";
import { WithSWNavigatorProps } from "pages/sales-intelligence/hoc/withSWNavigator";
import SearchLegend from "pages/sales-intelligence/sub-modules/saved-searches/components/SearchLegend/SearchLegend";
import { ICategoriesResponse } from "pages/lead-generator/lead-generator-new/components/filters/TechnographicsBoxFilter";
import { SearchPageWrapper } from "./styles";

type BaseSearchPageProps = {
    backRoute: string;
    resultsRoute: string;
    searchCreating: boolean;
    reportResult: ReportResult;
    technologiesFilters: ICategoriesResponse;
    createSearch(...args: Parameters<typeof createSearchThunk>): void;
    fetchTechnologiesFilters(...args: Parameters<typeof fetchTechnologiesFiltersThunk>): void;
};

// TODO: [lead-gen-remove]
const BaseSearchPage = (props: BaseSearchPageProps & WithSWNavigatorProps) => {
    const {
        backRoute,
        searchCreating,
        reportResult,
        resultsRoute,
        createSearch,
        navigator,
        technologiesFilters,
        fetchTechnologiesFilters,
    } = props;
    const prevCreating = usePrevious(searchCreating);
    const goBack = React.useCallback(() => {
        navigator.go(backRoute);
    }, [backRoute]);

    React.useEffect(() => {
        if (
            typeof prevCreating !== "undefined" &&
            prevCreating !== searchCreating &&
            !searchCreating
        ) {
            if (typeof reportResult.queryId !== "undefined") {
                navigator.go(resultsRoute, { id: reportResult.queryId });
            }
        }
    }, [searchCreating]);

    React.useEffect(() => {
        fetchTechnologiesFilters();
    }, []);

    return (
        <SearchPageWrapper>
            <SearchLegend currentStep={0} onClickBack={goBack} />
            <LegacyLGWizardWrapper
                onRunReport={createSearch}
                technologies={technologiesFilters}
                activeSavedSearchFilterData={reportResult}
            />
        </SearchPageWrapper>
    );
};

export default BaseSearchPage;
