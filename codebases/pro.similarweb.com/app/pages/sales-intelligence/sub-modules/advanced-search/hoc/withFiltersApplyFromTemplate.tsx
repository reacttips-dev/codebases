import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import useFiltersManager from "../hooks/useFiltersManager";
import { selectSearchTemplate } from "../store/selectors";
import { initFiltersInBothStatesAction, setSearchTemplateAction } from "../store/action-creators";

const mapStateToProps = (state: RootState) => ({
    searchTemplate: selectSearchTemplate(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            setSearchTemplate: setSearchTemplateAction,
            initFiltersInBothStates: initFiltersInBothStatesAction,
        },
        dispatch,
    );
};

type ConnectedProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const withFiltersApplyFromTemplate = <PROPS extends {}>(Component: React.ComponentType<PROPS>) => {
    function WrappedWithFiltersApplyFromTemplate(props: PROPS & ConnectedProps) {
        const { searchTemplate, initFiltersInBothStates, setSearchTemplate, ...rest } = props;
        const filtersManager = useFiltersManager();

        React.useEffect(() => {
            if (searchTemplate !== null) {
                initFiltersInBothStates(filtersManager.applyValuesFromDto(searchTemplate.filters));
            }
        }, [searchTemplate]);

        React.useEffect(() => {
            return () => {
                setSearchTemplate(null);
            };
        }, []);

        return <Component {...((rest as unknown) as PROPS)} />;
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps,
    )(WrappedWithFiltersApplyFromTemplate) as React.ComponentType<PROPS>;
};

export default withFiltersApplyFromTemplate;
