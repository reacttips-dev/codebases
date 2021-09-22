import React from "react";
import { CSSTransition } from "react-transition-group";
import { SupportedFilterType } from "../../../types/filters";
import { FiltersPanelContextType, WithExpandingProps } from "../../../types/common";
import useFiltersManager from "../../../hooks/useFiltersManager";
import FiltersPanelContext from "../../../contexts/filtersPanelContext";
import FiltersPanelHeadContainer from "../FiltersPanelHead/FiltersPanelHeadContainer";
import FiltersPanelSubmitContainer from "../FiltersPanelSubmit/FiltersPanelSubmitContainer";
import FiltersPanelContentContainer from "../FiltersPanelContent/FiltersPanelContentContainer";
import FiltersPanelCollapsedBarContainer from "../FiltersPanelCollapsedBar/FiltersPanelCollapsedBarContainer";
import { FILTERS_PANEL_TRANSITION_TIMEOUT } from "../../styles";
import { StyledFiltersPanel, StyledFiltersPanelInner, TRANSITION_CLASSNAME_PREFIX } from "./styles";

type FiltersPanelProps = Omit<WithExpandingProps, "isInitiallyExpandedWithTimeout"> & {
    isLoading: boolean;
    numberOfFiltersInDirtyState: number;
    isFirstCategoryInitiallyExpanded: boolean;
    onFiltersReset(inReadyState: SupportedFilterType[]): void;
};

const FiltersPanel = (props: FiltersPanelProps) => {
    const {
        isLoading,
        isExpanded,
        numberOfFiltersInDirtyState,
        isFirstCategoryInitiallyExpanded,
        onExpandToggle,
        onFiltersReset,
    } = props;
    const filtersManager = useFiltersManager();
    const context: FiltersPanelContextType = React.useMemo(() => {
        return {
            isLoading,
            isExpanded,
            onExpandToggle,
            isFirstCategoryInitiallyExpanded: !isLoading && isFirstCategoryInitiallyExpanded,
        };
    }, [isLoading, isExpanded, isFirstCategoryInitiallyExpanded]);

    const handleFiltersClear = () => {
        resetAllFiltersAndUpdate();
    };

    React.useEffect(() => {
        return () => {
            resetAllFiltersAndUpdate();
        };
    }, []);

    function resetAllFiltersAndUpdate() {
        onFiltersReset(filtersManager.resetAll());
    }

    return (
        <FiltersPanelContext.Provider value={context}>
            <CSSTransition
                in={!isExpanded}
                timeout={FILTERS_PANEL_TRANSITION_TIMEOUT}
                classNames={TRANSITION_CLASSNAME_PREFIX}
            >
                <StyledFiltersPanel classNamesPrefix={TRANSITION_CLASSNAME_PREFIX}>
                    <StyledFiltersPanelInner>
                        <FiltersPanelCollapsedBarContainer />
                        <FiltersPanelHeadContainer />
                        <FiltersPanelContentContainer />
                        {!isLoading && (
                            <FiltersPanelSubmitContainer
                                onFiltersClear={handleFiltersClear}
                                isClearButtonDisabled={numberOfFiltersInDirtyState === 0}
                            />
                        )}
                    </StyledFiltersPanelInner>
                </StyledFiltersPanel>
            </CSSTransition>
        </FiltersPanelContext.Provider>
    );
};

export default FiltersPanel;
