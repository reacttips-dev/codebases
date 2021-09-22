import React from "react";
import { StyledOpportunitiesListEmpty } from "./styles";
import { useTranslation } from "components/WithTranslation/src/I18n";
import ListsEmptySection from "pages/sales-intelligence/pages/my-lists/components/ListsEmptySection/ListsEmptySection";

type OpportunitiesListEmptyProps = {
    name: string;
    renderAddListButton(): React.ReactNode;
};

const OpportunitiesListEmpty = (props: OpportunitiesListEmptyProps) => {
    const { name, renderAddListButton } = props;
    const translate = useTranslation();

    return (
        <StyledOpportunitiesListEmpty>
            <ListsEmptySection
                name={name}
                imageName="empty-state-static-list"
                renderActionButton={renderAddListButton}
                description={translate(
                    "si.pages.my_lists.section.opportunity_lists.empty_description",
                )}
            />
        </StyledOpportunitiesListEmpty>
    );
};

export default OpportunitiesListEmpty;
