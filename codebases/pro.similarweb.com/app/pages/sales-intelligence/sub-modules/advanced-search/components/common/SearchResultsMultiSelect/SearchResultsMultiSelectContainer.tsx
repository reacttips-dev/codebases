import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { OpportunityListType } from "pages/sales-intelligence/sub-modules/opportunities/types";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";
import MultiSelector from "pages/sales-intelligence/common-components/MultiSelector/MulltiSelector";
import { addDomainsToListThunk, addTopNDomainsToListThunk } from "../../../store/effects";
import { StyledTableMultiSelectContainer } from "./styles";
import { selectExcelDownloading } from "../../../store/selectors";

type SearchResultsMultiSelectContainerProps = {
    resultsTotalCount: number;
    onSelectionColumnToggle(isVisible: boolean): void;
};

type ConnectedProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const SearchResultsMultiSelectContainer = (
    props: SearchResultsMultiSelectContainerProps & ConnectedProps,
) => {
    const {
        resultsTotalCount,
        excelDownloading,
        onSelectionColumnToggle,
        addDomainsToOpportunityList,
        addTopNDomainsToOpportunityList,
    } = props;

    const handleAddToListSubmit = (
        list: OpportunityListType,
        domainsOrCount: string[] | number,
    ) => {
        if (typeof domainsOrCount === "number") {
            addTopNDomainsToOpportunityList(list, domainsOrCount);
        } else {
            addDomainsToOpportunityList(list, domainsOrCount);
        }
    };

    const handleExcelDownload = (domainsOrCount: string[] | number) => {
        console.log("TBA", domainsOrCount);
    };

    return (
        <StyledTableMultiSelectContainer>
            <MultiSelector
                tableSelectionProperty="site"
                totalCount={resultsTotalCount}
                excelDownloading={excelDownloading}
                handleDownloadExcel={handleExcelDownload}
                handleSubmitAccount={handleAddToListSubmit}
                handleColumnsToggle={onSelectionColumnToggle}
                tableSelectionKey="advanced-search-results-table"
                initialState={[TypeOfSelectors.ACCOUNT, TypeOfSelectors.EXCEL]}
            />
        </StyledTableMultiSelectContainer>
    );
};

const mapStateToProps = (state: RootState) => ({
    excelDownloading: selectExcelDownloading(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            addDomainsToOpportunityList: addDomainsToListThunk,
            addTopNDomainsToOpportunityList: addTopNDomainsToListThunk,
        },
        dispatch,
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SearchResultsMultiSelectContainer) as React.ComponentType<SearchResultsMultiSelectContainerProps>;
