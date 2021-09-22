import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

const TOP_BAR_HEIGHT = 60;

export const StyledTopBarBody = styled.div`
    display: flex;
    flex-grow: 1;
    padding: 10px 15px;
`;

export const StyledBackContainer = styled.div`
    align-items: center;
    border-right: 1px solid ${colorsPalettes.carbon["50"]};
    display: flex;
    justify-content: center;
    width: 60px;
`;

export const StyledTobBar = styled.div`
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
    display: flex;
    height: ${TOP_BAR_HEIGHT}px;
`;
