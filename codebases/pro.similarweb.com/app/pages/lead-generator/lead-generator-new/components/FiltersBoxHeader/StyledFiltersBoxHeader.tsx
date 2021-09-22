import styled, { css } from "styled-components";
import FiltersBoxHeader from "./FiltersBoxHeader";
import { StyledTitle } from "pages/lead-generator/components/Title/styles";
import FiltersTitleWithToggleContainer from "pages/lead-generator/lead-generator-new/components/FiltersBoxHeader/FiltersTitleWithToggleContainer";

const StyledFiltersBoxHeader = styled(FiltersBoxHeader)`
    ${FiltersTitleWithToggleContainer} {
        ${(props) =>
            props.disabled &&
            css`
                cursor: default;
            `};
    }

    ${StyledTitle} {
        ${(props) =>
            props.disabled &&
            css`
                color: #7e8b98;
                cursor: default;
            `};
    }
`;

export default StyledFiltersBoxHeader;
