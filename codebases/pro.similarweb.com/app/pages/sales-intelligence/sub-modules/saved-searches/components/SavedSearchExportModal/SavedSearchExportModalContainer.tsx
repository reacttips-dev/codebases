import React from "react";
import { connect } from "react-redux";
import { RootState } from "store/types";
import withSearchAutoRerun from "../../hoc/withSearchAutoRerun";
import SavedSearchExportModal from "./SavedSearchExportModal";
import { selectExcelExportedDomains } from "../../store/selectors";

const mapStateToProps = (state: RootState) => ({
    exportedDomains: selectExcelExportedDomains(state),
});

// TODO: Remove "as" after "connect" typings are fixed
const SavedSearchExportModalContainer = withSearchAutoRerun(
    connect(mapStateToProps, null)(SavedSearchExportModal),
) as React.FC<any>;

export default SavedSearchExportModalContainer;
