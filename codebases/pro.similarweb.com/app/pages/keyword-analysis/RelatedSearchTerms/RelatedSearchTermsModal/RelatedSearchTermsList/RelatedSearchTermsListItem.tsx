import React, { FC, useMemo } from "react";
import { IRelatedSearchTerm } from "services/relatedSearchTerms/RelatedSearchTermsServiceTypes";
import { abbrNumberVisitsWithNullFilter } from "filters/ngFilters";
import { IconButton } from "@similarweb/ui-components/dist/button";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles/";

const ItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${colorsPalettes.midnight[50]};
    height: 54px;
`;

const ItemTextContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const ItemKeywordText = styled.span<{ isBold: boolean }>`
    font-size: 14px;
    font-weight: ${(props) => (props.isBold ? "700" : "300")};
    color: ${colorsPalettes.carbon[400]};
    margin-right: 4px;
    max-width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ItemTotalVisitsText = styled.span`
    font-size: 14px;
    font-weight: 300;
    color: ${colorsPalettes.carbon[200]};
`;

interface IRelatedSearchTermListItemProps {
    item: IRelatedSearchTerm;
    isSelectedKeyword: boolean;
    isSavingGroup: boolean;
    onRemove: () => void;
}

export const RelatedSearchTermListItem: FC<IRelatedSearchTermListItemProps> = (props) => {
    const { item, isSelectedKeyword, isSavingGroup, onRemove } = props;
    const totalVisits = item.volume ? abbrNumberVisitsWithNullFilter()(item.volume) : "";
    const totalVisitsMessage = totalVisits ? `(${totalVisits} monthly searches)` : "";

    const RemoveButtonComponent = useMemo(() => {
        // The remove button should only appear in items
        // that are NOT the currently selected keyword
        const shouldRenderButton = !isSelectedKeyword;
        if (!shouldRenderButton) return null;

        return (
            <IconButton
                type={"flat"}
                onClick={onRemove}
                iconName={"close"}
                iconSize="xs"
                isDisabled={isSavingGroup}
            />
        );
    }, [isSelectedKeyword]);

    return (
        <ItemContainer key={item.keyword}>
            <ItemTextContainer>
                <ItemKeywordText isBold={isSelectedKeyword}>{item.keyword}</ItemKeywordText>
                <ItemTotalVisitsText>{totalVisitsMessage}</ItemTotalVisitsText>
            </ItemTextContainer>
            {RemoveButtonComponent}
        </ItemContainer>
    );
};
