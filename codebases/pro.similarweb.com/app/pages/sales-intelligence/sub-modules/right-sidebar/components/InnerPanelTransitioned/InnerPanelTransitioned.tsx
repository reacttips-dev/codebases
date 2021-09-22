import React from "react";
import { CSSTransition } from "react-transition-group";
import { StyledInnerPanelTransitioned } from "./styles";

type InnerPanelTransitionedProps = {
    in: boolean;
    name: string;
    duration?: number;
    unmountOnExit?: boolean;
    children: React.ReactNode;
};

const InnerPanelTransitioned = (props: InnerPanelTransitionedProps) => {
    const { name, duration = 300, unmountOnExit = true, children } = props;

    return (
        <CSSTransition
            in={props.in}
            classNames={name}
            timeout={duration}
            unmountOnExit={unmountOnExit}
        >
            <StyledInnerPanelTransitioned classNamePrefix={name} transitionDurationMs={duration}>
                {children}
            </StyledInnerPanelTransitioned>
        </CSSTransition>
    );
};

export default InnerPanelTransitioned;
