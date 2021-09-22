import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import ListNotFoundModal from "./ListNotFoundModal";
import { selectNotFoundListModalOpen } from "../../../sub-modules/common/store/selectors";
import { toggleNotFoundListModalOpen } from "../../../sub-modules/common/store/action-creators";

const mapStateToProps = (state: RootState) => ({
    isOpen: selectNotFoundListModalOpen(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators({ toggleOpen: toggleNotFoundListModalOpen }, dispatch);
};

const ListNotFoundModalContainer = connect(mapStateToProps, mapDispatchToProps)(ListNotFoundModal);

export type ListNotFoundModalContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;
export default ListNotFoundModalContainer;
