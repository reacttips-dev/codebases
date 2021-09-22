import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles/";

export const ListContainer = styled.div`
    border: 1px solid ${colorsPalettes.midnight[50]};
    border-radius: 4px;
    height: 360px;
`;

export const LoaderContainer = styled.div`
    border: 1px solid ${colorsPalettes.midnight[50]};
    border-radius: 4px;
    height: 360px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ListTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: ${colorsPalettes.carbon[400]};
    margin-bottom: 13px;
`;
