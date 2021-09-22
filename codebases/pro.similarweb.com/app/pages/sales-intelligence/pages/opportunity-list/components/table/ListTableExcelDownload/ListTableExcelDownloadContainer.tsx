import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { OpportunityListType } from "pages/sales-intelligence/sub-modules/opportunities/types";
import { downloadListTableExcelThunk } from "pages/sales-intelligence/sub-modules/opportunities/store/effects";
import { selectOpportunityListTableExcelDownloading } from "pages/sales-intelligence/sub-modules/opportunities/store/selectors";
import ListTableExcelDownload from "./ListTableExcelDownload";

const mapStateToProps = (state: RootState) => ({
    downloading: selectOpportunityListTableExcelDownloading(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            downloadToExcel: downloadListTableExcelThunk,
        },
        dispatch,
    );
};

const ListTableExcelDownloadContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ListTableExcelDownload) as React.FC<{ list: OpportunityListType }>;

export default ListTableExcelDownloadContainer;
