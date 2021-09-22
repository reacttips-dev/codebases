import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";

//
// /**
//  * Created by Eran.Shain on 6/15/2016.
//  */
//
export const getWebsiteTypeOptions = () => {
    return [
        {
            id: "2",
            text: "topsites.table.site.functionality.filter.transactional",
            tooltipText: i18nFilter()(
                "topsites.table.site.functionality.filter.transactional.tooltip",
            ),
        },
        {
            id: "4",
            text: "topsites.table.site.functionality.filter.news",
            tooltipText: i18nFilter()("topsites.table.site.functionality.filter.news.tooltip"),
        },
        {
            id: "1",
            text: "topsites.table.site.functionality.filter.other",
            tooltipText: i18nFilter()("topsites.table.site.functionality.filter.other.tooltip"),
        },
    ];
};

export const websiteTypeItems = getWebsiteTypeOptions().map((websiteType) => {
    const i18n = i18nFilter();
    return (
        <EllipsisDropdownItem
            key={websiteType.text}
            id={websiteType.id}
            tooltipText={websiteType.tooltipText}
            text={i18n(websiteType.text)}
        >
            {i18n(websiteType.text)}
        </EllipsisDropdownItem>
    );
});
