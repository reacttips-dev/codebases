import * as _ from "lodash";
import { IDropdownItem, SimpleDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import * as classNames from "classnames";
import * as React from "react";
import { StatelessComponent } from "react";
import { FiltersBarDropdown } from "../filters-bar-dropdown/FiltersBarDropdown";
import { FiltersBarDropdownButton } from "../filters-bar-dropdown/FiltersBarDropdownButton";
import "./DropdownFilter.scss";

export interface IDropdownFilterItem extends IDropdownItem {
    icon?: string;
    children: IDropdownFilterItem[];
}

export interface IDropdownFilterProps {
    onChange: (itemId: number) => void;
    selectedIds: object;
    onToggle?: (isOpen: boolean) => void;
    height?: number | string;
    width?: number | string;
    items: IDropdownFilterItem[];
    disabled?: boolean;
    hasSearch?: boolean;
    searchPlaceHolder?: string;
    cssClassContainer?: string;
}

export const DropdownFilter: StatelessComponent<IDropdownFilterProps> = (props) => {
    const selectedId = Object.keys(props.selectedIds)[0];
    const selectedItem = _.find(props.items, { id: selectedId });
    const selectedText = selectedItem.text;
    const button = createButton(
        selectedItem.icon,
        selectedText,
        props.width,
        props.height,
        props.disabled,
    );
    const items = [];
    props.items.forEach((item, index) => {
        items.push({
            ...item,
            key: index,
        });
    });
    const contents = [button, ...items];
    return (
        <FiltersBarDropdown
            cssClassContainer={`DropdownFilter ${props.cssClassContainer}`}
            hasSearch={props.hasSearch}
            disabled={props.disabled}
            onClick={props.onChange}
            selectedIds={props.selectedIds}
            itemsComponent={SimpleDropdownItem}
            shouldScrollToSelected={true}
            closeOnItemClick={true}
            width={221}
            appendTo="body"
            searchPlaceHolder={props.searchPlaceHolder}
            onToggle={props.onToggle}
        >
            {contents}
        </FiltersBarDropdown>
    );
};

DropdownFilter.displayName = "DropdownFilter";
DropdownFilter.defaultProps = {
    height: 70,
    width: 178,
    disabled: false,
    hasSearch: false,
    onToggle: (isOpen: boolean) => null,
};

const createButton = (icon, text, width, height, disabled) => {
    const classnames = classNames("DropdownFilter-dropdownButton-icon", `icon icon-${icon}`);
    return (
        <FiltersBarDropdownButton key={0} width={width} height={height} disabled={disabled}>
            <div className={"DropdownFilter-dropdownButton"}>
                <div className={classnames} />
                {text}
            </div>
        </FiltersBarDropdownButton>
    );
};
