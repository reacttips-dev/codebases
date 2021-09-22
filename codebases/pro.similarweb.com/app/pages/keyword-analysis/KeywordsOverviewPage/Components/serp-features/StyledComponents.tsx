import styled from "styled-components";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";

export const TitleSection = styled(FlexColumn)`
    height: 64px;
    box-sizing: border-box;
    padding: 0 24px;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;

export const MetricSection = styled(FlexRow)`
    padding: 16px 24px 0 24px;
`;

export const MetricSectionInner = styled.div`
    display: grid;
    padding: 16px 24px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-column-gap: 10px;
    grid-row-gap: 16px;
`;

export const SerpFeatureItemContentWrapper = styled(FlexRow)`
    position: relative;
    width: 100%;
    cursor: default;
    .Popup-content {
        padding: 16px 16px 12px 16px;
    }
    .Popup-content .serp-feature-item--tooltip-content .ListItemWebsite {
        padding: 0;
        height: 24px;
    }
    .Popup-content .serp-feature-item--tooltip-content .ListItem {
        cursor: none;
        ${setFont({ $color: colorsPalettes.carbon["400"] })};
        .ItemIcon {
            width: 24px;
            height: 24px;
        }
    }
`;

export const Title = styled.div`
    ${setFont({ $size: 14, $color: colorsPalettes.carbon["500"], $weight: 400 })};
    margin-bottom: 16px;
`;

export const Footer = styled.div`
    display: flex;
    align-items: center;
    height: 24px;
    ${setFont({ $size: 14, $color: rgba(colorsPalettes.carbon["500"], 0.4), $weight: 400 })};
`;

export const Row = styled.div`
    ${setFont({ $size: 14, $color: colorsPalettes.carbon["500"], $weight: 400 })};
    height: 24px;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
`;
