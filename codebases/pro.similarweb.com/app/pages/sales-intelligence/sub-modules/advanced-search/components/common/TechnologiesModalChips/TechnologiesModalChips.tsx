import React from "react";
import { SimpleChipItem } from "@similarweb/ui-components/dist/chip";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { TechnologiesConditionEntry } from "../../../filters/technology/types";
import ChipItemsContainer from "../ChipItemsContainer/ChipItemsContainer";
import { StyledChipSeparator } from "./styles";

type TechnologiesModalChipsProps = {
    items: TechnologiesConditionEntry[];
    onChipRemove(item: TechnologiesConditionEntry): void;
};

const TechnologiesModalChips = (props: TechnologiesModalChipsProps) => {
    const { items, onChipRemove } = props;
    const translate = useTranslation();

    const renderChipItemsSeparator = (index: number) => {
        return (
            <StyledChipSeparator key={`separator-${index}`}>
                {translate("si.common.or")}
            </StyledChipSeparator>
        );
    };

    return (
        <ChipItemsContainer
            renderSeparator={renderChipItemsSeparator}
            items={items.map((entry) => ({
                icon: "",
                text: entry.name,
                id: `${entry.name}-${entry.type}`,
                onCloseItem(_: React.MouseEvent<HTMLSpanElement>) {
                    onChipRemove(entry);
                },
            }))}
            ChipComponent={SimpleChipItem}
        />
    );
};

export default TechnologiesModalChips;
