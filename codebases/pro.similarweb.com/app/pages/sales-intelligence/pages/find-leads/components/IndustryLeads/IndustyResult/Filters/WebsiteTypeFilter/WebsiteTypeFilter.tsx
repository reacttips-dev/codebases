import React from "react";
import { EllipsisDropdownItem, ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { useTableContext } from "../../TableContextProvider";
import { useTranslation } from "components/WithTranslation/src/I18n";

export const WebsiteTypeFilter = (): JSX.Element => {
    const translate = useTranslation();
    const { onSelectWebsiteType, selectedWebsiteType, isLoading } = useTableContext();

    const getWebsiteTypeOptions = () => {
        return [
            {
                id: "Transactional",
                text: "topsites.table.site.functionality.filter.transactional",
                tooltipText: translate(
                    "topsites.table.site.functionality.filter.transactional.tooltip",
                ),
            },
            {
                id: "ContentPublishing",
                text: "topsites.table.site.functionality.filter.news",
                tooltipText: translate("topsites.table.site.functionality.filter.news.tooltip"),
            },
            {
                id: "Unknown",
                text: "topsites.table.site.functionality.filter.other",
                tooltipText: translate("topsites.table.site.functionality.filter.other.tooltip"),
            },
        ];
    };

    const websiteTypeItems = getWebsiteTypeOptions().map((websiteType) => {
        return (
            <EllipsisDropdownItem
                key={websiteType.text}
                id={websiteType.id}
                tooltipText={websiteType.tooltipText}
                text={translate(websiteType.text)}
            >
                {translate(websiteType.text)}
            </EllipsisDropdownItem>
        );
    });

    const selectedText =
        selectedWebsiteType &&
        getWebsiteTypeOptions().find((type) => type.id === selectedWebsiteType).text;
    const selectedIds = selectedWebsiteType ? { [selectedWebsiteType]: true } : {};
    return (
        <ChipDownContainer
            width={280}
            hasSearch={false}
            selectedIds={selectedIds}
            selectedText={translate(selectedText)}
            buttonText={translate("analysis.source.search.keywords.filters.websitetype")}
            onClick={onSelectWebsiteType}
            onCloseItem={() => onSelectWebsiteType(null)}
            disabled={isLoading}
        >
            {websiteTypeItems}
        </ChipDownContainer>
    );
};
