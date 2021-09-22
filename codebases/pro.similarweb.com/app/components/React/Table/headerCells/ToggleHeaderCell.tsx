import * as React from "react";
import * as classNames from "classnames";
import { StatelessComponent } from "react";
import { ITableHeaderCellProps } from "../interfaces/ITableCellProps";

export const ToggleHeaderCell: StatelessComponent<ITableHeaderCellProps> = (props) => {
    const { fields, field, onColumnReformat, className } = props;
    return (
        <div className={`toggle-header-cell ${className}`}>
            {fields.map((item, index) => {
                return (
                    <button
                        key={index}
                        className={classNames(
                            "widget-toggle-button widget-toggle-button-table",
                            item.field === field ? "widget-toggle-button--active" : "",
                        )}
                        onClick={() => {
                            onColumnReformat(props, item);
                        }}
                    >
                        <i className={`toggle-header-cell-icon sw-icon-${item.symbol}`} />
                    </button>
                );
            })}
        </div>
    );
};
ToggleHeaderCell.displayName = "ToggleHeaderCell";
