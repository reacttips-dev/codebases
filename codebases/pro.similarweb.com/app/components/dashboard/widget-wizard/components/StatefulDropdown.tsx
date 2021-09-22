import * as React from "react";
import { Component, ComponentType } from "react";
import {
    Dropdown,
    DropdownButton,
    SimpleDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import SWReactRootComponent from "decorators/SWReactRootComponent";

interface StatefulDropdownProps {
    selectedId: string;
    items: any[];
    onSelect: any;
    disabled?: boolean;
    hasSearch?: boolean;
    DropDownButtonComponent?: ComponentType<any>;
    DropDownItemComponent?: ComponentType<any>;
    footerComponent?: ComponentType<any>;
    searchPlaceHolder?: string;
    title?: string;
    setRef?: any;
}

@SWReactRootComponent
export class StatefulDropdown extends Component<StatefulDropdownProps, { selectedId: string }> {
    static defaultProps = {
        disabled: false,
        DropDownButtonComponent: DropdownButton,
        DropDownItemComponent: SimpleDropdownItem,
        hasSearch: false,
        footerComponent: null,
        title: "",
    };

    public static getDerivedStateFromProps(props, state) {
        if (state.selectedId !== props.selectedId) {
            return {
                selectedId: props.selectedId,
            };
        }

        return null;
    }

    constructor(props) {
        super(props);
        this.state = { selectedId: props.selectedId };
    }

    public render() {
        const onSelect = (item) => {
            this.setState({ selectedId: item.id });
            this.props.onSelect(item);
        };

        const selectedItem = this.getSelectedItem(this.state.selectedId);
        const { DropDownButtonComponent, DropDownItemComponent, title } = this.props;

        const content = [
            <DropDownButtonComponent
                disabled={this.props.disabled}
                key={`${this.state.selectedId}BtnContainer`}
                hasValue={this.state.selectedId !== ""}
            >
                {selectedItem ? selectedItem.text : title}
            </DropDownButtonComponent>,
            ...this.props.items,
        ];
        return (
            <Dropdown
                selectedIds={{ [this.state.selectedId]: true }}
                onClick={onSelect}
                itemsComponent={DropDownItemComponent}
                disabled={this.props.disabled}
                hasSearch={this.props.hasSearch}
                searchPlaceHolder={this.props.searchPlaceHolder || null}
                footerComponent={this.props.footerComponent}
                ref={this.props.setRef}
            >
                {content}
            </Dropdown>
        );
    }

    private getSelectedItem = (selected: string | boolean | number) => {
        if (selected && typeof selected !== "string") {
            selected = selected.toString();
        }
        return this.props.items.find((item) => item.id === selected);
    };
}
