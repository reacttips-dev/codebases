import React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";

const InputStyled = styled.input`
    width: 87px;
    height: 40px;
    padding-left: 10px;
    border: 1px solid ${colorsPalettes.carbon[100]};
    background-color: ${colorsPalettes.bluegrey[100]};
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[500] })}
    &::placeholder {
        ${setFont({ $size: 14, $color: colorsPalettes.carbon[300] })};
    }
`;
const Seperator = styled.div`
    margin: auto 4px auto 4px;
`;

export const RangeFilterToDashboard = ({
    onFromChange,
    onToChange,
    fromPlaceholder,
    toPlaceholder,
    fromRange,
    toRange,
    onBlur,
}) => {
    const onMinChange = (event) => {
        if (isNaN(Number(event.target.value))) {
            return;
        }
        onFromChange(event.target.value);
    };

    const onMaxChange = (event) => {
        if (isNaN(Number(event.target.value))) {
            return;
        }
        onToChange(event.target.value);
    };

    return (
        <div style={{ display: "flex" }}>
            <InputStyled
                placeholder={fromPlaceholder}
                value={fromRange}
                onChange={onMinChange}
                onBlur={onBlur}
            />
            <Seperator>-</Seperator>
            <InputStyled
                placeholder={toPlaceholder}
                value={toRange}
                onChange={onMaxChange}
                onBlur={onBlur}
            />
        </div>
    );
};
