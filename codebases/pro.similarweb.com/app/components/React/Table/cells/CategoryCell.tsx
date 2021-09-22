import { Injector } from "common/ioc/Injector";
import * as React from "react";
import {
    categoryIconFilter,
    categoryLinkFilter,
    i18nCategoryFilter,
    parentCategoryFilter,
    subCategoryFilter,
} from "../../../../filters/ngFilters";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { trackEvent } from "../SWReactTableUtils";
import { SwNavigator } from "common/services/swNavigator";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";

export const CategoryCell: React.FC<ITableCellProps> = ({
    value,
    row,
    metadata,
    isIconHidden,
    ignoreCustomCat,
}) => {
    let isLinkable = true;
    if (!value || value === "null") {
        value = "N/A";
        isLinkable = false;
    } else if (value.trim() === "Unknown") {
        isLinkable = false;
    }
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const params = swNavigator.getParams();
    const isCustomCategory = UserCustomCategoryService.isCustomCategory(params.category);
    const href = isCustomCategory
        ? swNavigator.href("industryAnalysis-overview", {
              ...params,
              category: UserCustomCategoryService.getCustomCategoryByName(value)?.forUrl,
          })
        : categoryLinkFilter(swNavigator)(value, row.MainCategory, ignoreCustomCat);

    return (
        <div className="swTable-categoryCell">
            {isLinkable ? (
                <>
                    {!isIconHidden && (
                        <i
                            className={`sprite-category u-right-padding-6 ${categoryIconFilter()(
                                parentCategoryFilter()(value),
                            )}`}
                        />
                    )}
                    <a
                        title={i18nCategoryFilter()(value)}
                        href={row.href || href}
                        onClick={() => {
                            trackEvent(metadata, "Internal Link", value, "click");
                        }}
                    >
                        {subCategoryFilter()(value)}
                    </a>
                </>
            ) : (
                subCategoryFilter()(value)
            )}
        </div>
    );
};
CategoryCell.displayName = "CategoryCell";
