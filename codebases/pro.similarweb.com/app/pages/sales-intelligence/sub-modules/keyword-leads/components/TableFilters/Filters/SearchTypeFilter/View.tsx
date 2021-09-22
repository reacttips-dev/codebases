import React from "react";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { capitalize } from "../../../../utils";
import { SearchFilterPropsType } from "../../../../types";
import { useTranslation } from "components/WithTranslation/src/I18n";

export const SearchTypeFilter = ({
    searchTypes,
    selectedSearchType,
    onSelectSearchType,
    isFetching,
}: SearchFilterPropsType) => {
    const translate = useTranslation();

    const items =
        searchTypes && searchTypes.length
            ? searchTypes.map(({ text, id, count }) => {
                  const renderText = `${capitalize(text)} (${count})`;
                  return (
                      <EllipsisDropdownItem iconName={null} text={text} key={text} id={id}>
                          {renderText}
                      </EllipsisDropdownItem>
                  );
              })
            : [];

    const handleEmpty = (): void => onSelectSearchType(null);
    const handleClick = (item): void => onSelectSearchType(item);

    return (
        <ChipDownContainer
            tooltipDisabled
            width={280}
            dropdownPopupHeight={1000}
            hasSearch
            selectedText={selectedSearchType}
            buttonText={translate("si.pages.keyword_leads.search_type_text")}
            onClick={handleClick}
            onCloseItem={handleEmpty}
            disabled={isFetching}
        >
            {items}
        </ChipDownContainer>
    );
};
