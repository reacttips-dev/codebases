import { Box } from "@similarweb/ui-components/dist/box";
import { Flex } from "pages/Leading Folders/src/LeadingFoldersInfoPanel";
import * as React from "react";
import styled from "styled-components";
import { FlexColumn, FlexRow } from "../../../../../../styled components/StyledFlex/src/StyledFlex";

const br0 = "500px";
const br1 = "800px";

export const TableBoxContainer: any = styled(Box)`
    width: 48%;
    min-width: 280px;
    height: 370px;
    font-family: Roboto;
`;
TableBoxContainer.displayName = "TableBoxContainer";

export const TableContainer: any = styled.div`
    height: 275px;
    box-sizing: border-box;
    padding: 24px;
`;
TableContainer.displayName = "TableContainer";

export const ApoStyledCell: any = styled(FlexRow)`
    height: 32px;
    align-items: center;
    margin-bottom: 16px;
`;
ApoStyledCell.displayName = "ApoStyledCell";

export const RankCell: any = styled(ApoStyledCell)`
    justify-content: flex-end;
`;
RankCell.displayName = "RankCell";
