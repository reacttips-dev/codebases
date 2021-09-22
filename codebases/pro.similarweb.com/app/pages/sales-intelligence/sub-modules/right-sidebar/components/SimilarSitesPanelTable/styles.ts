import styled from "styled-components";
import WebsiteDomain from "pages/workspace/sales/components/WebsiteDomain/WebsiteDomain";
import { colorsPalettes, mixins } from "@similarweb/styles";
import { StyledDomainText } from "pages/workspace/sales/components/WebsiteDomain/styles";
import { StyledTableHeaderCell } from "pages/workspace/sales/components/custom-table/TableCell/styles";
import {
    StyledTableColumn,
    StyledTableHeader,
} from "pages/workspace/sales/components/custom-table/Table/styles";

export const StyledTooltipTitle = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon["0"], $weight: 700, $size: 13 })};
`;

export const StyledTooltipText = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon["0"], $size: 13 })};
    line-height: 20px;
`;

export const StyledDeleteIcon = styled.div`
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: -6px;
`;

export const StyledLink = styled.div`
    cursor: pointer;
    margin-left: 8px;

    svg path {
        fill: ${colorsPalettes.carbon["200"]};
    }
`;

export const StyledSimilarityCell = styled.div`
    font-size: 14px;
    padding-left: 8px;
    padding-right: 52px;
    position: relative;
`;

export const StyledDomainCell = styled.div`
    align-items: center;
    display: flex;
    padding: 0 8px;
    max-width: 100%;
`;

export const StyledWebsiteDomain = styled(WebsiteDomain)`
    max-width: 100%;
    padding-right: 4px;

    ${StyledDomainText} {
        font-size: 14px;
    }
`;

export const StyledTable = styled.div`
    border-top: 1px solid ${colorsPalettes.carbon["50"]};

    ${StyledTableColumn} {
        overflow: hidden;
    }

    ${StyledTableHeader} {
        background-color: ${colorsPalettes.carbon["25"]};
        cursor: default;

        ${StyledTableColumn} {
            ${StyledTableHeaderCell} {
                height: 32px;
            }

            &:first-child {
                border-right: 1px solid ${colorsPalettes.carbon["50"]};

                ${StyledTableHeaderCell} {
                    padding: 0 16px;
                }
            }

            &:last-child {
                ${StyledTableHeaderCell} {
                    padding: 0 60px 0 16px;
                }

                &:hover {
                    background-color: ${colorsPalettes.carbon["100"]};
                }
            }
        }
    }
`;
