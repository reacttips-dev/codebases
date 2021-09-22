import React from "react";
import { EllipsisDropdownItem, ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { KEYWORD_LEADS_SEARCH_SELECT } from "pages/sales-intelligence/pages/find-leads/constants/keywordLeads";
import { capitalize } from "../../../../utils";
import { SourceFilterPropsType } from "../../../../types";

export const SourceTypeFilter = ({
    selectedSourceType,
    sourceTypeOptions = [],
    onSelectSourceType,
    isFetching,
}: SourceFilterPropsType): JSX.Element => {
    const translate = useTranslation();

    const handleChange = (selected: { id: string; text: string }): void => {
        onSelectSourceType(selected.text);
    };

    const handleEmpty = (selected: null): void => {
        onSelectSourceType(selected);
    };

    const websiteTypeItems =
        sourceTypeOptions && sourceTypeOptions.length
            ? sourceTypeOptions.map(({ text, id, count }) => {
                  const capitalized = capitalize(text);
                  return (
                      <EllipsisDropdownItem key={text} id={id} text={text}>
                          {`${capitalized} (${count})`}
                      </EllipsisDropdownItem>
                  );
              })
            : [];

    return (
        <ChipDownContainer
            tooltipDisabled
            width={280}
            hasSearch
            selectedText={capitalize(selectedSourceType)}
            buttonText={translate(KEYWORD_LEADS_SEARCH_SELECT)}
            onClick={handleChange}
            onCloseItem={() => handleEmpty(null)}
            disabled={isFetching}
        >
            {websiteTypeItems}
        </ChipDownContainer>
    );
};
