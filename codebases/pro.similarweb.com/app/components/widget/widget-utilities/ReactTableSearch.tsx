import React, { Component } from "react";
import { IReactWidgetUtilityComponentProps } from "components/widget/widget-utilities/react-component";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { TableWidget } from "components/widget/widget-types/TableWidget";
import autobind from "autobind-decorator";
import PropTypes from "prop-types";
import * as _ from "lodash";

export interface IReactTableWidgetUtilityComponentProps
    extends IReactWidgetUtilityComponentProps<TableWidget> {
    param: string;
    column: string;
    operator: string;
    type: string;
    placeholder?: string;
}

export class ReactTableSearch extends Component<IReactTableWidgetUtilityComponentProps, any> {
    static defaultProps = {
        param: "filter",
        column: "Domain",
        operator: "contains",
        type: "string",
        placeholder: "",
    };

    static propTypes = {
        param: PropTypes.string.isRequired,
        column: PropTypes.string.isRequired,
        operator: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        $scope: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        utility: PropTypes.object.isRequired,
        placeholder: PropTypes.string,
    };

    constructor(props) {
        super(props);
        const { $scope } = this.props;
        this.state = {
            clearValue: false,
        };
        $scope.$on("clear-utility-filter", () => {
            this.setState({
                clearValue: true,
            });
        });
    }

    @autobind
    onChange(value) {
        const { widget, utility, param, column: name, operator, type } = this.props;
        const tableWidget = widget as TableWidget;
        tableWidget.page = 1;
        _.set(widget, "data.page", 1); //for the client side pagination
        tableWidget.setFilterParam({
            param,
            name,
            type,
            operator,
            value,
        });
    }

    componentDidUpdate() {
        if (this.state.clearValue) {
            setTimeout(() => {
                this.setState({
                    clearValue: false,
                });
            }, 100);
        }
    }

    render() {
        return (
            <SearchInput
                onChange={this.onChange}
                clearValue={this.state.clearValue}
                placeholder={this.props.placeholder}
            />
        );
    }
}

export default ReactTableSearch;
