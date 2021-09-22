import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SavedSearchDto } from "../types/common";
import { ThunkDispatchCommon } from "store/types";
import useFiltersManager from "../hooks/useFiltersManager";
import { extractFiltersFromDto } from "../helpers/filters";
import { initFiltersInBothStatesAction } from "../store/action-creators";

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            initFiltersInBothStates: initFiltersInBothStatesAction,
        },
        dispatch,
    );
};

const withFiltersFromSavedSearchInit = <PROPS extends { savedSearch: SavedSearchDto | null }>(
    ConsumerComponent: React.ComponentType<PROPS>,
) => {
    function WrappedWithFiltersFromSavedSearchInit(
        props: PROPS & ReturnType<typeof mapDispatchToProps>,
    ) {
        const { initFiltersInBothStates, ...rest } = props;
        const filtersManager = useFiltersManager();

        React.useEffect(() => {
            if (rest.savedSearch !== null) {
                const mainFilters = extractFiltersFromDto(rest.savedSearch);
                const group = filtersManager.applyValuesFromDto(mainFilters);

                initFiltersInBothStates(group);
            }
        }, [rest.savedSearch]);

        return <ConsumerComponent {...((rest as unknown) as PROPS)} />;
    }

    return connect(
        null,
        mapDispatchToProps,
    )(WrappedWithFiltersFromSavedSearchInit) as React.ComponentType<PROPS>;
};

export default withFiltersFromSavedSearchInit;
