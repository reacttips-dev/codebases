import React, { StatelessComponent } from "react";
import Filter from "./Filter";
import { sortFields } from "../../availableFilters";
import {
    DropdownButtonStyled,
    CheckableDropdownItem,
    ConfigDropDown,
} from "@similarweb/ui-components/dist/dropdown";

const SortByField: StatelessComponent<any> = ({
    selectedSortField,
    onSort,
    onSortDropDownToggle,
    selectedChannel,
}) => {
    const items = sortFields[selectedChannel].map((item) => ({
        ...item,
        key: item.id,
        children: item.text,
    }));
    const selectedFieldItem = items.find(({ value }) => value === selectedSortField);
    return (
        <Filter fieldName="Sort By">
            <ConfigDropDown
                items={items}
                selectedItemId={selectedFieldItem.id}
                ItemComponent={CheckableDropdownItem}
                ButtonComponent={DropdownButtonStyled}
                width="auto"
                onClick={onSort}
                onToggle={onSortDropDownToggle}
            />
        </Filter>
    );
};

export default SortByField;
