import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import OpportunityListPageContext, {
    OpportunityListPageContextType,
} from "../context/OpportunityListPageContext";
import {
    selectOpportunityListCreating,
    selectOpportunityListDeleteError,
    selectOpportunityListDeleting,
    selectOpportunityListUpdating,
} from "../../../sub-modules/opportunities/store/selectors";
import { OpportunityListType } from "../../../sub-modules/opportunities/types";
import {
    changeListCountryThunk,
    createOpportunityListThunk,
    deleteOpportunityListThunk,
    updateOpportunityListSettingsThunk,
    updateOpportunityListThunk,
} from "../../../sub-modules/opportunities/store/effects";

/**
 * @param state
 */
const mapStateToProps = (state: RootState) => ({
    listCreating: selectOpportunityListCreating(state),
    listUpdating: selectOpportunityListUpdating(state),
    listDeleting: selectOpportunityListDeleting(state),
    listDeleteError: selectOpportunityListDeleteError(state),
});

/**
 * @param dispatch
 */
const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            createList: createOpportunityListThunk,
            updateList: updateOpportunityListThunk,
            deleteList: deleteOpportunityListThunk,
            updateListCountry: changeListCountryThunk,
            updateListSettings: updateOpportunityListSettingsThunk,
        },
        dispatch,
    );
};

const withOpportunityListPageContext = <PROPS extends { list: OpportunityListType }>(
    Component: React.ComponentType<PROPS>,
) => {
    function WrappedWithOpportunityListPageContext(
        props: PROPS & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>,
    ) {
        const {
            list,
            listCreating,
            listUpdating,
            listDeleting,
            updateList,
            createList,
            deleteList,
            listDeleteError,
            updateListSettings,
            updateListCountry,
            ...rest
        } = props;
        const context: OpportunityListPageContextType = React.useMemo(() => {
            return {
                list,
                listCreating,
                listUpdating,
                listDeleting,
                createList,
                updateList,
                deleteList,
                listDeleteError,
                updateListCountry,
                updateListSettings,
            };
        }, [
            list,
            listCreating,
            listUpdating,
            listDeleting,
            createList,
            updateList,
            deleteList,
            listDeleteError,
            updateListCountry,
            updateListSettings,
        ]);

        return (
            <OpportunityListPageContext.Provider value={context}>
                <Component {...((rest as unknown) as PROPS)} />
            </OpportunityListPageContext.Provider>
        );
    }

    return connect(mapStateToProps, mapDispatchToProps)(WrappedWithOpportunityListPageContext);
};

export default withOpportunityListPageContext;
