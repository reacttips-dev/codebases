import styled from "styled-components";
import { Box } from "@similarweb/ui-components/dist/box";
import { SearchContainer } from "pages/conversion/conversionTableContainer/StyledComponents";
import { colorsPalettes } from "@similarweb/styles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const WebsiteAnalysisSubdomainsContainer = styled.div`
    padding: 40px;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    align-items: center;
`;

export const BoxContainer: any = styled(Box)`
    width: 100%;
    max-width: 1368px;
    height: auto;
    border-radius: 6px 6px 0px 0px;
`;

export const TableTopContainer = styled(SearchContainer)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    .SearchInput-container {
        width: 100%;

        > div:first-child {
            top: 13px;
        }

        > .SearchInput {
            height: 48px;
        }
    }
`;

export const ButtonContainer = styled.div`
    margin-right: 16px;

    .excel-button-wrapper {
        bottom: 0px;
    }
`;

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

export const PredDropDownLabel = styled.span`
    font-size: 13px;
    line-height: 13px;
    font-weight: 400;
    margin-left: 16px;
    margin-right: 9px;
    white-space: nowrap;
`;

export const FlexRowAlignCenter = styled(FlexRow)`
    align-items: center;
`;
