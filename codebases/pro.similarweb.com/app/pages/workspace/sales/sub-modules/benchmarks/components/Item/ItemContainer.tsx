import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { RootState } from "store/types";
import { getUniqueBenchmarkId } from "../../helpers";
import { BaseWebsiteType } from "../../types/common";
import { BenchmarkResultType } from "../../types/benchmarks";
import { selectActiveTopic, selectBenchmarkMode } from "../../store/selectors";
import BenchmarksTabContext from "../../contexts/BenchmarksTabContext";
import withBenchmarkUpdate, { WithBenchmarkUpdateProps } from "../../hoc/withBenchmarkUpdate";
import Item from "./Item";
import useRightSidebarTrackingService from "pages/sales-intelligence/hooks/useRightSidebarTrackingService";
import { useTranslation } from "components/WithTranslation/src/I18n";

type ItemContainerProps = {
    benchmarkResult: BenchmarkResultType;
};

type ConnectedProps = ReturnType<typeof mapStateToProps> & WithBenchmarkUpdateProps;

const ItemContainer = (props: ItemContainerProps & ConnectedProps) => {
    const translate = useTranslation();
    const { numberOfCountries, numberOfSimilarSites } = React.useContext(BenchmarksTabContext);
    const sidebarTrackingService = useRightSidebarTrackingService();
    const {
        benchmarkResult,
        benchmarksMode,
        updatingId,
        selectedTopic,
        updateCompetitorInABenchmark,
        removeCompetitorInABenchmark,
        addCompetitorInABenchmark,
        fetchSimilarWebsites,
    } = props;
    const id = getUniqueBenchmarkId(benchmarkResult);

    const handleAddCompetitor = (website: BaseWebsiteType) => {
        addCompetitorInABenchmark(website, benchmarkResult);
    };

    const handleRemoveCompetitor = (domain: BaseWebsiteType["domain"]) => {
        removeCompetitorInABenchmark(domain, benchmarkResult);
    };

    const handleUpdateCompetitor = (
        website: BaseWebsiteType,
        prevDomain: BaseWebsiteType["domain"],
    ) => {
        updateCompetitorInABenchmark(website, {
            prevDomain,
            benchmarkResult,
        });
    };

    const handleItemDetailsClick = (formattedOpportunity: string) => {
        const { prospect, country, benchmark } = benchmarkResult;

        sidebarTrackingService.trackBenchmarksCardExpanded(
            translate(`workspace.sales.benchmarks.metrics.${benchmark.metric}.title`),
            translate(`workspace.sales.benchmarks.topics.${selectedTopic}`),
            formattedOpportunity,
        );
        fetchSimilarWebsites(prospect.domain, country, benchmark.metric);
    };

    return (
        <Item
            isLoading={id === updatingId}
            benchmarksMode={benchmarksMode}
            benchmarkResult={benchmarkResult}
            numberOfCountries={numberOfCountries}
            numberOfSimilarSites={numberOfSimilarSites}
            onDetailsClick={handleItemDetailsClick}
            onAddCompetitor={handleAddCompetitor}
            onUpdateCompetitor={handleUpdateCompetitor}
            onRemoveCompetitor={handleRemoveCompetitor}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    benchmarksMode: selectBenchmarkMode(state),
    selectedTopic: selectActiveTopic(state),
});

export default compose(connect(mapStateToProps), withBenchmarkUpdate)(ItemContainer) as React.FC<
    ItemContainerProps
>;
