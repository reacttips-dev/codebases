import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";

export const LoaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 200px;
`;

export const TabsContainer = styled.div`
    background-color: white;
    height: fit-content;
    min-height: 300px;
    box-shadow: 0 3px 6px 0 ${rgba(colorsPalettes.carbon[200], 0.5)};
    border-radius: 6px;
`;
