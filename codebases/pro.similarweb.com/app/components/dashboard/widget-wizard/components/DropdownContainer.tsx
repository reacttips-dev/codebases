import * as _ from "lodash";
import * as PropTypes from "prop-types";
import * as React from "react";
import { Dropdown, IDropdownChild, IDropdownProps } from "@similarweb/ui-components/dist/dropdown";
import { ComponentType, ReactElement } from "react";

interface IDropdownContainerProps extends IDropdownProps<any> {
    showCountryFlag?: boolean;
    onSelect: (item) => void;
    initialSelection?: any;
}

export class DropdownContainer extends React.PureComponent<IDropdownContainerProps, any> {
    public static getDerivedStateFromProps(props, state) {
        const newState = {
            selectedIds: props.initialSelection,
        };
        if (!_.find(props.children, { id: parseInt(Object.keys(props.initialSelection)[0], 10) })) {
            newState["buttonText"] = this.getInitialSelectedText(props);
        }

        return newState;
    }

    public static getInitialSelectedText = (props) => {
        let selectedCountryId = parseInt(Object.keys(props.initialSelection)[0], 10);
        let selectedItem: any = _.find(props.children, { id: selectedCountryId });
        if (!selectedItem) {
            selectedItem = props.children[1];
            selectedCountryId = props.children[1].id;
        }
        if (!props.showCountryFlag) {
            return selectedItem.text;
        } else {
            return [
                <i
                    key={selectedCountryId}
                    className={`DropdownItem-countryFlag country-icon-${selectedCountryId}`}
                />,
                selectedItem.text,
            ];
        }
    };

    public static propTypes = {
        initialSelection: PropTypes.object,
        buttonText: PropTypes.any, // Rendered within children: can be string / component / HTML element ...
    };

    public static defaultProps = {
        initialSelection: {},
        buttonText: "Please Select",
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedIds: props.initialSelection,
            buttonText: DropdownContainer.getInitialSelectedText(props),
        };
    }

    public onClick = (newItem) => {
        this.setState({
            selectedIds: { [newItem.id]: true },
            buttonText: this.getButtontext(newItem),
        });
        this.props.onSelect(newItem);
    };

    public getButtontext = (newItem) => {
        if (!this.props.showCountryFlag) {
            return newItem.children;
        } else {
            return [
                <i className={`DropdownItem-countryFlag country-icon-${newItem.id}`} />,
                newItem.children,
            ];
        }
    };

    public render() {
        // text in dropdown button is changing on item click -> change its children's prop
        const newChildren = [
            React.cloneElement(
                this.props.children[0] as ReactElement<any>,
                { key: "dropdown-button" },
                this.state.buttonText,
            ),
            ...(this.props.children as IDropdownChild[]).slice(1),
        ];
        return (
            <Dropdown selectedIds={this.state.selectedIds} onClick={this.onClick} {...this.props}>
                {newChildren}
            </Dropdown>
        );
    }
}
