import { Injector } from "common/ioc/Injector";
import {
    categoryIconFilter,
    i18nCategoryFilter,
    parentCategoryFilter,
    subCategoryFilter,
} from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { trackEvent } from "../SWReactTableUtils";

interface IReferringCategoryCell extends ITableCellProps {
    getLink?: (value: string) => string;
}
export const ReferringCategoryCell: StatelessComponent<IReferringCategoryCell> = ({
    value,
    tableOptions,
    getLink,
}) => {
    let finalLink;
    if (getLink) {
        finalLink = getLink(value);
    } else {
        const swNavigator = Injector.get<any>("swNavigator");
        const params = swNavigator.getParams();
        const curState = swNavigator.current().name;
        finalLink = swNavigator.href(
            curState,
            Object.assign(params, {
                referralsCategory: value,
            }),
        );
    }

    return (
        <div className="swTable-categoryCell">
            <i
                className={`sprite-category u-right-padding-6 ${categoryIconFilter()(
                    parentCategoryFilter()(value),
                )}`}
            />
            {value === "-" ? (
                <span>{subCategoryFilter()(value)}</span>
            ) : (
                <a
                    title={i18nCategoryFilter()(value)}
                    href={finalLink}
                    onClick={() => {
                        trackEvent(tableOptions, "Internal Link", value, "click");
                    }}
                >
                    {subCategoryFilter()(value)}
                </a>
            )}
        </div>
    );
};
ReferringCategoryCell.displayName = "ReferringCategoryCell";
