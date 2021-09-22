import * as React from "react";
import * as _ from "lodash";
import { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { SWReactTable } from "../../../components/React/Table/SWReactTable";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { AppCategoryTrendsTableColumnsConfigGen } from "./AppCategoryTrendsTableColumns";

interface ITrendsTableContainerProps {
    tableData: any;
    isLoading: boolean;
    isPlayStore: boolean;
}

export const AppCategoryTrendsTableContainer: FunctionComponent<ITrendsTableContainerProps> = ({
    ...props
}) => {
    const [sortedColumn, setSortedColumn] = useState<{
        field: string;
        sortDirection: "desc" | "asc";
    }>({ field: undefined, sortDirection: undefined });

    const onSort = ({ field, sortDirection }) => {
        setSortedColumn({
            field,
            sortDirection,
        });
    };

    const render = () => {
        const { isLoading, tableData, isPlayStore } = props;
        let filteredData = tableData;
        if (!isLoading && filteredData && sortedColumn.field) {
            filteredData = _.orderBy(filteredData, sortedColumn.field, sortedColumn.sortDirection);
        }
        const tableProps = {
            onSort,
            isLoading,
            tableData: { Data: filteredData },
            tableColumns: AppCategoryTrendsTableColumnsConfigGen(
                sortedColumn.field,
                sortedColumn.sortDirection,
                isPlayStore,
            ),
            tableOptions: {
                metric: "AppCategoryTrends",
            },
        };

        return (
            <TableWrapper loading={isLoading}>
                <SWReactTable {...tableProps} />
            </TableWrapper>
        );
    };
    return render();
};

SWReactRootComponent(AppCategoryTrendsTableContainer, "AppCategoryTrendsTableContainer");

const TableWrapper: any = styled.div`
    pointer-events: ${({ loading }: any) => (loading ? "none" : "all")};
`;
TableWrapper.displayName = "TableWrapper";
