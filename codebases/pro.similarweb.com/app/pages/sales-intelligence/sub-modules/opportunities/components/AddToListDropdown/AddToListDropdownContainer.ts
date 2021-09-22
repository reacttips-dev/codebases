import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import {
    selectIsOpenOpportunityList,
    selectOpportunityListCreating,
    selectOpportunityListUpdating,
} from "../../store/selectors";
import AddToListDropdown from "./AddToListDropdown";
import {
    createOpportunityListFromSearchThunk,
    updateListOpportunitiesFromSearchThunk,
} from "../../store/effects";
import { setIsOpenOpportunityList } from "pages/sales-intelligence/sub-modules/opportunities/store/action-creators";
import { selectListsWithDisabledProp } from "./selectors";
import { fetchWorkspacesThunk } from "pages/sales-intelligence/sub-modules/common/store/effects";
import { AddToListDropdownProps } from "./types";

export const mapStateToProps = (state: RootState, props: AddToListProps) => ({
    listCreating: selectOpportunityListCreating(state),
    listUpdating: selectOpportunityListUpdating(state),
    opportunityLists: selectListsWithDisabledProp(state, props),
    isOpen: selectIsOpenOpportunityList(state),
});

export const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            createList: createOpportunityListFromSearchThunk,
            updateListOpportunitiesFromSearch: updateListOpportunitiesFromSearchThunk,
            setIsOpen: setIsOpenOpportunityList,
            getWorkspace: fetchWorkspacesThunk,
        },
        dispatch,
    );
};

const AddToListDropdownContainer = connect(mapStateToProps, mapDispatchToProps)(AddToListDropdown);

export type AddToListProps = { disabledText?: string; disabledLists?: string[] };

export type AddToListDropdownContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

export default AddToListDropdownContainer as React.FC<
    AddToListProps &
        Omit<
            AddToListDropdownProps,
            | "opportunityLists"
            | "createList"
            | "listCreating"
            | "listUpdating"
            | "updateListOpportunitiesFromSearch"
            | "showSuccessToast"
            | "showErrorToast"
            | "isOpen"
            | "setIsOpen"
            | "getWorkspace"
        >
>;
