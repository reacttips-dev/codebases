import {
    CheckboxDropdownItem,
    Dropdown,
    DropdownButton,
    SimpleDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { Injector } from "common/ioc/Injector";
import * as React from "react";
import SWReactRootComponent from "../../decorators/SWReactRootComponent";

@SWReactRootComponent
export class SneakpeekExistingQueries extends React.PureComponent<any, any> {
    private swNavigator;
    private module;

    constructor(props) {
        super(props);
        this.swNavigator = Injector.get("swNavigator");
        this.module = this.swNavigator.current().name.split(".")[0];
        this.state = {
            buttonText: props.title,
        };
    }

    public onClickSingle = (newItem) => {
        this.setState({
            buttonText: newItem.children,
        });
        this.props.onSelect(newItem.id);
    };

    public renderDropdown = () => {
        const dropdownProps = {
            selectedIds: this.props.selectedIds,
            width: this.props.width,
            hasSearch: true,
            appendTo: ".existing-queries-dropdown",
        };
        const dropdownChildren = [
            <DropdownButton key="existingQuery" width={this.props.width} height={40}>
                {Object.keys(this.props.selectedIds)[0] ? this.state.buttonText : this.props.title}
            </DropdownButton>,
            ...this.props.allQueries,
        ];
        if (this.props.allQueries.length) {
            if (this.props.multi) {
                return (
                    <Dropdown
                        onClick={(newItem) => this.props.onSelect(newItem.id)}
                        itemsComponent={CheckboxDropdownItem}
                        closeOnItemClick={false}
                        {...dropdownProps}
                    >
                        {dropdownChildren}
                    </Dropdown>
                );
            } else {
                return (
                    <Dropdown
                        onClick={this.onClickSingle}
                        itemsComponent={SimpleDropdownItem}
                        {...dropdownProps}
                    >
                        {dropdownChildren}
                    </Dropdown>
                );
            }
        }
    };

    public render() {
        return <div className="existing-queries-dropdown">{this.renderDropdown()}</div>;
    }
}
