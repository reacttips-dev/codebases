import { colorsPalettes } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled from "styled-components";

export const StyledBox = styled(Box)`
    width: 100%;
    margin-bottom: 24px;
    height: auto;
    min-height: 400px;
`;
StyledBox.displayName = "StyledBox";

export const BoxFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 12px;
`;
BoxFooter.displayName = "BoxFooter";

export const TableWrapper: any = styled(Box)`
    pointer-events: ${({ isLoading }: any) => (isLoading ? "none" : "all")};

    width: 100%;
    height: auto;

    border-radius: 0 0 6px 6px;

    display: block;

    box-shadow: none;

    .swReactTable-wrapper {
        overflow-x: hidden;
    }
`;
TableWrapper.displayName = "TableWrapper";
