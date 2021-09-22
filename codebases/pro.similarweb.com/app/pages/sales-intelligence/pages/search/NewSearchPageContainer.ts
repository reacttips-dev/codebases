import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import withSWNavigator, { WithSWNavigatorProps } from "../../hoc/withSWNavigator";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import NewSearchPage from "./NewSearchPage";
import withSecondaryBarSet from "pages/sales-intelligence/hoc/withSecondaryBarSet";
import {
    createSearchThunk,
    fetchTechnologiesFiltersThunk,
} from "../../sub-modules/saved-searches/store/effects";
import {
    selectSearchCreating,
    selectReportResult,
    selectTechnologiesFilters,
} from "../../sub-modules/saved-searches/store/selectors";

// TODO: [lead-gen-remove]
const mapStateToProps = (state: RootState) => ({
    searchCreating: selectSearchCreating(state),
    reportResult: selectReportResult(state),
    technologiesFilters: selectTechnologiesFilters(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            createSearch: createSearchThunk,
            fetchTechnologiesFilters: fetchTechnologiesFiltersThunk,
        },
        dispatch,
    );
};

const NewSearchPageContainer = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withSecondaryBarSet("SalesIntelligenceLists"),
    withSWNavigator,
)(NewSearchPage);

SWReactRootComponent(NewSearchPageContainer, "NewSearchPageContainer");

export type NewSearchPageContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    WithSWNavigatorProps;
export default NewSearchPageContainer;
