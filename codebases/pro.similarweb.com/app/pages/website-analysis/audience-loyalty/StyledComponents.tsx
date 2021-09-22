import { colorsPalettes } from "@similarweb/styles";
import { LegendCheckbox } from "@similarweb/ui-components/dist/checkbox";
import { NoBorderButton } from "@similarweb/ui-components/dist/dropdown";
import { NoData, NoDataSubtitle, NoDataTitle } from "components/NoData/src/NoData";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { Box } from "@similarweb/ui-components/dist/box";

export const LegendContainer: any = styled.div`
    display: flex;
    align-items: center;
    margin-left: 8px;
`;
export const StyledLegendCheckbox: any = styled(LegendCheckbox)`
    margin-right: 8px;
    &.disabled {
        opacity: 0.5;
        pointer-events: none;
        cursor: not-allowed;
    }
`;

export const TitleRow: any = styled(FlexRow)`
    line-height: inherit;
    display: flex;
    align-items: center;
`;
export const Header: any = styled.div`
    margin-right: 8px;
`;

export const StyledNoData = styled(NoData)`
    ${NoDataTitle} {
        margin-top: 12px;
        margin-bottom: 12px;
        max-width: 100%;
        font-size: 20px;
    }
    ${NoDataSubtitle} {
        margin-top: 0px;
        font-size: 14px;
    }
`;

export const BoxContainer: any = styled(Box)`
    width: 100%;
    max-width: 1368px;
    height: auto;
    border-radius: 6px;
    margin-top: 24px;
`;

export const ContentContainer: any = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
`;
ContentContainer.displayName = "ContentContainer";

export const ChartContainer: any = styled.div`
    box-sizing: border-box;
    padding-top: 20px;
    width: 100%;
    height: 360px;
`;
ChartContainer.displayName = "ChartContainer";

export const NoDataContainer: any = styled.div`
    display: flex;
    flex-direction: column;
    height: ${(props: any) => (props.height ? props.height + "px" : "auto")};
`;

export const StyledNoBorderButton: any = styled(NoBorderButton)`
    &.LoyaltyDropButton {
        div {
            font-size: 20px;
            color: ${colorsPalettes.blue["400"]} !important;
            svg {
                path {
                    fill: ${colorsPalettes.blue["400"]} !important;
                }
            }
        }
    }
`;

export const StyledLink = styled.a`
    text-decoration: none;
    color: ${colorsPalettes.blue["400"]};
    margin-left: 3px;
`;

export const StyledBoxSubtitleLoyalty = styled(StyledBoxSubtitle)`
    align-items: center;
    .loyalty {
        margin-top: 1px;
    }
`;

export const ButtonsContainer = styled(FlexRow)`
    margin-right: 15px;
`;
