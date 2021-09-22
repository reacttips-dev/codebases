import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { QueryBarItemSingle } from "@similarweb/ui-components/dist/query-bar/src/QueryBarItemSingle/QueryBarItemSingle";
import { renderIconImageComponent } from "@similarweb/ui-components/dist/query-bar/src/Common/QueryBarItemHelper";
import { OpportunityListType } from "../../../../../sub-modules/opportunities/types";

type ListsDropdownButtonProps = {
    list: OpportunityListType;
    onClick(): void;
};

const ListsDropdownButton = (props: ListsDropdownButtonProps) => {
    const { onClick, list } = props;
    const translate = useTranslation();

    return (
        <QueryBarItemSingle
            iconName="arrow"
            image="list-icon"
            onItemClick={onClick}
            text={list.friendlyName}
            renderImageComponent={renderIconImageComponent}
            secondaryText={translate("si.components.lists_dropdown.secondary_text")}
        />
    );
};

export default ListsDropdownButton;
