import styled from "styled-components";

// we have strange padding in swReactTableCell, making such margins to make content centered
export const SegmentCellContainer = styled.div<{ withSegments: boolean }>`
    margin-top: ${({ withSegments }) => (withSegments ? "-8px" : "-2px")};
`;
SegmentCellContainer.displayName = "SegmentCellContainer";
