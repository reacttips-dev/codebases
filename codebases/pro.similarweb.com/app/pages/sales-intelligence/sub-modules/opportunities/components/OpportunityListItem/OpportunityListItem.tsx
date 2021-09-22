import React from "react";
import { OpportunityListType } from "../../types";
import SalesListItem from "../../../../common-components/sales-list-item/SalesListItem";

type OpportunityListItemProps = {
    item: OpportunityListType;
    onClick(item: OpportunityListType): void;
};

const OpportunityListItem: React.FC<OpportunityListItemProps> = (props) => {
    const { item, onClick } = props;
    const handleItemLick = React.useCallback(() => {
        onClick(item);
    }, [item, onClick]);

    return (
        <SalesListItem
            iconName="list-icon"
            onClick={handleItemLick}
            name={item.friendlyName}
            dataAutomation="si-static-list-item"
            numberOfWebsites={item.opportunities.length}
        />
    );
};

export default OpportunityListItem;
