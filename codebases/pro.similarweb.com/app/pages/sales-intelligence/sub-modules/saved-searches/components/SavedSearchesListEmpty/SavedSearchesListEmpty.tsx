import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import ListsEmptySection from "pages/sales-intelligence/pages/my-lists/components/ListsEmptySection/ListsEmptySection";

type SavedSearchesListEmptyProps = {
    name: string;
    renderNewSearchButton(): React.ReactNode;
};

const SavedSearchesListEmpty = (props: SavedSearchesListEmptyProps) => {
    const { name, renderNewSearchButton } = props;
    const translate = useTranslation();

    return (
        <ListsEmptySection
            name={name}
            imageName="empty-state-dynamic-list"
            renderActionButton={renderNewSearchButton}
            description={translate("si.pages.my_lists.section.saved_searches.empty_description")}
        />
    );
};

export default SavedSearchesListEmpty;
