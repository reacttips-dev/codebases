import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "single-spa/store/types";
import { StyledAdNetworksDropdown } from "./styles";
import { getAdNetworksUseThunkAction, syncSignalsUseThunkAction } from "../../store/effects";
import { selectAdNetworksMostUsedIds } from "../../store/selectors";
import { updateAdNetworksUseStatisticsAction } from "../../store/action-creators";
import { WithOpportunitiesListId } from "../../../opportunities-lists/types";

const mapStateToProps = <T extends WithOpportunitiesListId>(s: RootState, p: T) => ({
    mostUsedAdNetworkIds: selectAdNetworksMostUsedIds(s, p),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            syncUseStatistics: syncSignalsUseThunkAction,
            getUseStatistics: getAdNetworksUseThunkAction,
            updateUseStatistics: updateAdNetworksUseStatisticsAction,
        },
        dispatch,
    );
};

export type AdNetworksDropdownContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(StyledAdNetworksDropdown);
