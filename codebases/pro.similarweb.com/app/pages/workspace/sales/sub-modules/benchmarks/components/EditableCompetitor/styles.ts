import styled from "styled-components";
import { StyledCloseIconContainer } from "pages/workspace/sales/components/WebsiteDomain/styles";

export const StyledHeader = styled.div`
    display: flex;
    justify-content: space-between;
`;
export const StyledCompetitorContainer = styled.div`
    display: flex;
    position: relative;

    &:not(:last-child) {
        margin-bottom: 8px;
    }

    ${StyledCloseIconContainer} {
        opacity: 0;
    }

    .ScrollArea {
        max-height: 135px !important;
    }

    .ItemText {
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100px;
    }
`;

export const StyledAddWebsiteButton = styled.div`
    position: relative;
    margin-bottom: 16px;

    .Button {
        padding: 0 12px;
    }

    .ScrollArea {
        max-height: 108px !important;
    }

    .ItemText {
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100px;
    }
`;
