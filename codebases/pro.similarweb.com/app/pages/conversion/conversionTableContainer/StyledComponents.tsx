import { colorsPalettes } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled from "styled-components";

import { FlexRow } from "../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";

// we have strange padding in swReactTableCell, making such margins to make content centered
export const SegmentCellContainer = styled.div<{ withSegment: boolean }>`
    margin-top: ${({ withSegment }) => (withSegment ? "-10px" : "-2px")};
`;
SegmentCellContainer.displayName = "SegmentCellContainer";

export const TableWrapper: any = styled(Box)<{ loading: boolean }>`
    pointer-events: ${({ loading }: any) => (loading ? "none" : "all")};
    width: 100%;
    max-width: 1368px;
    height: auto;
    border-radius: 0px 0px 6px 6px;
    display: block;
`;
TableWrapper.displayName = "TableWrapper";

export const SearchContainer = styled.div`
    border-top: 1px solid ${colorsPalettes.carbon[100]};
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

export const CategoryConversionTableTopWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    .SearchInput-container {
        flex-grow: 1;
        > input {
            background-color: transparent;
            border: 1px solid transparent;
            box-shadow: none;
            margin-bottom: 0;
            font-size: 16px;
        }
    }
`;
CategoryConversionTableTopWrapper.displayName = "CategoryConversionTableTopWrapper";

export const LinkRowContainer = styled(FlexRow)`
    align-items: center;
    justify-content: flex-end;
    width: calc(100% - 200px);
    height: 100%;
    cursor: pointer;
`;
LinkRowContainer.displayName = "LinkRowContainer";
