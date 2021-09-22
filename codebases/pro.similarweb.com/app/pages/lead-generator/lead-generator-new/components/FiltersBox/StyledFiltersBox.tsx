import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import FiltersBox from "./FiltersBox";

const StyledFiltersBox = styled(FiltersBox)`
    background-color: ${colorsPalettes.bluegrey[100]};
    border: ${(props) => {
        return `1px solid ${
            props.isLocked?.() ? colorsPalettes.indigo[300] : rgba("#30475c", 0.1)
        }`;
    }};
    border-radius: 6px;
    margin: 16px 0;
    padding: 16px;
    position: relative;

    &:hover,
    &.with-value,
    &.expanded {
        background-color: ${colorsPalettes.carbon[0]};
        border-color: transparent;
    }

    &.with-value,
    &.expanded {
        box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    }

    &.disabled {
        background-color: ${colorsPalettes.bluegrey[100]};
        box-shadow: none;

        &.with-value,
        &:hover {
            background-color: ${colorsPalettes.bluegrey[100]};
            border-color: ${(props) =>
                props.isLocked?.() ? colorsPalettes.indigo[300] : rgba("#30475c", 0.1)};
        }
    }

    .filters-box-collapsible {
        margin-top: 19px;

        &.expanded {
            overflow: visible;
        }
    }

    .DropdownButton {
        background-color: ${colorsPalettes.carbon[0]};
        color: #536275;
        border: 1px solid ${rgba(colorsPalettes.carbon[100], 0.6)};
    }
`;

export default StyledFiltersBox;
