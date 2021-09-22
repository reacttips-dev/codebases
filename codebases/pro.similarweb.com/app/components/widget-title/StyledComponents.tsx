import { Box } from "@similarweb/ui-components/dist/box";
import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import { Title } from "@similarweb/ui-components/dist/title";
import { mixins } from "@similarweb/styles";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";

export const AddToDashboardWrapper = styled.div`
    position: absolute;
    top: 3px;
    right: 2px;
    @media (max-width: 1365px) {
        top: 11px;
        right: 9px;
    }
`;

export const StyledBox = styled(Box).attrs<{
    height: number;
    width: number | string;
    marginRight?: number;
}>((props) => ({
    width: props.width,
}))`
    height: ${({ height }) => height}px;
    display: flex;
    flex-direction: column;
    ${({ marginRight }) =>
        marginRight &&
        css`
            margin-right: ${marginRight}px;
        `};
`;

export const TitleContainer = styled.div`
    padding: 24px 17px 30px 24px;
`;

export const SeeMoreContainer = styled.div<{ marginTop: number }>`
    padding-right: 15px;
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    margin-top: ${({ marginTop }) => marginTop + "px"};
    height: 51px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

export const AdsWrapper = styled.div`
    margin-top: -11px;
    min-height: 470px;
`;

export const StyledHeaderTitle: any = styled(Title).attrs({
    "data-automation-box-title": true,
})`
    font-size: 20px;
    ${InfoIcon} {
        line-height: 1.55;
    }
`;

export const StyledSubtitle = styled(BoxSubtitle)`
    font-size: 12px;
`;

export const SubTitleWrapper = styled(StyledBoxSubtitle)`
    margin-top: 6px;
    ${mixins.setFont({ $size: 14 })}
`;
