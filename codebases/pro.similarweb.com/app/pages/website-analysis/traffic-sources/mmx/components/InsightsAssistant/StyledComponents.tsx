import styled, { css } from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { SWReactIcons } from "@similarweb/icons";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import { Marker } from "components/Legends/src/LegendBase/Legend";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { RecommendationsIndicatorNumber } from "pages/workspace/common components/RecommendationsSidebar/StyledComponents";
import { setFont } from "@similarweb/styles/src/mixins";
import { ClosableItemColorMarker } from "components/compare/StyledComponent";

export const InsightsWrapperBase = styled.div<{
    isCollapsed: boolean;
    borderRadius?: string;
    height?: string;
}>`
    ${({ isCollapsed }) =>
        isCollapsed &&
        `
            height: 48px;
        `};
    border-radius: ${({ borderRadius = "2px" }) => borderRadius};
    background-color: ${colorsPalettes.blue[100]};
`;

export const InsightsWrapper = styled(InsightsWrapperBase)`
    ${({ isCollapsed }) =>
        isCollapsed &&
        `
            height: 52px;
        `};
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    position: relative;
    align-items: center;
`;

export const TitlesWrapper = styled.span`
    display: flex;
    align-items: center;
`;

export const StyledBoxTitleContainer = styled.div<{
    isCollapsed: boolean;
    withUnderline?: boolean;
    width?: string;
}>`
    padding: ${({ isCollapsed }) => (isCollapsed ? "5px 24px 5px 24px;" : "7px 24px 5px 24px;")};
    font-weight: 500;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: ${colorsPalettes.carbon["500"]};
    width: ${({ width = "100%" }) => width}
    justify-content: space-between;
    ${({ withUnderline }) =>
        withUnderline &&
        `
            border-bottom: 1px solid ${colorsPalettes.carbon[100]};
            padding: 5px 24px 4px 24px;
        `};
`;

export const CarouselWrapper = styled.div<{ isCompare?: boolean }>`
    width: 100%;
    box-sizing: border-box;
    height: ${({ isCompare }) => (isCompare ? "195px" : "168px")};
`;

export const CarouselContainer = styled(CarouselWrapper)`
    height: 212px;
`;

export const CardContent = styled.div`
    display: flex;
    flex-direction: column;
`;

export const CardHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 11px;
`;

export const TypeWrapper = styled.span<{ isDecrease: boolean }>`
    margin-left: 4px;
    color: ${({ isDecrease }) =>
        isDecrease ? colorsPalettes.red["s100"] : colorsPalettes.green["s100"]};
`;

export const CTA = styled.div`
    justify-content: flex-end;
    color: ${colorsPalettes.blue["400"]};
    display: flex;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.33;
`;

export const FeedbackCTA = styled.div<{ isCompare: boolean }>`
    justify-content: flex-end;
    color: ${colorsPalettes.blue["400"]};
    display: flex;
    padding-top: ${({ isCompare }) => (isCompare ? "36px" : "17px")};
    font-weight: bold;
`;

export const IconWrapper = styled.div`
    display: flex;
    align-self: center;
`;

export const FeedbackIconWrapper = styled(IconWrapper)`
    margin-right: 14.5px;
`;

export const FeedbackContentWrapper = styled.div`
    margin-bottom: 24px;
`;

export const FeedbackTitleWrapper = styled.div`
    display: flex;
    margin-bottom: 6px;
`;

export const BoldText = styled.span`
    font-weight: bold;
`;

export const StyledMarker = styled(Marker)`
    display: inline-block;
`;

export const StyledClosableItemColorMarker = styled(ClosableItemColorMarker)<{
    backgroundColor: string;
}>`
    bottom: -6px;
    right: -7px;
    width: 12px;
    height: 12px;
    ${({ backgroundColor }) =>
        backgroundColor &&
        css`
            background-color: ${backgroundColor};
        `};
`;

export const StyledIcon = styled(SWReactIcons)`
    display: flex;
    align-items: center;
    justify-content: center;
    path {
        fill: ${(props: any) => (props.fill ? props.fill : colorsPalettes.green["s100"])};
    }
    transform: ${(props) =>
        props.isRotate
            ? props.isDecrease
                ? "rotate(90deg) scaleY(-1)"
                : "rotate(-90deg) scaleY(-1)"
            : "none"};
`;

const BaseCard = styled.div`
    padding: 16px 20px 16px 20px;
    box-sizing: border-box;
    color: ${colorsPalettes.carbon["500"]};
    border-radius: 6px;
    width: 262px;
    height: 143px;
    display: flex;
    flex-direction: column;
    margin: 4px;
    font-size: 14px;
    background-color: ${colorsPalettes.carbon["0"]};
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08),
        0 -5px 4px 0 ${rgba(colorsPalettes.carbon[0], 0.02)};
    border: solid 1px transparent;
    :hover {
        box-shadow: 0 -5px 4px 0 ${rgba(colorsPalettes.carbon[0], 0.02)},
            0 3px 6px 0 rgba(14, 30, 62, 0.16);
    }
`;

export const InsightCardContainer = styled(BaseCard)<{
    isClicked: boolean;
    isCompare?: boolean;
    isVisited?: boolean;
}>`
    :hover {
        cursor: ${({ isClicked }) => (isClicked ? "default" : "pointer")};
    }
    ${({ isClicked }) =>
        isClicked
            ? css`
                  border: 1px solid ${colorsPalettes.blue["400"]};
              `
            : css`
                  :hover {
                      border: solid 1px ${colorsPalettes.carbon[200]};
                  }
              `}
    ${({ isCompare }) =>
        isCompare &&
        css`
            height: 163px;
        `};
    ${({ isVisited, isClicked }) =>
        isVisited &&
        !isClicked &&
        css`
            background-color: ${colorsPalettes.bluegrey[100]};
        `};
`;

export const FeedbackCardContainer = styled(BaseCard)<{ isCompare: boolean }>`
    :hover {
        cursor: pointer;
        border: solid 1px ${colorsPalettes.carbon[200]};
    }
    background-color: ${colorsPalettes.bluegrey[100]};
    ${({ isCompare }) =>
        isCompare &&
        css`
            height: 163px;
        `};
`;

export const LoadingContainer = styled.div`
    justify-content: center;
    align-items: center;
    min-height: 174px;
    display: flex;
`;

export const StyledInfoIcon = styled(InfoIcon)`
    margin-left: 4px;
`;

export const ChangeValueWrapper = styled.span<{ isDecrease: boolean }>`
    margin-right: 4px;
    color: ${({ isDecrease }) =>
        isDecrease ? colorsPalettes.red["s100"] : colorsPalettes.green["s100"]};
`;

export const StyledIconButton = styled(IconButton)`
    margin-right: 8px;
`;

export const StyledRecommendationsIndicatorNumber = styled(RecommendationsIndicatorNumber)`
    background-color: ${colorsPalettes.blue[400]};
    margin-left: 8px;
`;

export const HideButton = styled(IconButton)`
    div:nth-child(2) {
        align-items: center;
    }
`;

export const NoInsightsSubTitle = styled.div`
    color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    margin-left: 12px;
    font-size: 12px;
    flex-shrink: 2;
`;

export const Title = styled.span`
    flex-shrink: 0;
`;

export const CardContentBody = styled.div`
    height: 60px;
`;

export const Link = styled.span`
    font-size: 12px;
    flex-shrink: 2;
    cursor: pointer;
    color: ${colorsPalettes.blue[500]};
    :hover {
        color: ${colorsPalettes.carbon[500]};
        text-decoration: none;
    }
`;

export const InsightSectionHeaderContainer = styled.div`
    padding: 10px 0 0 10px;
    height: 30px;
    ${setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[400], 1) })}
`;

export const CompareDomainIconWrapper = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: #fff;
    border: 1px solid #d6dbe1;
    box-shadow: 0 2px 4px 0 rgba(${colorsPalettes.carbon[200]}, 0.2);
    margin-right: 9px;
    position: relative;

    img {
        margin: 0;
    }
`;

export const CardHeaderLeft = styled.div`
    display: flex;
`;

export const DomainWrapper = styled.span`
    ${setFont({ $size: 13, $color: colorsPalettes.carbon[300] })};
`;
