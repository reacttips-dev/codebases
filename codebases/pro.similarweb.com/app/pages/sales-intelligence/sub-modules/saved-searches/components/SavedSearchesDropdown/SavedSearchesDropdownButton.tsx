import React from "react";
import { QueryBarItemSingle } from "@similarweb/ui-components/dist/query-bar/src/QueryBarItemSingle/QueryBarItemSingle";
import { renderIconImageComponent } from "@similarweb/ui-components/dist/query-bar/src/Common/QueryBarItemHelper";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { SavedSearchType } from "../../types";
import { getSearchName } from "../../helpers";
import { StyledImageContainer } from "./styles";

type SavedSearchesDropdownButtonProps = {
    savedSearch: SavedSearchType;
    onClick(): void;
};

const SavedSearchesDropdownButton = (props: SavedSearchesDropdownButtonProps) => {
    const { onClick, savedSearch } = props;
    const translate = useTranslation();

    return (
        <QueryBarItemSingle
            iconName="arrow"
            image="toggle-filters"
            onItemClick={onClick}
            text={getSearchName(savedSearch)}
            renderImageComponent={(props) => (
                <StyledImageContainer>{renderIconImageComponent(props)}</StyledImageContainer>
            )}
            secondaryText={translate("si.components.saved_searches_dropdown.secondary_text")}
        />
    );
};

export default SavedSearchesDropdownButton;
