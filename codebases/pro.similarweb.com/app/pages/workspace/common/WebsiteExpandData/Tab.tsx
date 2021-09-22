import React from "react";
import styled, { css, keyframes } from "styled-components";

import { FEED_TAB, ANALYSIS_TAB, DASHBOARDS_TAB } from "../consts";

export interface ITabContainer {
    isEntering: boolean;
    isLeaving: boolean;
    animation: string;
}

const slideEnteringRight = keyframes`
  from {
    transform:translateX(100%);
  }

  to {
    transform:translateX(0);
  }
`;

const slideEnteringLeft = keyframes`
  from {
    transform:translateX(-100%);
  }

  to {
    transform:translateX(0);
  }
`;

const slideLeavingRight = keyframes`
  0% {
    transform: translateX(0);
  }
  99% {
    max-height: initial;
  }
  100% {
    transform: translateX(100%);
    max-height: 0;
    overflow: hidden;
  }
`;

const slideLeavingLeft = keyframes`
  0% {
    transform: translateX(0);
  }
  99% {
    max-height: initial;
  }
  100% {
    transform: translateX(-100%);
    max-height: 0;
    overflow: hidden;
  }
`;

export const TabContainer = styled.div<ITabContainer>`
    position: absolute;
    overflow: hidden;
    left: 0;
    z-index: ${(props) => (props.isEntering ? 5 : 4)};
    padding-top: 22px;
    width: 100%;
    ${({ isLeaving, isEntering }) =>
        !isEntering &&
        !isLeaving &&
        css`
            transform: translateX(100%);
            max-height: 0;
        `};
    ${({ animation }) =>
        !!animation &&
        css`
            animation: ${animation} 0.9s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        `};
`;
export const Tab = ({ name, selectedTab, previouslySelectedTab, children }) => {
    const weights = {
        [FEED_TAB]: 0,
        [ANALYSIS_TAB]: 1,
        [DASHBOARDS_TAB]: 2,
    };
    const isLeaving = name === previouslySelectedTab;
    const isEntering = name === selectedTab;
    const {
        [selectedTab]: enteringTabWeight,
        [previouslySelectedTab]: leavingTabWeight,
    } = weights as { [key: string]: number };
    let animation = null;
    if (isLeaving) {
        if (enteringTabWeight > leavingTabWeight) {
            animation = slideLeavingLeft;
        } else if (enteringTabWeight < leavingTabWeight) {
            animation = slideLeavingRight;
        }
    } else if (isEntering) {
        if (enteringTabWeight > leavingTabWeight) {
            animation = slideEnteringRight;
        } else if (enteringTabWeight < leavingTabWeight) {
            animation = slideEnteringLeft;
        }
    }
    return (
        <TabContainer
            isLeaving={isLeaving}
            isEntering={isEntering}
            animation={(isLeaving || isEntering) && animation}
        >
            {children}
        </TabContainer>
    );
};
