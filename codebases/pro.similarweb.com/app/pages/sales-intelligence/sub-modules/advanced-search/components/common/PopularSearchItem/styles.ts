import styled, { css } from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { StyledPlusIcon } from "../NewSearchListItem/styles";

const BaseTextItemStyles = css`
    line-height: normal;
    margin: 0;
    text-align: center;
`;

export const StyledItemSubtitle = styled.p`
    ${mixins.setFont({ $size: 12, $color: colorsPalettes.carbon["250"] })};
    ${BaseTextItemStyles};
    line-height: 16px;
    margin-top: 8px;
`;

export const StyledItemTitle = styled.h2`
    ${mixins.setFont({ $size: 16, $weight: 500, $color: colorsPalettes.carbon["500"] })};
    ${BaseTextItemStyles};
`;

export const StyledDefaultPlusIcon = styled(StyledPlusIcon)`
    box-shadow: 0 0 24px ${rgba(colorsPalettes.blue["500"], 0.2)};
    height: 46px;
    width: 46px;
`;

export const StyledIconContainer = styled.div`
    align-items: center;
    display: flex;
    height: 72px;
    justify-content: center;
    margin-bottom: 8px;
    width: 72px;
`;

export const StyledCustomIconContainer = styled(StyledIconContainer)<{
    iconWidth: number;
    iconHeight: number;
}>`
    & > .SWReactIcons {
        height: ${({ iconHeight }) => iconHeight}px;
        width: ${({ iconWidth }) => iconWidth}px;
    }
`;

export const StyledItemContainer = styled.div`
    align-items: center;
    border: 1px solid ${colorsPalettes.navigation["NAV_BACKGROUND"]};
    border-radius: 8px;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    height: 217px;
    padding: 20px 24px 0;
    transform: translate3d(0, 0, 0);
    transition: box-shadow 100ms ease-in-out, transform 100ms ease-in-out;
    user-select: none;
    width: 100%;

    &:hover {
        box-shadow: 0 12px 24px 0 ${rgba(colorsPalettes.black[0], 0.2)};
        transform: translate3d(0, -4px, 0);
    }
`;
