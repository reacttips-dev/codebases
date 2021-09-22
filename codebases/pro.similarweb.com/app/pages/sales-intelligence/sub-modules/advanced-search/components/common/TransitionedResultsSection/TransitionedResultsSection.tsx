import React from "react";
import withResultsExpandTransition from "../../../hoc/withResultsExpandTransition";
import SearchResultsTableContainer from "../SearchResultsTable/SearchResultsTableContainer";

const TransitionedResultsSection = withResultsExpandTransition(SearchResultsTableContainer);

export default TransitionedResultsSection;
