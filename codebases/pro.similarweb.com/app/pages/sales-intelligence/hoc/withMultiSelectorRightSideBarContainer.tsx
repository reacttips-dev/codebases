import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import {
    selectActiveSelectorPanel,
    selectExcelQuota,
} from "pages/sales-intelligence/sub-modules/common/store/selectors";
import {
    fetchExcelQuotaThunk,
    toggleMultiSelectorPanelThunk,
} from "pages/sales-intelligence/sub-modules/common/store/effects";
import MultiSelectorContext from "pages/sales-intelligence/context/MultiSelectorContext";
import { toggleRightBar } from "pages/workspace/sales/sub-modules/common/store/action-creators";
import { selectRightBarIsOpen } from "pages/workspace/sales/sub-modules/common/store/selectors";

const mapStateToProps = (state: RootState) => ({
    activePanel: selectActiveSelectorPanel(state),
    excelQuota: selectExcelQuota(state),
    isRightBarOpen: selectRightBarIsOpen(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            toggleMultiSelectorPanel: toggleMultiSelectorPanelThunk,
            fetchExcelQuota: fetchExcelQuotaThunk,
            closeRightSideBar: () => toggleRightBar(false),
        },
        dispatch,
    );
};

export type MultiSelectorContainerProps = ReturnType<typeof mapDispatchToProps> &
    ReturnType<typeof mapStateToProps>;

function withMultiSelectorRightSideBarContainer<PROPS extends {}>(
    Component: React.ComponentType<PROPS>,
) {
    function WrapperComponent(props: MultiSelectorContainerProps & PROPS) {
        const { closeRightSideBar, isRightBarOpen, ...rest } = props;

        const onCloseRightSideBar = () => {
            if (isRightBarOpen) closeRightSideBar();
        };

        return (
            <MultiSelectorContext.Provider value={{ onCloseRightSideBar }}>
                <Component
                    {...(rest as PROPS &
                        Omit<MultiSelectorContainerProps, "closeRightSideBar" | "isRightBarOpen">)}
                />
            </MultiSelectorContext.Provider>
        );
    }

    return connect(mapStateToProps, mapDispatchToProps)(WrapperComponent);
}

export default withMultiSelectorRightSideBarContainer;
