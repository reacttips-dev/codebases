import { CheckboxIcon } from "@similarweb/ui-components/dist/dropdown";
import * as classNames from "classnames";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as React from "react";
import { useRef } from "react";
import { StatelessComponent } from "react";
import { PlainTooltip } from "../../Tooltip/PlainTooltip/PlainTooltip";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { trackEvent } from "../SWReactTableUtils";
import { SWReactTableWrapperContextConsumer } from "../SWReactTableWrapperSelectionContext";

const getPosition = (e) => {
    const rect = e.getBoundingClientRect();
    return {
        top: rect.top,
        left: rect.left,
    };
};

export const RowSelection: StatelessComponent<ITableCellProps> = (props) => {
    const ref = useRef<HTMLDivElement>(null);

    function toggleSelection(props, e) {
        if (props.row.selectable !== false) {
            const target = e.target;
            if (_.isFunction(props.track)) {
                props.track(props);
            } else {
                trackEvent(
                    props.tableOptions,
                    "Check box",
                    `${_.result(row, props.tableOptions.tableSelectionTrackingParam, "")}`,
                    row.selected ? "remove" : "add",
                );
            }
            props.onItemToggleSelection(row);
            const { top, left } = getPosition(ref.current);
            setTimeout(() => {
                const elementPointed = document.elementFromPoint(left, top);
                if (elementPointed !== target) {
                    $(".TableSelection").one("transitionend", () => {
                        const closestCell = $(elementPointed).closest(".swReactTableCell").get(0);
                        if (closestCell) {
                            closestCell.dispatchEvent(
                                new MouseEvent("mouseover", {
                                    view: window,
                                    bubbles: true,
                                    cancelable: true,
                                }),
                            );
                        }
                    });
                }
            }, 50);
        }
    }

    function getRowSelectionColor(row, isBorder?) {
        const color = isBorder && row.hideLeftBorder ? "" : row.selectionColor;
        return row.selected ? color : "";
    }

    const { row } = props;
    const isChild = row.parent;
    const tooltipText = i18nFilter()(row.tooltipText || "widget.table.selection.tooltip");
    const checkboxClass = classNames("row-selection-checkbox", {
        "checkbox-disabled": row.selectable === false,
    });
    const color = getRowSelectionColor(row) || null;

    return isChild ? null : (
        <div
            ref={ref}
            className={classNames("row-selection", { "row-selection--selected": row.selected })}
        >
            <div
                className="row-selection-indicator"
                style={{ backgroundColor: getRowSelectionColor(row, true) }}
            />
            <PlainTooltip
                cssClass="plainTooltip-element plainTooltip-element--header"
                placement="top"
                text={tooltipText}
                enabled={row.selectable === false}
            >
                <div onClick={(e) => toggleSelection(props, e)}>
                    <CheckboxIcon
                        disabled={row.selectable === false}
                        color={color}
                        selected={row.selected}
                    />
                </div>
            </PlainTooltip>
        </div>
    );
};

RowSelection.displayName = "RowSelection";

export const RowSelectionConsumer = (props) => {
    return (
        <SWReactTableWrapperContextConsumer>
            {({ onRowSelection, isRowSelected, getStoreRow }) => {
                const rowSelectionProps = {
                    ...props,
                    row: {
                        ...props.row,
                        ...getStoreRow(props.row),
                        selected: isRowSelected(props.row),
                    },
                    onItemToggleSelection: onRowSelection,
                };
                return <RowSelection {...rowSelectionProps} />;
            }}
        </SWReactTableWrapperContextConsumer>
    );
};
