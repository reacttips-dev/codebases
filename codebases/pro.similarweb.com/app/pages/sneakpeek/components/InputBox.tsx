import React, { StatelessComponent } from "react";
import styled, { css } from "styled-components";
import Input from "./Input";
import { Label } from "../StyledComponents";

export const Container = styled.div<{ width?: string }>`
    margin-right: 8px;
    font-family: Roboto;
    margin-bottom: 8px;
    ${({ width }) =>
        width &&
        css`
            width: ${width};
        `}
`;

const InputBox: StatelessComponent<any> = ({
    placeholder = "",
    children,
    onChange,
    value = "",
    width,
    containerWidth,
    maxLength = 999,
}) => (
    <Container width={containerWidth}>
        <Label>{children}</Label>
        <Input
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            value={value}
            width={width}
            maxLength={maxLength}
        />
    </Container>
);
export default InputBox;
