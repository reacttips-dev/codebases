import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const ListContainer = styled.div`
    border: 1px solid ${colorsPalettes.carbon[50]};
    border-radius: 8px;
    height: 261px;
    width: 320px;
    display: flex;
    flex-direction: column;
    padding: 24px;
`;

export const WidgetListItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 36px;
`;

export const ItemErrorIconContainer = styled.div`
    cursor: not-allowed;
    padding-right: 6px;
`;

export const WidgetListItemTextContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    user-select: none;

    span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 225px;
    }
`;

export const WidgetListItemTitle = styled.span<{ isDisabled: boolean }>`
    font-size: 14px;
    font-weight: 400;
    color: ${({ isDisabled }: { isDisabled: boolean }) =>
        isDisabled ? colorsPalettes.carbon[100] : colorsPalettes.carbon[500]};
`;

export const WidgetListItemSubtitle = styled.span`
    font-size: 12px;
    font-weight: 400;
    color: ${({ isDisabled }: { isDisabled: boolean }) =>
        isDisabled ? colorsPalettes.carbon[100] : colorsPalettes.carbon[500]};
`;
