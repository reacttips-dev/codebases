import React from "react";
import { connect } from "react-redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { bindActionCreators } from "redux";
import {
    selectContacts,
    selectFetchingContacts,
    selectFilters,
    selectIsEmptyState,
    selectLoadingFilters,
    selectQuotaRemaining,
    selectTotalCounts,
    selectUpdatingContacts,
} from "pages/sales-intelligence/sub-modules/contacts/store/selectors";
import {
    fetchContactPrivateDataThunk,
    fetchContactsFiltersThunk,
    fetchContactsQuotaThunk,
    fetchContactsThunk,
    updateContactsThunk,
} from "pages/sales-intelligence/sub-modules/contacts/store/effects";
import ContactsMainProvider from "./ContactsMainProvider";

const mapStateToProps = (state: RootState) => ({
    contacts: selectContacts(state),
    totalCount: selectTotalCounts(state),
    isEmptyState: selectIsEmptyState(state),
    loadingContacts: selectFetchingContacts(state),
    filters: selectFilters(state),
    contactsQuota: selectQuotaRemaining(state),
    updatingContacts: selectUpdatingContacts(state),
    loadingFilters: selectLoadingFilters(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchContacts: fetchContactsThunk,
            updateContacts: updateContactsThunk,
            fetchContactPrivateData: fetchContactPrivateDataThunk,
            fetchContactsQuota: fetchContactsQuotaThunk,
            fetchContactsFilters: fetchContactsFiltersThunk,
        },
        dispatch,
    );
};

export type ContactsFiltersContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ContactsMainProvider);
