import { colorsPalettes } from "@similarweb/styles";
import React, { FC } from "react";
import styled from "styled-components";

const Container = styled.div<{ isValid: boolean }>`
    margin-left: 16px;
    border-radius: 3px;
    padding: 10px 20px;
    background-color: ${({ isValid }) => (isValid ? "#d9f2ea" : "#fbdfdf")};
`;

const Text = styled.div`
    font-family: Roboto;
    font-size: 14px;
    line-height: 1.29;
    letter-spacing: 0.3px;
    text-align: left;
    color: ${colorsPalettes.carbon["400"]};
`;

const Alert: FC<any> = ({ text, isValid }: { text: string; isValid: boolean }) => (
    <Container isValid={isValid}>
        <Text>{text}</Text>
    </Container>
);

export default Alert;
