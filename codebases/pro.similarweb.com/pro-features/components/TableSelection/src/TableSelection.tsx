import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import * as React from "react";
import * as propTypes from "prop-types";
import styled, { css, keyframes } from "styled-components";

import { ReactNode, Component } from "react";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";

const FadeIn = keyframes`
  0% {
    transform:scale3d(1,0,1);
    opacity: 0;
    max-height: 0;
  }
  100% {
    transform:scale3d(1,1,1);
    opacity: 1;
    max-height: 56px;
  }
`;

const FadeOut = keyframes`
  0% {
    transform:scale3d(1,1,1);
    opacity: 1;
    max-height: 56px;
  }
  100% {
    transform:scale3d(1,0,1);
    opacity: 0;
    max-height: 0;
  }
`;

interface ITableSelectionProps {
    onCloseClick: () => void;
    selectedText: string;
    addToGroupLabel: string;
    groupSelectorElement: ReactNode;
    tooltipText?: string;
    className?: string;
    isVisible: boolean;
    showSeparator?: boolean;
}

interface ITableSelectionState {
    shouldFadeOut: boolean;
}

interface ITableSelectionContainerProps {
    isVisible: boolean;
}

const TableSelectionContainer = styled.div<ITableSelectionContainerProps>`
    height: ${({ isVisible }) => (isVisible ? `56px` : `0px`)};
    max-height: 56px;
    min-height: 0px;
    overflow: hidden;
    width: 100%;
    background-color: ${colorsPalettes.blue[400]};
    padding: 0 16px 0 13px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: height ease 100ms;
`;

const TableSelectionClose = styled(SWReactIcons).attrs({
    iconName: "close",
    size: "xs",
})`
    cursor: pointer;
    svg {
        path {
            stroke: ${colorsPalettes.carbon[0]};
            fill: ${colorsPalettes.carbon[0]};
        }
    }
`;

export const TableSelectionContent = styled.div`
    display: flex;
    align-items: center;
`;

export const TableSelectionSeparator = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    width: 1px;
    height: 36px;
    margin: 0 12px;
    display: flex;
    align-items: center;
`;

const TableSelectionCount = styled.div`
    ${setFont({ $size: 16, $color: colorsPalettes.carbon[0] })}
`;

const TableSelectionAddToLabel = styled.div`
    ${setFont({ $size: 16, $color: colorsPalettes.carbon[0] })}
`;

export const TableSelectionSelector = styled.div`
    margin-left: 10px;
`;

export class TableSelection extends Component<ITableSelectionProps, ITableSelectionState> {
    private shouldUpdateVisibility: boolean = false;

    static defaultProps = {
        onCloseClick: () => null,
        selectedText: "",
        tooltipText: null,
        showSeparator: true,
    };

    static contextTypes = {
        translate: propTypes.func,
        track: propTypes.func,
    };

    state = {
        shouldFadeOut: this.props.isVisible,
    };

    componentDidUpdate() {
        if (this.props.isVisible && !this.state.shouldFadeOut) {
            this.setState({ shouldFadeOut: this.props.isVisible });
        }
    }

    render() {
        const {
            onCloseClick,
            selectedText,
            addToGroupLabel,
            groupSelectorElement,
            tooltipText,
            isVisible,
            className,
            showSeparator,
        } = this.props;
        return (
            <TableSelectionContainer
                isVisible={isVisible}
                className={`TableSelection ${className}`}
            >
                <TableSelectionContent>
                    <TableSelectionCount>{selectedText}</TableSelectionCount>
                    {showSeparator && <TableSelectionSeparator />}
                    <TableSelectionAddToLabel>{addToGroupLabel}</TableSelectionAddToLabel>
                    <TableSelectionSelector>{groupSelectorElement}</TableSelectionSelector>
                </TableSelectionContent>
                {tooltipText ? (
                    <PlainTooltip tooltipContent={tooltipText}>
                        <div onClick={onCloseClick} data-automation-close={true}>
                            <TableSelectionClose />
                        </div>
                    </PlainTooltip>
                ) : (
                    <div onClick={onCloseClick} data-automation-close={true}>
                        <TableSelectionClose />
                    </div>
                )}
            </TableSelectionContainer>
        );
    }
}
