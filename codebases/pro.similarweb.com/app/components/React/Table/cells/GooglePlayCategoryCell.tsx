import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { Injector } from "common/ioc/Injector";

export const GooglePlayCategoryCell: StatelessComponent<ITableCellProps> = ({ value }) => {
    const swNavigator = Injector.get("swNavigator") as any,
        params = swNavigator.getParams(),
        link = swNavigator.href(
            "keywords-analysis",
            Object.assign(params, {
                category: value,
            }),
        );
    return (
        <div>
            <a href={link} title={value}>
                {value}
            </a>
        </div>
    );
};
GooglePlayCategoryCell.displayName = "GooglePlayCategoryCell";
