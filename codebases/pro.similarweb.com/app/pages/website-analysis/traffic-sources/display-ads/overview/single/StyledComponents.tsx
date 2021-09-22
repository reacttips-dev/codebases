import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { StyledBox } from "pages/website-analysis/traffic-sources/display-ads/overview/common/StyledComponents";

export const BodyWrapper = styled(FlexColumn)`
    margin: 0 20px 5px 24px;
`;

export const TotalWrapper = styled.div`
    font-size: 40px;
    font-weight: 300;
    line-height: 1.2;
    color: ${colorsPalettes.carbon[500]};
`;

export const ChangeWrapper = styled(FlexColumn)<{ isDecrease: boolean }>`
    margin: 8px 0 0 0;
    > div:first-child {
        font-size: 16px;
    }

    .ChangeValue-desc {
        font-size: 12px;
        line-height: 1.33;
        color: ${rgba(colorsPalettes.carbon[500], 0.8)};
    }

    .ChangeValue-arrow--symbol {
        // when to hide arrow
        display: ${({ isDecrease }) => (isDecrease === null ? "none" : "inline-block")};
    }

    .ChangeValue--up {
        color: ${({ isDecrease }) =>
            isDecrease === null
                ? colorsPalettes.carbon[500]
                : isDecrease
                ? colorsPalettes.red["s100"]
                : colorsPalettes.green["s100"]};
    }
`;

export const VolumeWrapper = styled.div`
    font-size: 12px;
    line-height: 1.33;
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
`;

export const ChangeNumberWrapper = styled.div<{ isDecrease: boolean }>`
    display: inline-block;
    vertical-align: middle;
    margin-left: 2px;
    font-size: 16px;

    color: ${({ isDecrease }) =>
        isDecrease === null
            ? colorsPalettes.carbon[500]
            : isDecrease
            ? colorsPalettes.red["s100"]
            : colorsPalettes.green["s100"]};
`;

export const ChangeDateWrapper = styled.div`
    font-size: 12px;
    line-height: 1.33;
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
`;

export const CarouselWrapper = styled.div`
    width: 100%;
    box-sizing: border-box;
    margin-top: 10px;
    margin-bottom: 7px;

    > div {
        width: 100%;
    }

    .tile-box {
        height: 239px;
        margin-bottom: 0px;
        width: 380px;
        max-width: 380px;
        min-width: 380px;

        @media (min-width: 1600px) {
            font-size: 11px;
        }

        @media (max-width: 1003px) {
            font-size: 11px;
        }
    }

    .tile-field-value {
        font-weight: 500;
    }

    .image-and-link {
        height: 170px;
        padding-bottom: 8px;
        padding-top: 8px;
    }

    .tile-fields-details {
        font-size: 11px;
    }

    .tile-img {
        max-height: 108px;
    }

    .tile-field-header {
        color: ${rgba(colorsPalettes.carbon[500])};
        opacity: 0.6;
    }
`;
