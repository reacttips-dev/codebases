import * as React from "react";
import * as classNames from "classnames";
import { StatelessComponent } from "react";
import { PlainTooltip } from "../../Tooltip/PlainTooltip/PlainTooltip";
import { i18nFilter } from "filters/ngFilters";

export const AllRowSelection: StatelessComponent<any> = (props) => {
    const { cell } = props;
    const tooltipText: string = i18nFilter()("Table.CheckAll.Tooltip");

    let template: JSX.Element = (
        <div
            className={classNames("row-selection all-rows-selection", {
                "row-selection--selected": cell.selected,
            })}
        >
            <div className="row-selection-indicator"></div>
            <PlainTooltip
                cssClass={"plainTooltip-element plainTooltip-element--header"}
                placement={"top"}
                text={tooltipText}
            >
                <div className="row-selection-checkbox" onClick={(e) => props.onCheckAll(cell)}>
                    <i className="sw-icon-checkmark-table"></i>
                </div>
            </PlainTooltip>
        </div>
    );
    return template;
};
