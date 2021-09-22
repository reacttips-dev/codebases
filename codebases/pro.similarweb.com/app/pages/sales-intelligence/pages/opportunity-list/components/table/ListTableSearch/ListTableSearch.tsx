import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { StyledSearchContainer } from "../styles";

type ListTableSearchProps = {
    search: string;
    onSearch(string): void;
};

const SEARCH_DEBOUNCE = 800;
const ListTableSearch = (props: ListTableSearchProps) => {
    const translate = useTranslation();
    const { search, onSearch } = props;

    return (
        <StyledSearchContainer>
            <SearchInput
                onChange={onSearch}
                defaultValue={search}
                debounce={SEARCH_DEBOUNCE}
                placeholder={translate("si.pages.single_list.table.search.placeholder")}
            />
        </StyledSearchContainer>
    );
};

export default React.memo(ListTableSearch);
