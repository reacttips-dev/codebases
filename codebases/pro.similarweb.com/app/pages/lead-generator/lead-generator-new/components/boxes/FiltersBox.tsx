import React from "react";
import StyledFiltersBox from "pages/lead-generator/lead-generator-new/components/FiltersBox/StyledFiltersBox";
import { ICategoriesResponse } from "pages/lead-generator/lead-generator-new/components/filters/TechnographicsBoxFilter";

// TODO: Refactor, extract

export function getFiltersBoxActiveFilters(filters, isActive) {
    if (!isActive) {
        return [];
    }

    return filters.filter((filter) => {
        const crrValue = filter.getValue();

        if (Array.isArray(crrValue)) {
            return crrValue.length > 0;
        }

        return crrValue !== filter.initValue;
    });
}

export function createFilterBoxes(
    filters,
    isActive,
    setActive,
    isDesktopOnly?,
    technologies?: ICategoriesResponse,
) {
    return filters
        .filter((filter) => !filter.hideInBox)
        .map((filter, index) => {
            const Component = filter.component;

            return (
                <Component
                    filters={filters}
                    filter={filter}
                    isActive={isActive}
                    technologies={technologies}
                    isLocked={filter.isLocked}
                    key={`${index}FILTER`}
                    setBoxActive={setActive}
                    isDesktopOnly={isDesktopOnly}
                    trialHookName={filter.trialHookName}
                />
            );
        });
}

export interface IFiltersBoxProps {
    preface: string;
    dataAutomation: string;
    title: string;
    subtitle: string;
    subtitleCollapsed: string;
    filters: any[]; // TODO: Proper type
    isActive: boolean;
    setActive: (active: boolean) => void;
    hasToggle?: boolean;
    isLocked?(): boolean;
    hasValue: boolean;
    technologies: ICategoriesResponse;
}

const FiltersBox: React.FunctionComponent<IFiltersBoxProps> = (props) => {
    const { filters, isActive, setActive } = props;

    return (
        <StyledFiltersBox {...props}>
            {createFilterBoxes(filters, isActive, setActive)}
        </StyledFiltersBox>
    );
};

export default FiltersBox;
