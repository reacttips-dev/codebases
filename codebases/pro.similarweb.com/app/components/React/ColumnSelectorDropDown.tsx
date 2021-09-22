import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import angular from "angular";
import { ColumnsPickerLitePro } from "components/ColumnsPickerLitePro/ColumnsPickerLitePro";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import * as React from "react";

export const ColumnSelectorDropDown: FunctionComponent<any> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const onClickToggleColumns = (key) => {
        props.toggleColumn(props.column[key], key);
    };
    const onPickerToggle = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);
    const classes = `swColumnSelector ${isOpen ? "is-opened" : "is-closed"}`;
    return (
        <div className={classes}>
            <ColumnsPickerLitePro
                tableColumns={props.column}
                tableOptions={{ metric: props.key }}
                onClickToggleColumns={onClickToggleColumns}
                withTooltip={true}
                onPickerToggle={onPickerToggle}
            />
        </div>
    );
};

export default SWReactRootComponent(ColumnSelectorDropDown, "ColumnSelectorDropDown");
