import React, { MouseEvent } from 'react';
import styled from '@emotion/styled';
import { DropdownButton } from '../DropdownButton';
import InfoBubble from '../InfoBubble';
import styles from './styles.sass';

const Info = styled.span`
  display: inline-block;
  line-height: 14px;
  height: 14px;
  width: 14px;
  background-color: #c9cbcd;
  font-weight: bold;
  font-size: 12px;
  color: #fff;
  padding: 0;
  margin: 0;
  border-radius: 7px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background: #c7c7c7;
  }
`;

type Props = {
  direction: string;
  children?: React.ReactNode;
  width: number;
  activeOnHover?: boolean;
  infoBubbleClassName?: string;
  infoButtonIconClassName?: string;
  ariaLabel?: string;
};

// Info button that provides
const InfoButton = ({
  direction,
  children,
  width,
  activeOnHover,
  infoBubbleClassName = '',
  infoButtonIconClassName = '',
  ariaLabel,
}: Props) => (
  <DropdownButton
    ariaLabel={ariaLabel}
    activeOnHover={activeOnHover}
    direction={direction}
    onClick={(e: MouseEvent) => e.stopPropagation()}
    dropdownComponent={
      <InfoBubble
        positionAgainstParent={false}
        className={`${styles.bubble} ${infoBubbleClassName}`}
        direction={direction}
        width={width}
      >
        {children}
      </InfoBubble>
    }
  >
    <Info className={infoButtonIconClassName}>i</Info>
  </DropdownButton>
);

export default InfoButton;
