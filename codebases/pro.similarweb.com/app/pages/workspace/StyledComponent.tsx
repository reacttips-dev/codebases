import styled from "styled-components";
import { mixins } from "@similarweb/styles/";
import { colorsPalettes } from "@similarweb/styles";
import { Flex } from "../../../.pro-features/components/core cells/src/CoreWebsiteCell/StyledComponents";
import { RecommendationsIndicatorNumber } from "../../../.pro-features/pages/workspace/common components/RecommendationsSidebar/StyledComponents";
import { FlexRow } from "../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { AlertsIndicatorCell } from "pages/workspace/common/tableAdditionalColumns";

export const TableWrapper: any = styled.div<{ loading: boolean; showCheckBox: boolean }>`
    pointer-events: ${({ loading }: any) => (loading ? "none" : "all")};

    .swReactTable-header-wrapper.css-sticky-header {
        top: 0px;
    }
`;

TableWrapper.displayName = "TableWrapper";

export const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    padding: 8px 16px 8px 0;
    height: 40px;
    .SearchInput-container {
        flex-grow: 1;
    }
    .SearchInput {
        height: 34px;
        background-color: ${colorsPalettes.carbon[0]};
        border: none;
        width: 100%;
        box-sizing: border-box;
        padding: 9px 2px 5px 50px;
        box-shadow: none;
        margin-bottom: 0px;
        :focus {
            box-shadow: none !important;
            border: none;
        }
    }
`;
SearchContainer.displayName = "SearchContainer";

export const PaginationContainer = styled(FlexRow)`
    justify-content: flex-end;
    padding: 8px 0px 8px 0px;
`;
PaginationContainer.displayName = "PaginationContainer";

export const DownloadExcelContainer = styled.a`
    margin: 0 8px 0 16px;
`;

export const TrialLink = styled.div`
    ${mixins.setFont({ $size: 14 })};
    font-weight: bold;
    text-transform: uppercase;
    color: ${colorsPalettes.blue[400]};
    font-weight: 500;
    &:hover {
        cursor: pointer;
    }
`;
TrialLink.displayName = "TrialLink";

export const RowSelector = styled.div`
    margin-left: 48px;
    flex-grow: 1;
    align-self: stretch;
    opacity: 0.1;
    cursor: pointer;
`;

RowSelector.displayName = "RowSelector";

export const DomainNameAndIconWrapper = styled(Flex)`
    width: 100%;
`;
export const AlertsIndicator = styled(RecommendationsIndicatorNumber)<{
    visible: boolean;
    seen?: boolean;
}>`
    background-color: ${({ seen }) => (seen ? colorsPalettes.carbon[0] : colorsPalettes.blue[400])};
    color: ${({ seen }) => (seen ? colorsPalettes.blue[400] : colorsPalettes.carbon[0])};
    border: ${({ seen }) => (seen ? `1px solid ${colorsPalettes.blue[400]}` : `none`)};
    margin-left: 4px;
    justify-self: flex-end;
    opacity: ${({ visible }) => (visible ? 1 : 0)};
    transition: opacity 200ms ease-in;
`;

export const AlertsIndicatorSales = styled(AlertsIndicator)`
    margin-left: 0;
`;

export const AlreadySeenAlertsIndicator = styled.img`
    animation: fadeIn linear 300ms;
    animation-fill-mode: forwards;
    display: block;
    opacity: 0;

    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }
`;

export const DomainNameAndIconHeaderWrapper = styled(Flex)`
    width: 100%;
    justify-content: space-between;
    .SWReactIcons {
        margin: 0 8px;
    }
`;

export const StyledAlertsIndicatorCell = styled(AlertsIndicatorCell)`
    align-items: center;
    display: flex;
    justify-content: center;
    height: 100%;
`;
