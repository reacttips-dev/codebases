import * as React from "react";
import { PureComponent } from "react";
import { TableColumnToggle } from "./TableColumnToggle";
import * as _ from "lodash";

interface ITableColumnToggleGroupsProps {
    onClick: (any) => void;
    columns: any[];
    toggleGroups: any;
    popupWidth?: number;
}

interface ITableColumnToggleGroupsState {
    toggleGroups: any;
}

class TableColumnToggleGroups extends PureComponent<
    ITableColumnToggleGroupsProps,
    ITableColumnToggleGroupsState
> {
    static defaultProps = {
        popupWidth: 210,
    };

    constructor(props) {
        super(props);

        this.state = {
            toggleGroups: props.toggleGroups,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if (this.props.toggleGroups !== nextProps.toggleGroups) {
            this.setState({
                toggleGroups: nextProps.toggleGroups,
            });
        }
    }

    private onClickToggleGroups = (index) => {
        const toggleName = Object.keys(this.state.toggleGroups)[index];
        this.updateToggleGroupsState(toggleName);
        const visibleColumnsIndex = _.compact(
            this.props.columns.map((col, idx) => {
                if (col.toggleSection === toggleName) {
                    return idx;
                }
            }),
        );
        this.props.onClick(visibleColumnsIndex);
    };

    private updateToggleGroupsState(toggleName) {
        const value = this.state.toggleGroups[toggleName];
        this.setState({
            toggleGroups: {
                ...this.state.toggleGroups,
                [toggleName]: {
                    ...value,
                    visible: !value.visible,
                },
            },
        });
    }

    render() {
        return (
            <TableColumnToggle
                onClick={this.onClickToggleGroups}
                columns={Object.values(this.state.toggleGroups)}
                popupWidth={this.props.popupWidth}
            />
        );
    }
}

export default TableColumnToggleGroups;
