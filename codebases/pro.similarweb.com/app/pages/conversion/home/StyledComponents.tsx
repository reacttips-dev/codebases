import { Title } from "@similarweb/ui-components/dist/title";
import styled from "styled-components";
import { OverviewNewListCard } from "../../../../.pro-features/pages/workspace/common components/OverviewPage/StyledComponents";
import { TableWrapper } from "./ConversionLeaderboardTableContainer";

export const StyledLeaderboardsHeaderContainer = styled.div`
    max-width: 1688px;
    @media (max-width: 1480px) and (min-width: 1024px) {
        max-width: calc(100% - 50px);
    }
    @media (max-width: 1024px) {
        max-width: 100%;
    }
    @media (max-width: 1566px) {
        padding: 32px 16px 16px 0;
    }
    padding: 32px 32px 16px 0;
    justify-content: space-between;
    display: flex;
`;
StyledLeaderboardsHeaderContainer.displayName = "StyledLeaderboardsHeaderContainer";

export const StyledPrimaryTitle: any = styled(Title).attrs({
    "data-automation-box-title": true,
})`
    font-family: Roboto;
    font-size: 18px;
    font-weight: 500;
`;
StyledPrimaryTitle.displayName = "StyledPrimaryTitle";

export const TileWrapper = styled(TableWrapper)`
    height: 294px;
`;
TileWrapper.displayName = "TileWrapper";

export const HomepageNewCustomGroup = styled(OverviewNewListCard)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    box-sizing: border-box;

    width: 530px;
    height: 294px;

    @media (max-width: 1566px) {
        margin: 0 16px 24px 0;
    }
    margin: 0 32px 24px 0;
`;
HomepageNewCustomGroup.displayName = "HomepageNewCustomGroup";
