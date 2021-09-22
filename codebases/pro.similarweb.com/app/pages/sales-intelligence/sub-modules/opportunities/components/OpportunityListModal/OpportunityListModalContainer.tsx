import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import WebsitesModalWrapper from "./WebsitesModalWrapper";
import { toggleOpportunityListModal } from "../../store/action-creators";
import {
    createOpportunityListThunk,
    fetchWebsitesByTermThunk,
    updateListOpportunitiesAndReFetchThunk,
} from "../../store/effects";
import {
    selectOpportunityListCreating,
    selectOpportunityListModal,
    selectOpportunityListUpdating,
} from "../../store/selectors";

const mapStateToProps = (state: RootState) => ({
    modal: selectOpportunityListModal(state),
    listCreating: selectOpportunityListCreating(state),
    listUpdating: selectOpportunityListUpdating(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            toggleModalOpen: toggleOpportunityListModal,
            createList: createOpportunityListThunk,
            searchForWebsites: fetchWebsitesByTermThunk,
            updateListOpportunitiesAndReFetch: updateListOpportunitiesAndReFetchThunk,
        },
        dispatch,
    );
};

export const OpportunityListModalContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(WebsitesModalWrapper);

SWReactRootComponent(OpportunityListModalContainer, "OpportunityListModalContainer");

export type OpportunityListModalContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;
export default OpportunityListModalContainer;
