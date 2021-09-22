import * as React from "react";
import Toast from "./Toast";
import styled from "styled-components";
import { TransitionGroup } from "react-transition-group";
import transition from "styled-transition-group";
import { IToast } from "components/React/Toast/types";

type ToastsProps = StateProps & DispatchProps;

export interface StateProps {
    toasts: IToast[];
}

export interface DispatchProps {
    hideToast: (toast: IToast) => any;
}
const Fade = transition.div.attrs({
    timeout: 700,
})`
  &:enter {
    opacity: 0.01;
  }
  &:enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in-out;
  }
  &:exit {
    opacity: 1;
  }
  &:exit-active {
    opacity: 0.01;
    transition: opacity 500ms ease-in-out;
  }
`;
const ToastContainer = styled.div`
    position: absolute;
    z-index: 2000; //todo: combine with _z-index.scss somehow
    bottom: 30px;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const Toasts = ({ toasts, hideToast }: ToastsProps) => (
    <ToastContainer>
        <TransitionGroup>
            {toasts.map((toast: IToast, index) => (
                <Fade key={index}>
                    <Toast toast={toast} hideToast={() => hideToast(toast)} />
                </Fade>
            ))}
        </TransitionGroup>
    </ToastContainer>
);

export default Toasts;
