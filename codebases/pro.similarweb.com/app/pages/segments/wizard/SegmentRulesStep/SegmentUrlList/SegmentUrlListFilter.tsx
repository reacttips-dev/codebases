import React, { PureComponent, useState, useEffect } from "react";
import {
    DropdownButton,
    Dropdown,
    EllipsisDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { FunctionComponent } from "react";
import * as PropTypes from "prop-types";
import { RuleTypes } from "components/RulesQueryBuilder/src/RulesQueryBuilderTypes";
import { ISegmentUrlListFilterProps } from "./SegmentUrlListTypes";
import {
    SegmentUrlListFilterButtonDefaultText,
    SegmentUrlListFilterSelectedButtonText,
} from "./SegmentUrlListStyles";
import { arrayOf } from "prop-types";
import { string } from "prop-types";

export const SegmentUrlListFilter: FunctionComponent<ISegmentUrlListFilterProps> = (props) => {
    const { onFilterTermSelect, filterButtonText, filterTerms, segmentRules, appendTo } = props;

    const defaultFilterItemId = "default-item";
    const [selectedFilterItemId, setSelectedFilterItemId] = useState<string>(defaultFilterItemId);
    const [selectedFilterItemText, setSelectedFilterItemText] = useState<string>(null);

    /**
     * Sets a new selected filter item. this also triggers external filtering behavior
     * if onFilterTermSelect function prop was provided.
     */
    const handleFilterItemSelect = (filterItemId: string, filterItemText: string = null) => {
        if (onFilterTermSelect) {
            onFilterTermSelect(filterItemText);
        }

        setSelectedFilterItemId(filterItemId);
        setSelectedFilterItemText(filterItemText);
    };

    /**
     * Manages a filter item click. calls handleFilterItem select for setting the clicked
     * item as the currently selected filter.
     */
    const handleFilterItemClick = (filterItem): void => {
        // Check if the default item was selected. if so - make sure that the item's
        // text is set to null, so that we don't filter any items according to its text
        // (default item is the equivalent of selecting "nothing")
        const isDefaultSelection = filterItem.id === defaultFilterItemId;
        const filterItemText = isDefaultSelection ? null : filterItem.children;
        handleFilterItemSelect(filterItem.id, filterItemText);
    };

    /**
     * In case any of the segment rules has been updated - we want to reset
     * the filter selection, since the rules effect which filter terms will be provided.
     */
    useEffect(() => {
        handleFilterItemSelect(defaultFilterItemId);
    }, [segmentRules]);

    const renderDropdownChildren = (): JSX.Element[] => {
        const isDefaultSelection = selectedFilterItemId === defaultFilterItemId;

        // Set the dropdown's button according to the selected filter item.
        // if the default filter item is selected - show the button's default text
        const dropdownButtonContent = isDefaultSelection ? (
            <SegmentUrlListFilterButtonDefaultText>
                {filterButtonText}
            </SegmentUrlListFilterButtonDefaultText>
        ) : (
            <SegmentUrlListFilterSelectedButtonText>
                {selectedFilterItemText}
            </SegmentUrlListFilterSelectedButtonText>
        );

        const filterButton = (
            <DropdownButton key={"dropdown-button"}>{dropdownButtonContent}</DropdownButton>
        );

        const defaultFilterItem = (
            <EllipsisDropdownItem id={defaultFilterItemId} key={"default-filter-item"}>
                All Strings
            </EllipsisDropdownItem>
        );

        const filterItems = filterTerms.map((term, index) => (
            <EllipsisDropdownItem id={`item-${index}`} key={term}>
                {term}
            </EllipsisDropdownItem>
        ));

        return [filterButton, defaultFilterItem, ...filterItems];
    };

    return (
        <Dropdown
            selectedIds={{ [selectedFilterItemId]: true }}
            onClick={handleFilterItemClick}
            hasSearch={true}
            searchPlaceHolder={filterButtonText}
            dropdownPopupPlacement="ontop-left"
            appendTo={appendTo}
            virtualize={true}
            width={"calc(100% - 48px)"}
            dropdownPopupHeight={300}
        >
            {renderDropdownChildren()}
        </Dropdown>
    );
};

SegmentUrlListFilter.propTypes = {
    filterTerms: PropTypes.arrayOf(PropTypes.string).isRequired,
    filterButtonText: PropTypes.string.isRequired,
    segmentRules: PropTypes.arrayOf(
        PropTypes.exact({
            type: PropTypes.oneOf([RuleTypes.include, RuleTypes.exclude]),
            words: PropTypes.arrayOf(PropTypes.string),
            exact: PropTypes.arrayOf(PropTypes.string),
            folders: PropTypes.arrayOf(PropTypes.string),
            exactURLS: PropTypes.arrayOf(PropTypes.string), //Folder as page.
        }),
    ).isRequired,
    onFilterTermSelect: PropTypes.func,
    appendTo: PropTypes.string,
};
