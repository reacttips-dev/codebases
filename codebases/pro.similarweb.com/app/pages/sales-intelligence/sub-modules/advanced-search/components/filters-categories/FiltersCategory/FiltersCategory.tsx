import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import useExpandedItemState from "../../../hooks/useExpandedItemState";
import useFiltersRegistry from "../../../hooks/useFiltersRegistry";
import { FiltersGroupContainerProps, WithExpandingProps } from "../../../types/common";
import FiltersCategorySummaryContainer from "../FiltersCategorySummary/FiltersCategorySummaryContainer";
import Collapsible from "pages/sales-intelligence/common-components/collapsible/Collapsible/Collapsible";
import {
    StyledCategoryName,
    StyledCategoryHead,
    StyledIconContainer,
    StyledCategoryHeadInner,
    StyledFiltersCategoryContainer,
    CATEGORY_INITIAL_EXPAND_TIMEOUT,
    GROUP_INITIAL_EXPAND_TIMEOUT,
} from "./styles";

type FiltersCategoryProps = Partial<WithExpandingProps> & {
    name: string;
    groupsComponents: React.ComponentType<FiltersGroupContainerProps>[];
    renderAboveGroupsContent?(registerFilter: (key: string) => void): React.ReactNode;
    renderBelowGroupsContent?(registerFilter: (key: string) => void): React.ReactNode;
};

const FiltersCategory = (props: FiltersCategoryProps) => {
    const {
        name,
        groupsComponents,
        isExpanded = false,
        isInitiallyExpandedWithTimeout = false,
        onExpandToggle = () => undefined,
        renderAboveGroupsContent = () => null,
        renderBelowGroupsContent = () => null,
    } = props;
    const [expandedGroupIndex, setExpandedGroupIndex] = useExpandedItemState();
    const { filtersKeys, registerFilter } = useFiltersRegistry();

    React.useEffect(() => {
        let categoryExpandTimeout = null;

        if (isInitiallyExpandedWithTimeout) {
            categoryExpandTimeout = setTimeout(() => {
                requestAnimationFrame(onExpandToggle);

                setTimeout(() => {
                    requestAnimationFrame(() => setExpandedGroupIndex(0));
                }, GROUP_INITIAL_EXPAND_TIMEOUT);
            }, CATEGORY_INITIAL_EXPAND_TIMEOUT);
        }

        return () => {
            if (categoryExpandTimeout !== null) {
                clearTimeout(categoryExpandTimeout);
            }
        };
    }, [isInitiallyExpandedWithTimeout]);

    return (
        <StyledFiltersCategoryContainer>
            <StyledCategoryHead expanded={isExpanded} onClick={onExpandToggle}>
                <StyledCategoryHeadInner>
                    <StyledCategoryName>{name}</StyledCategoryName>
                    <StyledIconContainer>
                        <SWReactIcons iconName="chev-down" size="sm" />
                    </StyledIconContainer>
                </StyledCategoryHeadInner>
                <FiltersCategorySummaryContainer
                    isVisible={!isExpanded}
                    filtersKeys={filtersKeys}
                />
            </StyledCategoryHead>
            <Collapsible isActive={isExpanded}>
                {renderAboveGroupsContent(registerFilter)}
                {groupsComponents.map((GroupComponent, index) => (
                    <GroupComponent
                        key={`${GroupComponent.displayName}-${index}`}
                        onFilterRegister={registerFilter}
                        isExpanded={expandedGroupIndex === index}
                        onExpandToggle={() => setExpandedGroupIndex(index)}
                    />
                ))}
                {renderBelowGroupsContent(registerFilter)}
            </Collapsible>
        </StyledFiltersCategoryContainer>
    );
};

export default FiltersCategory;
