import React from "react";
import { connect } from "react-redux";
import { RootState } from "store/types";
import { CSSTransition } from "react-transition-group";
import { selectFiltersPanelExpanded } from "../store/selectors";
import { FILTERS_PANEL_TRANSITION_TIMEOUT } from "../components/styles";
import { StyledTransitionedSearchResultsWrap } from "../components/common/SearchResultsTable/styles";

const mapStateToProps = (state: RootState) => ({
    filtersPanelExpanded: selectFiltersPanelExpanded(state),
});

const withResultsExpandTransition = <PROPS extends {}>(Component: React.ComponentType<PROPS>) => {
    const WrappedWithResultsExpandTransition = (
        props: PROPS & ReturnType<typeof mapStateToProps>,
    ) => {
        const { filtersPanelExpanded, ...rest } = props;

        return (
            <CSSTransition
                in={!filtersPanelExpanded}
                classNames="transition-results-section"
                timeout={FILTERS_PANEL_TRANSITION_TIMEOUT}
            >
                <StyledTransitionedSearchResultsWrap classNamesPrefix="transition-results-section">
                    <Component {...((rest as unknown) as PROPS)} />
                </StyledTransitionedSearchResultsWrap>
            </CSSTransition>
        );
    };

    return connect(
        mapStateToProps,
        null,
    )(WrappedWithResultsExpandTransition) as React.ComponentType<PROPS>;
};

export default withResultsExpandTransition;
