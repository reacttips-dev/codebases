import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { SupportedFilterType } from "../types/filters";
import { RootState, ThunkDispatchCommon } from "store/types";
import { FilterContainerProps, WithFilterKeyProp } from "../types/common";
import { selectFiltersInReadyState } from "../store/selectors";
import {
    addOrUpdateInReadyListAction,
    addOrUpdateInDirtyListAction,
    removeFromReadyListAction,
    removeFromDirtyListAction,
} from "../store/action-creators";

const mapStateToProps = (state: RootState) => ({
    filtersInReadyState: selectFiltersInReadyState(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            addOrUpdateInReadyList: addOrUpdateInReadyListAction,
            addOrUpdateInDirtyList: addOrUpdateInDirtyListAction,
            removeFromReadyList: removeFromReadyListAction,
            removeFromDirtyList: removeFromDirtyListAction,
        },
        dispatch,
    );
};

const withFilterUpdate = <PROPS extends FilterContainerProps & WithFilterKeyProp>(
    FilterComponent: React.ComponentType<PROPS>,
) => {
    function WrappedWithFilterUpdate(
        props: ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & PROPS,
    ) {
        const {
            filtersInReadyState,
            addOrUpdateInDirtyList,
            addOrUpdateInReadyList,
            removeFromDirtyList,
            removeFromReadyList,
            ...rest
        } = props;

        const handleUpdate = (filter: SupportedFilterType) => {
            const isInReadyFilters = filtersInReadyState.some((f) => f.key === filter.key);
            /**
             * In case this filter is in its "ready" state
             * we want to add or update both lists accordingly
             */
            if (filter.inReadyState()) {
                if (filter.inDirtyState()) {
                    addOrUpdateInDirtyList(filter);
                } else {
                    removeFromDirtyList(filter.key);
                }

                addOrUpdateInReadyList(filter);
                return;
            }
            /**
             * In case this filter is in its "dirty" state
             * we want to add or update the "dirty" list
             * and remove it from "ready" list if it was there
             */
            if (filter.inDirtyState()) {
                if (isInReadyFilters) {
                    removeFromReadyList(filter.key);
                }

                addOrUpdateInDirtyList(filter);
                return;
            }
            /**
             * In case this filter is in its "initial" state
             * we want to remove it from the "dirty" list
             * and from the "ready" list if it was there
             */
            if (filter.inInitialState()) {
                if (isInReadyFilters) {
                    removeFromReadyList(filter.key);
                }

                removeFromDirtyList(filter.key);
                return;
            }
        };

        return <FilterComponent {...((rest as unknown) as PROPS)} onUpdate={handleUpdate} />;
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps,
    )(WrappedWithFilterUpdate) as React.ComponentType<Omit<PROPS, "onUpdate">>;
};

export default withFilterUpdate;
