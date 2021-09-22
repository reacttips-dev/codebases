import * as React from "react";
import styled from "styled-components";
import { fonts, mixins } from "@similarweb/styles";
import { IToast } from "components/React/Toast/types";

interface ToastProps {
    toast: IToast;
    hideToast: React.EventHandler<React.MouseEvent<HTMLDivElement>>;
}
const ToastStyled = styled.div`
    height: 56px;
    border-radius: 4px;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12), 0 6px 6px 0 rgba(0, 0, 0, 0.24);
    background-color: #1b2653;
    font-family: ${fonts.$robotoFontFamily};
    font-size: 14px;
    line-height: 20px;
    color: #fff;
    display: flex;
    align-items: center;
    text-align: center;
    padding: 0 24px;
    margin-top: 20px;
`;

const Toast = ({ toast, hideToast }: ToastProps) => (
    <ToastStyled className={`toast ${toast.className}`}>{toast.text}</ToastStyled>
);

export default Toast;
