import withSWNavigator from "pages/sales-intelligence/hoc/withSWNavigator";
import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { RootState } from "store/types";

import AddWebsiteToListButton, { AddWebsiteToListButtonProps } from "./AddWebsiteToListButton";
import { selectAlreadyInList, selectDisabledListNames } from "./selectors";

const mapStateToProps = (state: RootState, props: AddWebsiteToListButtonProps) => ({
    alreadyInList: selectAlreadyInList(state, props),
    disabledListsNames: selectDisabledListNames(state, props),
});

const AddWebsiteToListButtonContainer = compose(
    connect(mapStateToProps, null),
    withSWNavigator,
)(AddWebsiteToListButton);

export default AddWebsiteToListButtonContainer as React.FC<{
    domain: string;
    staticStarIcon?: "star-full" | "star-outline";
    disabledText?: string;
    isWhiteIcon?: boolean;
    withLoadingState?: boolean;
}>;
