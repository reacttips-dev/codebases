import * as React from "react";
import styled from "styled-components";

const ToastItemStyled = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    a {
        padding-left: 15px;
        text-transform: uppercase;
        cursor: pointer;
    }
`;

export const ToastItem = ({ text, onClick, linkText, href }) => (
    <ToastItemStyled>
        <span>{text}</span>
        <a href={href} onClick={onClick}>
            {linkText}
        </a>
    </ToastItemStyled>
);
export const getToastItemComponent = (props) => <ToastItem {...props} />;
