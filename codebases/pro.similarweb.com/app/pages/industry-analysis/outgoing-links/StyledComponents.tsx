import styled from "styled-components";
import { Box } from "@similarweb/ui-components/dist/box";
import { FlexRow } from "../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";

export const OutgoingLinksContainer: any = styled.div`
    display: flex;
    flex-direction: column;
    font-family: Roboto;
`;
OutgoingLinksContainer.displayName = "OutgoingLinksContainer";

export const StyledBox: any = styled(Box)`
    width: 100%;
    height: auto;
`;
StyledBox.displayName = "StyledBox";

export const StyledFlexRow: any = styled(FlexRow)`
    padding: 15px 20px 0;
    justify-content: space-between;
`;
StyledFlexRow.displayName = "StyledFlexRow";

export const UtilsContainer = styled.div``;
UtilsContainer.displayName = "UtilsContainer";

export const PaginationContainer = styled(FlexRow)`
    justify-content: flex-end;
    padding: 8px 0;
`;
PaginationContainer.displayName = "Pagination Container";

export const StyledPageSubHeading = styled.div`
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 20px;
`;
StyledPageSubHeading.displayName = "StyledPageSubHeading";
