import { Injector } from "common/ioc/Injector";
import { CategoryFilterCell } from "components/React/Table/cells";
import { ITableCellProps } from "components/React/Table/interfaces/ITableCellProps";
import React from "react";

const FILTERS_NAME = "websites_filters";

export const AdvertisingCategoryCell: React.FunctionComponent<ITableCellProps> = (args) => {
    const swNavigator = Injector.get<any>("swNavigator");
    const params = swNavigator.getParams();
    const websitesFilters = params[FILTERS_NAME];

    let filtersWithoutCategory = "";

    if (websitesFilters) {
        filtersWithoutCategory = websitesFilters.split("+").reduce((acc, item, idx) => {
            const tmp = item.split(";;");

            if (tmp[0] !== "category") {
                acc += `${idx === 0 ? "" : "+"}${item}`;
            }

            return acc;
        }, "");
    }

    const onItemCategoryClick = (type, value) => {
        swNavigator.go(swNavigator.current().name, {
            ...params,
            [FILTERS_NAME]: `${filtersWithoutCategory}+category;;${value}`,
        });
    };

    return <CategoryFilterCell {...args} onItemClick={onItemCategoryClick} />;
};
