import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import * as React from "react";
import { FunctionComponent } from "react";
import UIComponentStateService from "services/UIComponentStateService";
import styled from "styled-components";

export const ColumnsPickerLiteProContainer = styled.div``;

export interface IColumnsPickerLiteProProps {
    tableColumns: any;
    onClickToggleColumns?: (key: number) => void;
    tableOptions?: { metric: string };
    onPickerToggle?: () => void;
    withTooltip?: boolean;
}

export const ColumnsPickerLitePro: FunctionComponent<IColumnsPickerLiteProProps> = (props) => {
    const { tableColumns, onClickToggleColumns, tableOptions } = props;
    const columnsTogglesKey = tableOptions.metric
        ? `${tableOptions.metric}_Table_columnsToggles`
        : false;
    const uiComponentState = UIComponentStateService;
    const onColumnToggle = (key) => {
        onClickToggleColumns(parseInt(key, 10));
        let visibleColumns;
        if (columnsTogglesKey) {
            visibleColumns = uiComponentState.getItem(columnsTogglesKey, "localStorage") || {};
            const columns = tableColumns.reduce((res, col, index) => {
                if (!col.fixed) {
                    res[col.field] =
                        index === parseInt(key, 10)
                            ? visibleColumns[col.field] !== undefined
                                ? !visibleColumns[col.field]
                                : !col.isVisible
                            : visibleColumns[col.field];
                }
                return res;
            }, {});
            uiComponentState.setItem(columnsTogglesKey, "localStorage", columns);
        }
    };
    const getColumnsPickerLiteProps = (): IColumnsPickerLiteProps => {
        let visibleColumns;
        if (columnsTogglesKey) {
            visibleColumns = uiComponentState.getItem(columnsTogglesKey, "localStorage");
        }
        const columns = tableColumns.reduce((res, col, index) => {
            if (!col.fixed) {
                return [
                    ...res,
                    {
                        key: index.toString(),
                        displayName: col.displayName,
                        visible:
                            visibleColumns && visibleColumns[col.field] !== undefined
                                ? visibleColumns[col.field]
                                : col.visible,
                    },
                ];
            }
            return res;
        }, []);
        return {
            columns,
            onColumnToggle,
            onPickerToggle: props.onPickerToggle,
            maxHeight: 264,
            width: "auto",
        };
    };
    return (
        <ColumnsPickerLiteProContainer>
            <ColumnsPickerLite {...getColumnsPickerLiteProps()} withTooltip={props.withTooltip} />
        </ColumnsPickerLiteProContainer>
    );
};

ColumnsPickerLitePro.defaultProps = {
    onPickerToggle: () => null,
};
