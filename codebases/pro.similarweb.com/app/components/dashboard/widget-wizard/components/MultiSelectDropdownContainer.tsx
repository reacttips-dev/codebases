import * as PropTypes from "prop-types";
import * as React from "react";
import { Dropdown, IDropdownChild } from "@similarweb/ui-components/dist/dropdown";

export class MultiSelectDropdownContainer extends React.PureComponent<
    { initialSelection: any; children: IDropdownChild[]; onItemClick: (id) => void },
    any
> {
    public static propTypes = {
        initialSelection: PropTypes.object,
        onItemClick: PropTypes.func,
    };

    public static getDerivedStateFromProps(props, state) {
        if (state.selectedIds !== props.initialSelection) {
            return {
                selectedIds: props.initialSelection,
            };
        }

        return null;
    }

    constructor(props) {
        super(props);
        this.state = {
            selectedIds: props.initialSelection,
        };
    }

    public onClick = (newItem) => {
        const newState = {
            selectedIds: {
                ...this.state.selectedIds,
                [newItem.id]: !this.state.selectedIds[newItem.id],
            },
        };
        this.setState(newState);
        this.props.onItemClick(newState.selectedIds);
    };

    public render() {
        return (
            <Dropdown
                selectedIds={this.state.selectedIds}
                onClick={this.onClick}
                closeOnItemClick={false}
                {...this.props}
            >
                {this.props.children}
            </Dropdown>
        );
    }
}
