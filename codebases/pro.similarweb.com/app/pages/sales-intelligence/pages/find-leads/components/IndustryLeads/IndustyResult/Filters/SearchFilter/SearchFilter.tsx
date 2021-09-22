import React from "react";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { useTableContext } from "../../TableContextProvider";

export const SearchFilter = () => {
    const translate = useTranslation();
    const { search, onSearch } = useTableContext();
    return (
        <SearchInput
            disableClear={true}
            defaultValue={search}
            debounce={400}
            onChange={onSearch}
            placeholder={translate("Search")}
        />
    );
};
