import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { BoxContainer } from "pages/conversion/components/ConversionScatterChart/StyledComponents";

export const GreyNotificationContainer = styled.div`
    background-color: ${colorsPalettes.bluegrey[200]};
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 12px;
    border-radius: 4px;
    grid-row: 2;
    grid-column: 1 / span 2;
    margin: 0px 8px 8px;

    .SWReactIcons {
        margin-right: 0.75em;
    }
`;

export const TitleContainer = styled(FlexRow)`
    box-sizing: border-box;
    padding: 24px 24px 12px 24px;
    justify-content: space-between;
`;

export const TitleContainerWithBorder = styled(TitleContainer)`
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
`;

export const PredDropDownLabel = styled.span`
    font-size: 14px;
    line-height: 16px;
    font-weight: 400;
    margin-left: 24px;
    margin-right: 12px;
`;
export const GroupContainer = styled.div`
    margin-bottom: 8px;
`;

export const SegmentsGeoAnalysisContainer = styled.div`
    padding: 40px;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    align-items: center;
`;

export const FlexRowAlignCenter = styled(FlexRow)`
    align-items: center;
`;
