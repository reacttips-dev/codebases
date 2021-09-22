import { colorsPalettes, rgba } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { TRIAL_BANNER_HEIGHT } from "components/React/TrialBanner/TrialBanner";
import * as React from "react";
import { useState, useEffect } from "react";
import TrialService from "services/TrialService";
import styled, { css, StyledComponent } from "styled-components";

export interface IIsOpen {
    isOpen: boolean;
    isPrimaryOpen: boolean;
}

export interface IRightBarProps extends IIsOpen {
    primary: (state: IIsOpen) => React.ReactNode;
    secondary?: (state: IIsOpen) => React.ReactNode;
    isTableLoading: boolean;
    marginTop?: number;

    onCloseSidebar();
}

interface IContentPusher {
    isOpen: boolean;
    hasScroll: boolean;
}

const FixedBar = styled.div<Partial<IRightBarProps>>`
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
    z-index: 2; /* This is to cover filters bar when opened */
    width: 440px;
    height: 100%;
    display: flex;
    position: fixed;
    right: 0;
    top: ${(props) => (props.marginTop ? `${props.marginTop}px` : "0")};
    transform: translateX(${(props) => (props.isOpen ? "0" : "100%")});
    transition: transform 300ms ease-in-out;
    &.FixedBar--trial {
        height: calc(100vh - ${TRIAL_BANNER_HEIGHT}px);
        top: ${TRIAL_BANNER_HEIGHT}px;
    }
`;

const ContentPusher = styled.div<IContentPusher>`
    margin-left: auto;
    transition: width 300ms ease-in-out;
    width: ${({ isOpen, hasScroll }) => (isOpen ? (hasScroll ? "424px" : "440px") : "0")};
    flex-shrink: 0;
`;

const PrimaryContainer = styled.div<Partial<IRightBarProps>>`
    position: absolute;
    top: 0;
    left: 1px;
    width: 100%;
    height: 100%;
    transform: translateX(${({ isPrimaryOpen }) => (isPrimaryOpen ? 0 : "100%")});
    transition: transform 300ms ease-in-out;
    z-index: 7;
    background-color: ${colorsPalettes.bluegrey[100]};
`;

const RightBarWrapper = styled.div`
    border-left: 1px solid ${rgba(colorsPalettes.midnight[600], 0.08)};
    background-color: ${colorsPalettes.bluegrey[100]};
    box-sizing: border-box;
    flex-grow: 1;
`;

const SecondaryContainer = styled.div`
    flex-grow: 1;
    position: relative;
    background-color: ${colorsPalettes.bluegrey[100]};
    height: 100%;
`;

export const CloseContainer = styled.div<Partial<IRightBarProps>>`
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 8;
    ${(props) =>
        !props.isPrimaryOpen &&
        css`
            && svg,
            &&:hover svg {
                path {
                    fill: #fff;
                }
            }
        `};
`;

export const RightBar = ({
    primary,
    secondary,
    isOpen,
    isPrimaryOpen,
    onCloseSidebar,
    isTableLoading,
    marginTop,
}: IRightBarProps) => {
    const [hasScroll, setHasScroll] = useState(false);
    useEffect(() => {
        const scrollElem = $(".sw-layout-scrollable-element")[0];
        setHasScroll(scrollElem.scrollHeight > scrollElem.clientHeight);
    }, [isTableLoading]);

    const isTrial = new TrialService().isTrial();
    return (
        <>
            <ContentPusher isOpen={isOpen} hasScroll={hasScroll} />
            <FixedBar
                isOpen={isOpen}
                className={!isTrial ? "" : "FixedBar--trial"}
                marginTop={marginTop}
            >
                <RightBarWrapper>
                    <CloseContainer isPrimaryOpen={isPrimaryOpen}>
                        <IconButton
                            iconSize="xs"
                            iconName="clear"
                            type="flat"
                            onClick={onCloseSidebar}
                        />
                    </CloseContainer>
                    <PrimaryContainer isPrimaryOpen={isPrimaryOpen}>
                        {primary({ isOpen, isPrimaryOpen })}
                    </PrimaryContainer>
                    {secondary && (
                        <SecondaryContainer>
                            {secondary({ isOpen, isPrimaryOpen })}
                        </SecondaryContainer>
                    )}
                </RightBarWrapper>
            </FixedBar>
        </>
    );
};
