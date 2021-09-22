import React from "react";
import { StyledItemName, StyledSecondaryName } from "./styles";
import { TechnologiesDDItemType } from "../../../filters/technology/types";
import TechnologiesDDItem, { TechnologiesDDItemProps } from "./TechnologiesDDItem";

const TechnologiesDDHighlightedItem = (props: Omit<TechnologiesDDItemProps, "renderText">) => {
    const replaceMatchWithSpanTag = (string: string, match?: string) => {
        if (typeof match === "undefined") {
            return string;
        }

        return string.replace(RegExp(match, "gi"), `<span class="highlighted">${match}</span>`);
    };

    const renderItemText = (item: TechnologiesDDItemType) => {
        const secondaryName = !item.secondaryName ? null : (
            <StyledSecondaryName>
                <span>&nbsp;|&nbsp;</span>
                <span
                    dangerouslySetInnerHTML={{
                        __html: replaceMatchWithSpanTag(
                            item.secondaryName,
                            item.secondaryNameMatch,
                        ),
                    }}
                />
            </StyledSecondaryName>
        );
        const primaryName = (
            <span>
                <span
                    dangerouslySetInnerHTML={{
                        __html: replaceMatchWithSpanTag(item.name, item.nameMatch),
                    }}
                />
                {item.technologiesCount && <span>&nbsp;({item.technologiesCount})</span>}
            </span>
        );

        return (
            <StyledItemName>
                {primaryName}
                {secondaryName}
            </StyledItemName>
        );
    };

    return <TechnologiesDDItem {...props} renderText={renderItemText} />;
};

export default TechnologiesDDHighlightedItem;
