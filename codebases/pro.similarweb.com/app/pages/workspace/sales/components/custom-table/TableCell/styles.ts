import styled from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { HOVERED_ROW_CLASSNAME, CAN_BE_HOVERED_ROW_CLASSNAME } from "../constants";

export const StyledTableCell = styled.div`
    align-items: center;
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
    display: flex;
    height: 40px;
    padding: 0 8px;
    ${mixins.setFont({
        $color: rgba(colorsPalettes.carbon["500"], 0.8),
        $size: 14,
    })};

    &.${CAN_BE_HOVERED_ROW_CLASSNAME} {
        &.${HOVERED_ROW_CLASSNAME} {
            background-color: ${colorsPalettes.carbon["25"]};
        }
    }
`;

export const StyledTableHeaderCell = styled(StyledTableCell)`
    ${mixins.setFont({
        $color: rgba(colorsPalettes.carbon["500"], 0.6),
        $size: 12,
        $weight: 500,
    })};
`;
