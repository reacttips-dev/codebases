import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";

export const StyledEmailDate = styled.div`
    color: ${rgba(colorsPalettes.carbon["500"], 0.6)};
    font-weight: 500;
`;

export const StyledBenchmarkEmailDate = styled.div`
    display: flex;
    align-items: center;
`;

export const IconsStyled = styled(SWReactIcons)`
    height: 18px;
    width: 18px;
    margin-right: 4px;
`;
