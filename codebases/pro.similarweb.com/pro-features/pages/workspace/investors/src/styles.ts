import styled from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { OverviewPageHeaderWrapper } from "pages/workspace/common components/OverviewPage/StyledComponents";

export const InvestorsWorkspaceWrapper = styled(FlexRow)`
    ${OverviewPageHeaderWrapper} {
        padding-top: 10px;
    }
`;
