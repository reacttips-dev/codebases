import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import React, { FC, useMemo } from "react";
import { ICategoryLeadersServices } from "pages/industry-analysis/category-leaders/CategoryLeaders.types";
import { PaidOrganicFilterEnum } from "./CategoryLeadersSearchTableTop.types";

interface IPaidOrganicFilterProps {
    onSelectId: (id: PaidOrganicFilterEnum) => void;
    selectedId: PaidOrganicFilterEnum;
    services: ICategoryLeadersServices;
}

export const PaidOrganicFilter: React.FunctionComponent<IPaidOrganicFilterProps> = (props) => {
    const { onSelectId, selectedId, services } = props;

    const filterItems = useMemo(() => {
        return [
            {
                text: services.translate("category.leaders.search.table.filter.organic"),
                id: PaidOrganicFilterEnum.Organic,
            },
            {
                text: services.translate("category.leaders.search.table.filter.paid"),
                id: PaidOrganicFilterEnum.Paid,
            },
        ];
    }, [services]);

    const selectedItemText = useMemo(() => {
        const hasSelectedId = selectedId !== null && typeof selectedId !== "undefined";
        return hasSelectedId ? filterItems[selectedId]?.text : null;
    }, [selectedId]);

    return (
        <ChipDownContainer
            width={220}
            onClick={(value) => onSelectId(value.id)}
            tooltipDisabled={true}
            selectedText={selectedItemText}
            onCloseItem={() => onSelectId(null)}
            buttonText={services.translate("category.leaders.search.table.filter.organicpaid")}
        >
            {filterItems.map((item, index) => {
                return (
                    <EllipsisDropdownItem
                        selected={selectedId === item.id}
                        id={item.id}
                        key={index}
                    >
                        {item.text}
                    </EllipsisDropdownItem>
                );
            })}
        </ChipDownContainer>
    );
};
