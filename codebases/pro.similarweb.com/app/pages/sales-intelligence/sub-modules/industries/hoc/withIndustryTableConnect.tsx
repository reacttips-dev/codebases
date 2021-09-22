import React from "react";
import { connect } from "react-redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { fetchIndustriesTableDataThunk } from "pages/sales-intelligence/sub-modules/industries/store/effects";
import {
    selectFetchingData,
    selectTableData,
    selectTableFilters,
} from "pages/sales-intelligence/sub-modules/industries/store/selectors";
import { FilterIndustryTableConfig } from "pages/sales-intelligence/sub-modules/industries/types";

const mapStateToProps = (state: RootState) => ({
    tableData: selectTableData(state),
    tableFilters: selectTableFilters(state),
    fetchingData: selectFetchingData(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return {
        fetchTableData: (
            url: string,
            params: Pick<FilterIndustryTableConfig, "params">,
            page: number,
        ) => dispatch(fetchIndustriesTableDataThunk(url, params, page)),
    };
};

const withIndustryTableConnect = <PROPS extends {}>(Component: React.ComponentType<PROPS>) => {
    return connect(mapStateToProps, mapDispatchToProps)(Component);
};

export type WithIndustryTableConnect = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

export default withIndustryTableConnect;
