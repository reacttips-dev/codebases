import * as _ from "lodash";
import { SWReactIcons } from "@similarweb/icons";
import { IDropdownItem, SimpleDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import * as React from "react";
import { StatelessComponent } from "react";
import { FiltersBarDropdown } from "../filters-bar-dropdown/FiltersBarDropdown";
import { FiltersBarDropdownButton } from "../filters-bar-dropdown/FiltersBarDropdownButton";
import "./AppStoreFilter.scss";

export interface IAppStoreFilterItem extends IDropdownItem {
    icon?: string;
}

export interface IAppStoreFilterProps {
    onChange: (itemId: number) => void;
    selectedIds: object;
    onToggle?: (isOpen: boolean) => void;
    height?: number | string;
    width?: number | string;
    items: IAppStoreFilterItem[];
    disabled?: boolean;
}

export const AppStoreFilter: StatelessComponent<IAppStoreFilterProps> = (props) => {
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
    const items = props.items.map((item: any, index) => {
        return (
            <SimpleDropdownItem className="AppStoreFilter-DropdownItem" key={index} id={item.id}>
                <div className="AppStoreFilter-DropdownItem-icon-container">
                    <SWReactIcons iconName={item.icon} />
                    <div className="AppStoreFilter-DropdownItem-icon-container-content">
                        {item.text}
                    </div>
                </div>
            </SimpleDropdownItem>
        );
    });
    const contents = [button, ...items];
    return (
        <FiltersBarDropdown
            disabled={props.disabled}
            onClick={props.onChange}
            selectedIds={props.selectedIds}
            closeOnItemClick={true}
            width={221}
            appendTo="body"
            onToggle={props.onToggle}
        >
            {contents}
        </FiltersBarDropdown>
    );
};

AppStoreFilter.displayName = "AppStoreFilter";
AppStoreFilter.defaultProps = {
    height: 70,
    width: 178,
    disabled: false,
    onToggle: (isOpen: boolean) => null,
};

const createButton = (icon, text, width, height, disabled) => {
    return (
        <FiltersBarDropdownButton key={0} width={width} height={height} disabled={disabled}>
            <div className={"AppStoreFilter-dropdownButton"}>
                <SWReactIcons iconName={icon} />
                <div className="AppStoreFilter-dropdownButton-content">{text}</div>
            </div>
        </FiltersBarDropdownButton>
    );
};
