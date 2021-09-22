import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { SWReactIcons } from "@similarweb/icons";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

const CardWrapper = styled.div`
    border: ${colorsPalettes.carbon["50"]} 1px solid;
    width: 246px;
    height: 138px;
    border-radius: 6px;
    padding-top: 16px;
    padding-left: 16px;
    font-size: 14px;
    box-sizing: border-box;
    background-color: ${colorsPalettes.carbon["0"]};
    display: flex;
    flex-direction: column;
    margin-bottom: 9px;
    margin-top: 9px;
`;

export const HighlightCardWrapper = styled(CardWrapper)`
    padding-bottom: 12px;
    padding-right: 16px;
    box-shadow: 0 -5px 4px 0 rgba(0, 0, 0, 0.02), 0 3px 6px 0 rgba(14, 30, 62, 0.16);
    :hover {
        cursor: pointer;
        border: 1px solid ${colorsPalettes.blue[400]};
    }
`;

export const NoMoreHighlightsCardWrapper = styled(CardWrapper)`
    position: relative;
`;

export const DomainWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const Domain = styled.div`
    color: rgba(colorsPalettes.black[0], 0.8);
    display: flex;
    align-items: center;
`;

export const Icon: any = styled(SWReactIcons)`
    svg {
        path {
            fill: ${colorsPalettes.blue[400]};
        }
    }
`;

export const ChannelWrapper = styled.div<{ isIncrease: boolean }>`
    margin-top: 8px;
    margin-bottom: 8px;
    width: fit-content;
    display: flex;
    margin-left: -4px;
    border-color: ${(props) =>
        props.isIncrease ? colorsPalettes.green["s100"] : colorsPalettes.red["s100"]};
    color: ${(props) =>
        props.isIncrease ? colorsPalettes.green["s100"] : colorsPalettes.red["s100"]};
`;

export const StyledIcon = styled(SWReactIcons)<{ isIncrease: boolean; isRotate: boolean }>`
    path {
        fill: ${(props) =>
            props.isIncrease ? colorsPalettes.green["s100"] : colorsPalettes.red["s100"]};
    }
    transform: ${(props) =>
        props.isRotate
            ? props.isIncrease
                ? "rotate(-90deg) scaleY(-1)"
                : "rotate(90deg) scaleY(-1)"
            : "none"};
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    align-self: ${(props) => (props.isRotate ? "center" : "baseline")};
`;

export const TextWrapper = styled.div`
    margin-left: 4px;
`;

export const ChangeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 2px;
`;

export const Percent = styled.span<{ isIncrease: boolean }>`
    line-height: normal;
    margin-bottom: 2px;
    color: ${(props) =>
        props.isIncrease ? colorsPalettes.green["s100"] : colorsPalettes.red["s100"]};
`;

export const DurationWrapper = styled.span`
    font-size: 12px;
    line-height: normal;
    color: ${colorsPalettes.carbon[500]};
`;

export const BottomWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const GraphWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
        font-size: 9px;
        color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    }
`;

export const BoldText = styled.span`
    font-weight: bold;
`;

export const NoMoreHighlightsCardTitle = styled(BoldText)`
    color: ${colorsPalettes.navigation["ICON_DARK"]};
    margin-bottom: 8px;
`;

export const NoMoreHighlightsCardContent = styled.div`
    color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    position: absolute;
    top: 43px;
    margin-right: 16px;
`;

export const Marker = styled.div`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${({ color }) => color};
    margin-right: 8px;
`;

export const IconWrapper = styled(SWReactIcons)`
    svg {
        height: 50px;
        width: 82px;
    }
    z-index: 1;
    position: absolute;
    top: 86px;
    left: 163px;
`;

export const CarouselWrapper = styled.div`
    width: 100%;
    box-sizing: border-box;

    > div {
        height: 170px;
        display: flex;
        align-items: center;
        border-bottom: ${colorsPalettes.carbon["50"]} 1px solid;
    }
`;

const BaseWrapper = styled.div`
    margin-bottom: 1.4rem;
    border-radius: 6px;
    box-shadow: 0px 0px 5px 0px ${rgba(colorsPalettes.carbon[500], 0.12)};
    background-color: ${colorsPalettes.carbon["0"]};
    height: 311px;
    width: 100%;
`;

export const HighlightsWrapper = styled(BaseWrapper)`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    position: relative;
`;

export const HighlightsInnerWrapper = styled.div`
    width: 100%;
`;

export const HeaderWrapper = styled(FlexRow)`
    height: 88px;
    box-sizing: border-box;
    padding: 24px;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
    justify-content: space-between;
`;

export const FeedbackWrapper = styled.div`
    color: ${colorsPalettes.blue["400"]};
    font-weight: bold;
    display: flex;
    font-size: 14px;
    text-transform: uppercase;
    align-items: center;
`;

export const ChangeValueWrapper = styled.span`
    padding-right: 4px;
    .ChangeValue {
        font-size: 12px !important;

        > div {
            align-items: baseline;
            display: flex;
        }

        .ChangeValue-arrow {
            align-self: end;
        }
    }
`;

export const ValueWrapper = styled.span`
    padding-left: 4px;
    padding-right: 4px;
`;

export const CTA = styled.div`
    justify-content: flex-end;
    display: flex;
    margin-right: 16px;
    height: 53px;
    align-items: center;
`;

export const TooltipContentWrapper = styled.div`
    display: inline;
    white-space: nowrap;
`;

export const TooltipWrapper = styled.div`
    padding: 17px;
    font-size: 12px;
    width: fit-content;
    background-color: ${colorsPalettes.carbon[0]};
    border-radius: 6px;
    box-shadow: 0 3px 3px 0 ${colorsPalettes.carbon[200]};
`;
