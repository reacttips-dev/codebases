import React from "react";
import { connect } from "react-redux";
import { RootState } from "single-spa/store/types";
import BenchmarksTabContext from "../contexts/BenchmarksTabContext";
import { BenchmarksTabContextType } from "../types/benchmarks";
import createBenchmarksModeService from "../services/benchmarks-mode/bModeServiceFactory";
import {
    selectActiveCountriesIds,
    selectBenchmarkMode,
    selectCompetitors,
} from "../store/selectors";

const mapStateToProps = (state: RootState) => ({
    selectedCountriesIds: selectActiveCountriesIds(state),
    selectedCompetitors: selectCompetitors(state),
    selectedBenchmarksMode: selectBenchmarkMode(state),
});

export function withBenchmarksContext<PROPS extends {}>(Component: React.ComponentType<PROPS>) {
    function WrappedComponent<P extends PROPS & ReturnType<typeof mapStateToProps>>(props: P) {
        const { selectedCompetitors, selectedCountriesIds, selectedBenchmarksMode } = props;
        const numberOfCountries = selectedCountriesIds.length;
        const numberOfSimilarSites = selectedCompetitors.length;

        const benchmarksContextValue: BenchmarksTabContextType = React.useMemo(() => {
            return {
                numberOfCountries,
                numberOfSimilarSites,
                benchmarksModeService: createBenchmarksModeService(selectedBenchmarksMode),
            };
        }, [numberOfCountries, numberOfSimilarSites, selectedBenchmarksMode]);

        return (
            <BenchmarksTabContext.Provider value={benchmarksContextValue}>
                <Component {...(props as PROPS)} />
            </BenchmarksTabContext.Provider>
        );
    }

    return connect(mapStateToProps, null)(WrappedComponent) as React.ComponentType<PROPS>;
}
