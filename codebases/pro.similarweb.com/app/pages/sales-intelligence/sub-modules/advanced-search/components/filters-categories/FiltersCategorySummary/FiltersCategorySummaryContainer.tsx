import React from "react";
import { CSSTransition } from "react-transition-group";
import { SupportedFilterType } from "../../../types/filters";
import { WithFiltersKeysProp } from "../../../types/common";
import withMatchedFiltersInReadyState from "../../../hoc/withMatchedFiltersInReadyState";
import FiltersCategorySummary from "./FiltersCategorySummary";
import {
    StyledSummaryTransitionedContainer,
    TRANSITION_TIMEOUT,
    TRANSITION_CLASSNAME_PREFIX,
} from "./styles";

type FiltersCategorySummaryContainerProps = WithFiltersKeysProp & {
    isVisible: boolean;
    filters: SupportedFilterType[];
};

const FiltersCategorySummaryContainer = (props: FiltersCategorySummaryContainerProps) => {
    const { isVisible, filters } = props;

    return (
        <CSSTransition
            unmountOnExit
            in={isVisible}
            timeout={TRANSITION_TIMEOUT}
            classNames={TRANSITION_CLASSNAME_PREFIX}
        >
            <StyledSummaryTransitionedContainer classNamesPrefix={TRANSITION_CLASSNAME_PREFIX}>
                <FiltersCategorySummary summaryItems={filters.map((f) => f.getSummary())} />
            </StyledSummaryTransitionedContainer>
        </CSSTransition>
    );
};

export default withMatchedFiltersInReadyState(FiltersCategorySummaryContainer);
