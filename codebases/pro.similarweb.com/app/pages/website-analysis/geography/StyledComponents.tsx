import styled from "styled-components";
import { FlexRow, RightFlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { Box } from "@similarweb/ui-components/dist/box";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import { Title } from "@similarweb/ui-components/dist/title";
import { ExcelButtonWrapper } from "components/React/ExcelButton/ExcelButton";
import { SearchContainer } from "pages/conversion/conversionTableContainer/StyledComponents";

export const WebsiteAnalysisGeoContainer = styled.div`
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

export const TitleContainer = styled(FlexRow)`
    box-sizing: border-box;
    padding: 24px 24px 12px 24px;
    justify-content: space-between;
`;

export const StyledHeaderTitle = styled(Title)`
    font-size: 20px;
    ${InfoIcon} {
        line-height: 1.55;
    }
`;

export const UtilitiesContainer = styled(RightFlexRow)`
    justify-content: center;
`;

export const ButtonsContainer = styled(FlexRow)`
    margin-right: 0px;
    align-items: center;
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
