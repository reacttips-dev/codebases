import React from "react";
import * as styles from "./styles";
import ListsEmptySection from "../ListsEmptySection/ListsEmptySection";
import { useTranslation } from "components/WithTranslation/src/I18n";

type OpportunityListsSectionEmptyProps = {
    name: string;
    renderAddListButton(): React.ReactNode;
};

const OpportunityListsSectionEmpty: React.FC<OpportunityListsSectionEmptyProps> = (props) => {
    const { name, renderAddListButton } = props;
    const translate = useTranslation();

    return (
        <styles.StyledOpportunityListsSectionEmpty>
            <ListsEmptySection
                name={name}
                imageName="empty-state-static-list"
                renderActionButton={renderAddListButton}
                description={translate(
                    "si.pages.my_lists.section.opportunity_lists.empty_description",
                )}
            />
        </styles.StyledOpportunityListsSectionEmpty>
    );
};

export default OpportunityListsSectionEmpty;
