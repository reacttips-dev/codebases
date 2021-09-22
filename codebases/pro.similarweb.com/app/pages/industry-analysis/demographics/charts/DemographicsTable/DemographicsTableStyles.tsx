import { Box } from "@similarweb/ui-components/dist/box";
import styled from "styled-components";
import { SearchContainer } from "../../../../workspace/StyledComponent";

export const TableContainer = styled(Box)<{ loading: boolean }>`
    pointer-events: ${({ loading }: any) => (loading ? "none" : "all")};
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
`;
