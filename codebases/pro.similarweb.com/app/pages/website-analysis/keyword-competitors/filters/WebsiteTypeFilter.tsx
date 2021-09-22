import { i18nFilter } from "filters/ngFilters";
import React, { useContext } from "react";
import { EllipsisDropdownItem, ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { useKeywordCompetitorsPageContext } from "pages/website-analysis/keyword-competitors/KeywordCompetitorsPageContext";
export const getWebsiteTypeOptions = () => {
    return [
        {
            id: "Transactional",
            text: "topsites.table.site.functionality.filter.transactional",
            tooltipText: i18nFilter()(
                "topsites.table.site.functionality.filter.transactional.tooltip",
            ),
        },
        {
            id: "ContentPublishing",
            text: "topsites.table.site.functionality.filter.news",
            tooltipText: i18nFilter()("topsites.table.site.functionality.filter.news.tooltip"),
        },
        {
            id: "Unknown",
            text: "topsites.table.site.functionality.filter.other",
            tooltipText: i18nFilter()("topsites.table.site.functionality.filter.other.tooltip"),
        },
    ];
};
const i18n = i18nFilter();
export const WebsiteTypeFilter: React.FC = () => {
    const websiteTypeItems = getWebsiteTypeOptions().map((websiteType) => {
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
    const { onSelectWebsiteType, selectedWebsiteType } = useKeywordCompetitorsPageContext();
    const selectedText =
        selectedWebsiteType &&
        getWebsiteTypeOptions().find((type) => type.id === selectedWebsiteType).text;
    const selectedIds = selectedWebsiteType ? { [selectedWebsiteType]: true } : {};
    return (
        <ChipDownContainer
            width={280}
            hasSearch={false}
            selectedIds={selectedIds}
            selectedText={i18n(selectedText)}
            buttonText={i18n("analysis.source.search.keywords.filters.websitetype")}
            onClick={onSelectWebsiteType}
            onCloseItem={() => onSelectWebsiteType(null)}
        >
            {websiteTypeItems}
        </ChipDownContainer>
    );
};
