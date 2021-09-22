import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { StyledIconButtonViewDetails } from "../ViewDetailsButton/styles";
import { StyledAddWebsiteButton, StyledCompetitorContainer } from "../EditableCompetitor/styles";
import {
    StyledCloseIconContainer,
    StyledWebsiteDomainContainer,
} from "pages/workspace/sales/components/WebsiteDomain/styles";

export const StyledItemVisualisation = styled.div`
    ${StyledAddWebsiteButton} {
        opacity: 0;
        transition: opacity 200ms ease-in-out;
        visibility: hidden;
    }

    &:hover {
        ${StyledCompetitorContainer} {
            ${StyledWebsiteDomainContainer} {
                background-color: ${colorsPalettes.carbon["25"]};
            }

            ${StyledCloseIconContainer} {
                opacity: 1;
            }
        }

        ${StyledAddWebsiteButton} {
            opacity: 1;
            visibility: visible;
            padding: 10px 0;
        }
    }
`;

export const StyledInnerContent = styled.div`
    cursor: default;
    margin: 10px 24px 15px 24px;
    border: 1px solid ${colorsPalettes.carbon["50"]};
    padding: 24px 16px 16px;
    border-radius: 4px;
`;

export const StyledItemDetails = styled.div<{ expanded: boolean }>`
    margin: 21px 24px 0 24px;
    padding-bottom: ${({ expanded }) => (expanded ? "14px" : "24px")};
`;

export const StyledItemContainer = styled.div<{ expanded: boolean }>`
    cursor: pointer;
    background-color: ${colorsPalettes.carbon["0"]};
    border-radius: 6px;
    box-shadow: ${({ expanded }) =>
        expanded
            ? `0 12px 24px 0 ${rgba(colorsPalettes.black["0"], 0.2)}`
            : `0 3px 6px 0 ${rgba(colorsPalettes.midnight["600"], 0.08)}`};
    transform: ${({ expanded }) => (expanded ? "translate3d(0, -4px, 0)" : "translate3d(0, 0, 0)")};
    transition: box-shadow 100ms ease-in-out, transform 100ms ease-in-out;

    &:not(:last-child) {
        margin-bottom: 24px;
    }

    &:last-child {
        margin-bottom: 24px;
    }

    &:hover {
        box-shadow: 0 12px 24px 0 ${rgba(colorsPalettes.black["0"], 0.2)};
        transform: translate3d(0, -4px, 0);

        ${StyledIconButtonViewDetails} {
            height: 37px;
            opacity: 1;
            visibility: visible;
        }
    }
`;
