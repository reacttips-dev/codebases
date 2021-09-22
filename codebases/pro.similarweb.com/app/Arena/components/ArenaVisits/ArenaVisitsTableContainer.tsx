import * as _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { SWReactTableOptimized } from "../../../components/React/Table/SWReactTableOptimized";
import { TableWrapper } from "../../StyledComponents";
import { ArenaTableColumnsConfigGen } from "./ArenaVisitsTableConfig";

export interface IArenaVisitsTableContainerProps {
    tableData: any;
    isLoading?: boolean;
    unbounceVisitsOnly?: boolean;
}

export interface IArenaVisitsTableContainerState {
    sortedColumn: {
        field: string;
        sortDirection: "desc" | "asc";
    };
}

export class ArenaVisitsTableContainer extends Component<
    IArenaVisitsTableContainerProps,
    IArenaVisitsTableContainerState
> {
    constructor(props) {
        super(props);
        this.state = {
            sortedColumn: {
                field: "TrafficShare",
                sortDirection: "desc",
            },
        };
    }

    public onSort = ({ field, sortDirection }) => {
        this.setState({
            sortedColumn: {
                field,
                sortDirection,
            },
        });
    };

    public render() {
        const { isLoading, unbounceVisitsOnly, tableData } = this.props;
        let filteredData;
        const { sortedColumn } = this.state;
        if (!isLoading && tableData.Data) {
            filteredData = _.orderBy(
                tableData.Data,
                sortedColumn.field,
                sortedColumn.sortDirection,
            );
        }
        const tableProps = {
            onSort: this.onSort,
            type: "regular",
            isLoading,
            tableData: { Data: filteredData },
            tableColumns: ArenaTableColumnsConfigGen(
                this.state.sortedColumn.field,
                this.state.sortedColumn.sortDirection,
                unbounceVisitsOnly,
            ),
            tableOptions: {
                metric: "MarketingWorkspaceArenaVisitsTable",
            },
        };

        return (
            <TableWrapper isLoading={isLoading}>
                <SWReactTableOptimized {...tableProps} />
            </TableWrapper>
        );
    }
}
