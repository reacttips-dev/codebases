import {
    Dropdown,
    DropdownItem,
    WebSourceDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import * as React from "react";
import { ComponentType, StatelessComponent } from "react";
import * as _ from "lodash";
import { FiltersBarDropdownButton } from "../../../../components/filters-bar/filters-bar-dropdown/FiltersBarDropdownButton";
import { FiltersBarDropdown } from "components/filters-bar/filters-bar-dropdown/FiltersBarDropdown";

export interface IPaidOrganicFilterProps {
    onChange: (itemId: number) => void;
    selectedIds: object;
    height?: number | string;
    disabled?: boolean;
    onToggle?: (isOpen: boolean) => void;
    itemWrapper?: ComponentType<any>;
    dropdownPopupPlacement?: string;
    websource?: "Desktop" | "MobileWeb";
}

// helper function
export const getPaidOrganicFilterItems = (websource: string) => {
    const items = [
        ...(websource === "Desktop"
            ? [
                  {
                      id: "both",
                      text: "Organic & Paid",
                  },
              ]
            : []),
        {
            id: "organic",
            text: "Organic",
        },
        ...(websource === "Desktop"
            ? [
                  {
                      id: "paid",
                      text: "Paid",
                  },
              ]
            : []),
    ];
    return items;
};

export const PaidOrganicFilter: StatelessComponent<IPaidOrganicFilterProps> = (props) => {
    const items = getPaidOrganicFilterItems(props.websource);
    const selectedId = Object.keys(props.selectedIds)[0];
    const selectedItem = _.find(items, { id: selectedId });
    const selectedText = selectedItem.text;
    const button = createButton(selectedText, props.height);
    const contents = [button, ...items];
    return (
        <FiltersBarDropdown
            onClick={props.onChange}
            cssClassContainer="PaidOrganicFilter"
            selectedIds={props.selectedIds}
            itemsComponent={WebSourceDropdownItem}
            closeOnItemClick={true}
            width={221}
            itemWrapper={props.itemWrapper}
            onToggle={props.onToggle}
            appendTo={null}
            dropdownPopupPlacement={props.dropdownPopupPlacement}
        >
            {contents}
        </FiltersBarDropdown>
    );
};

PaidOrganicFilter.displayName = "PaidOrganicFilter";

function createButton(text, height) {
    return (
        <FiltersBarDropdownButton key={0} width={162} height={height}>
            <div className={"WebSourceFilter-dropdownButton"}>
                <div>{text}</div>
            </div>
        </FiltersBarDropdownButton>
    );
}
