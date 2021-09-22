import React from "react";
import { EllipsisDropdownItem, ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { WebsiteFilterPropsType } from "../../../../types";

export const WebsiteTypeFilter = ({
    onSelectWebsiteType,
    selectedWebsiteType,
    isFetching,
}: WebsiteFilterPropsType): JSX.Element => {
    const translate = useTranslation();

    const getWebsiteTypeOptions = () => {
        return [
            {
                id: "2",
                text: "topsites.table.site.functionality.filter.transactional",
                tooltipText: translate(
                    "topsites.table.site.functionality.filter.transactional.tooltip",
                ),
            },
            {
                id: "4",
                text: "topsites.table.site.functionality.filter.news",
                tooltipText: translate("topsites.table.site.functionality.filter.news.tooltip"),
            },
            {
                id: "1",
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
        getWebsiteTypeOptions().find((type) => type.id === selectedWebsiteType.id).text;

    return (
        <ChipDownContainer
            width={280}
            hasSearch={false}
            selectedText={translate(selectedText)}
            buttonText={translate("analysis.source.search.keywords.filters.websitetype")}
            onClick={onSelectWebsiteType}
            onCloseItem={() => onSelectWebsiteType(null)}
            disabled={isFetching}
        >
            {websiteTypeItems}
        </ChipDownContainer>
    );
};
