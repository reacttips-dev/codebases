import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import ListSettingsModal from "./ListSettingsModal";
import { selectOpportunityListSettingsModal } from "../../../../../sub-modules/opportunities/store/selectors";
import { toggleOpportunityListSettingsModal } from "../../../../../sub-modules/opportunities/store/action-creators";

/**
 * @param state
 */
const mapStateToProps = (state: RootState) => ({
    modal: selectOpportunityListSettingsModal(state),
});

/**
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            toggleModal: toggleOpportunityListSettingsModal,
        },
        dispatch,
    );
};

const ListSettingsModalContainer = connect(mapStateToProps, mapDispatchToProps)(ListSettingsModal);

export type ListSettingsModalContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;
export default ListSettingsModalContainer;
