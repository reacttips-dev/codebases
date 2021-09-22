import styled, { css } from "styled-components";

import { setFont } from "@similarweb/styles/src/mixins";
import { colorsPalettes } from "@similarweb/styles";
import { StyledCell } from "../../TableCells/DefaultCell";
import { StyledBoxWithBorder } from "../../../../styled components/Workspace/src/StyledWorkspaceBox";
import { NoDataContainer } from "../../../NoData/src/NoData";

export const GroupRowContainer = styled.div`
    height: 94px;
    padding: 16px;
    box-sizing: border-box;
`;

export const GroupRowFlexContainer = styled(GroupRowContainer)<{ isClickable: boolean }>`
    display: flex;
    justify-content: space-between;
    ${({ isClickable }) =>
        isClickable &&
        `
            cursor: pointer;
            &:hover {
                background-color: ${colorsPalettes.carbon[25]};
            }
         ${NoDataContainer} {
            flex-grow: 1;
            flex-basis: 67%;
         }
    `}
`;

export const GroupRowBlockContainer = styled(GroupRowContainer)`
    display: inline-block;
    width: 100%;
`;

export const GroupRowBlockNoPaddingContainer = styled(GroupRowContainer)`
    padding: 0px;
    height: auto;
    width: 100%;
`;

export const GroupRowCell = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-top: 5px;
    width: 15%;
`;

export const GroupRowTitleCell = styled(GroupRowCell)`
    flex-grow: 1;
    width: 29%;
`;

export const GroupRowTitle = styled.h3`
    font-size: ${setFont({ $size: 20 })};
    color: ${colorsPalettes.midnight[600]};
    margin: 0px 0px 2px 0px;
    padding: 0 10% 0 0;
    font-weight: 500;
    line-height: 27px;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    white-space: nowrap;
    box-sizing: border-box;
`;

export const GroupRowSubTitle = styled.span`
    font-size: ${setFont({ $size: 14 })};
    color: ${colorsPalettes.carbon[300]};
`;

export const GroupRowColText = styled.span`
    font-size: ${setFont({ $size: 12 })};
    color: ${colorsPalettes.carbon[300]};
    position: relative;
    right: 4px;
    top: 2px;
`;

export const GroupRowSplitCell = styled(GroupRowCell)`
    flex-grow: 1;
    width: 29%;
    ${GroupRowColText} {
        margin-bottom: 5px;
    }
`;

export const GroupRowInnerCell = styled.div`
    display: flex;
    ${StyledCell} {
        border-bottom: none;
        margin-right: 7px;
    }
    position: relative;
    bottom: 10px;
    right: 3px;
    justify-content: start;
    width: 100%;
`;

export const GroupRowsContainer = styled.div`
    padding: 16px 24px;
    ${StyledBoxWithBorder} {
        margin-bottom: 16px;
    }
`;
