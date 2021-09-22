import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { SwitcherGranularityContainer } from "pages/website-analysis/components/SwitcherGranularityContainer";
import styled from "styled-components";
import { FlexRow } from "../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import {
    SearchContainer,
    TableWrapper,
} from "../../conversion/conversionTableContainer/StyledComponents";
import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { CoreWebsiteCell } from "../../../../.pro-features/components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import {
    InnerLink,
    InnerLinkContainer,
} from "../../../../.pro-features/components/core cells/src/CoreWebsiteCell/StyledComponents";
import { SWReactIcons } from "@similarweb/icons";

export const StyledSwitcherGranularityContainer = styled(SwitcherGranularityContainer)`
    &.gran-switch {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 5px;
        span:last-of-type {
            button {
                border-right: 1px solid ${colorsPalettes.carbon["50"]};
            }
        }
    }
`;
export const CompareButtonContainer = styled.div`
    margin-left: 10px;
`;

export const PageContainer = styled(FlexRow)`
    font-family: Roboto;
    padding: 32px;
    justify-content: center;
    @media (max-width: 1440px) and (min-width: 1024px) {
        padding: 8px;
    }
`;

export const SegmentsAnalysisContainer = styled(FlexRow)`
    max-width: 1488px;
    display: block;
    flex-basis: 100%;
    @media (max-width: 1480px) and (min-width: 1024px) {
        max-width: calc(100% - 50px);
    }
    @media (max-width: 1024px) {
        max-width: 100%;
    }
    @media (max-width: 1566px) {
        padding: 32px 16px 16px 0;
    }
`;
SegmentsAnalysisContainer.displayName = "SegmentsAnalysisContainer";

export const PageTitle = styled.div`
    font-size: 24px;
    color: ${colorsPalettes.carbon["500"]};
    margin-right: 10px;
`;
PageTitle.displayName = "PageTitle";

export const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;
TitleContainer.displayName = "TitleContainer";

export const CenteredRow = styled(FlexRow)`
    align-items: center;
`;
CenteredRow.displayName = "CenteredRow";

export const StyledTableWrapper = styled(TableWrapper)`
    max-width: none;
    margin-bottom: 80px;
    border-radius: 6px;
    ${SearchContainer} {
        border-top: none;
    }
`;

export const NoDataContainer = styled.div`
    padding: 20px;
`;
export const AnalyzeButton = styled(Button).attrs({
    type: "flat",
})`
    margin-top: -8px;
`;
AnalyzeButton.displayName = "AnalyzeButton";

export const EditButton = styled(IconButton).attrs({
    type: "flat",
})`
    margin-top: -10px;
    .SWReactIcons svg path {
        fill-opacity: 1;
    }
`;
EditButton.displayName = "EditButton";

export const StyledSearchContainer = styled(SearchContainer)`
    border: none;

    .SearchInput-container div {
        top: 14px;
    }
    .SearchInput {
        height: 48px;
    }
`;

export const StyledCoreWebsiteCell = styled(CoreWebsiteCell)`
    ${InnerLinkContainer} {
        width: auto;
    }
    ${InnerLink} {
        width: auto;
        &:hover {
            width: auto;
        }
    }
`;

export const EmptyStateContainer = styled.div`
    padding-top: 72px;
    padding-bottom: 72px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const EmptyStateIcon = styled(SWReactIcons).attrs({
    iconName: "no-data-lab",
})`
    svg {
        width: 220px;
        height: 136px;
    }
`;

export const EmptyStateTitle = styled.div`
    ${setFont({ $size: "16px", $color: colorsPalettes.carbon[500], $weight: 500 })};
    text-align: center;
    margin: 28px 0 4px 0;
    max-width: 440px;
`;

export const EmptyStateSubTitle = styled.div`
    ${setFont({ $size: "14px", $color: rgba(colorsPalettes.midnight[500], 0.6) })};
    text-align: center;
    margin: 4px 0 28px 0;
    max-width: 360px;
`;

export const EmptyStateActionButtons = styled(FlexRow)`
    & > button {
        margin: 4px;
    }
`;
