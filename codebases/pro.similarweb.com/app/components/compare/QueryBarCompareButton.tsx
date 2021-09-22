import { colorsPalettes, rgba } from "@similarweb/styles";
import { Button, IButtonProps } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import { FunctionComponent } from "react";
import styled, { css, keyframes } from "styled-components";

interface IQueryBarCompareButtonProps extends IButtonProps {
    animationActive: boolean;
    onCompareClick: () => void;
    buttonText: string;
    className?: string;
}

const queryButtonAnimation = keyframes`
    0% {
        width: 0;
    }
    20% {
        width: 100%;
    }
    100% {
           width: 100%;
    }
`;

const QueryBarCompareButtonStyle = styled(Button)<{ isAnimationActive: boolean }>`
    position: relative;
    button div {
        z-index: 2;
    }

    :before {
        content: "";
        position: absolute;
        height: 100%;
        border-radius: 69px;
        width: 0;
        top: 0;
        left: 0;
        background: ${rgba(colorsPalettes.orange[100], 0.3)};
        z-index: 1;
        ${({ isAnimationActive }) =>
            isAnimationActive &&
            css`
                animation-name: ${queryButtonAnimation};
                animation-duration: 3s;
                animation-timing-function: cubic-bezier(0.4, 0, 0.23, 1);
                animation-iteration-count: 3;
                animation-delay: 5s;
            `};
    }
`;

export class QueryBarCompareButton extends React.Component<IQueryBarCompareButtonProps, {}> {
    render() {
        const { animationActive, onCompareClick, buttonText, className } = this.props;
        return (
            <QueryBarCompareButtonStyle
                className={className}
                type="compare"
                onClick={onCompareClick}
                isAnimationActive={animationActive}
            >
                {buttonText}
            </QueryBarCompareButtonStyle>
        );
    }
}
