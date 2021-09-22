import React from "react";
import { CSSTransition } from "react-transition-group";
import useExpandedItemState from "../../../hooks/useExpandedItemState";
import CompanyFiltersCategory from "../../filters-categories/CompanyFiltersCategory/CompanyFiltersCategory";
import WebsiteFiltersCategory from "../../filters-categories/WebsiteFiltersCategory/WebsiteFiltersCategory";
import TrafficFiltersCategory from "../../filters-categories/TrafficFiltersCategory/TrafficFiltersCategory";
import ExcludeFiltersCategory from "../../filters-categories/ExcludeFiltersCategory/ExcludeFiltersCategory";
import QuickSearchFiltersCategory from "../../filters-categories/QuickSearchFiltersCategory/QuickSearchFiltersCategory";
import { FILTERS_PANEL_TRANSITION_TIMEOUT } from "../../styles";
import { StyledPanelContent, CONTENT_TRANSITION_CLASSNAMES_PREFIX } from "./styles";

type FilterPanelContentProps = {
    isLoading: boolean;
    isVisible: boolean;
    shouldExpandFirstCategory: boolean;
};

const FiltersPanelContent = (props: FilterPanelContentProps) => {
    const { isLoading, isVisible, shouldExpandFirstCategory } = props;
    const [expandedCategoryIndex, setExpandedCategoryIndex] = useExpandedItemState();

    const renderContent = () => {
        if (isLoading) {
            // TODO: Replace with loading view
            return null;
        }

        return (
            <>
                {...[
                    QuickSearchFiltersCategory,
                    WebsiteFiltersCategory,
                    CompanyFiltersCategory,
                    TrafficFiltersCategory,
                    ExcludeFiltersCategory,
                ].map((Component, index) => (
                    <Component
                        key={`filters-category-item-${index}`}
                        isExpanded={expandedCategoryIndex === index}
                        onExpandToggle={() => setExpandedCategoryIndex(index)}
                        isInitiallyExpandedWithTimeout={shouldExpandFirstCategory && index === 0}
                    />
                ))}
            </>
        );
    };

    return (
        <CSSTransition
            in={!isVisible}
            timeout={FILTERS_PANEL_TRANSITION_TIMEOUT}
            classNames={CONTENT_TRANSITION_CLASSNAMES_PREFIX}
        >
            <StyledPanelContent classNamesPrefix={CONTENT_TRANSITION_CLASSNAMES_PREFIX}>
                {renderContent()}
            </StyledPanelContent>
        </CSSTransition>
    );
};

export default FiltersPanelContent;
