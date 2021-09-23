import styled from '@emotion/styled';
import React, { useRef, useEffect, useState } from 'react';
import { IconBadge } from '../../components/IconBadge';

type TooltipPosition = 'top' | 'bottom';

type TooltipProps = {
  text: string;
  position?: TooltipPosition;
  children?: React.ReactNode;
  isOpen?: boolean;
};

type TooltipWrapper = {
  isTooltipOpen: boolean;
  position?: TooltipPosition;
};

export const TOOLTIP_INFO_ID = 'tooltip-info';

export const Tooltip: React.FC<TooltipProps> = ({
  position = 'top',
  text,
  children,
  isOpen = false,
}) => {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(isOpen);

  const handleOnClickOutside = (e: MouseEvent) => {
    if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
      setIsTooltipOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOnClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleOnClickOutside);
    };
  }, []);

  return (
    <TooltipTrigger
      role="button"
      aria-labelledby={TOOLTIP_INFO_ID}
      tabIndex={0}
    >
      {children || (
        <IconBadge
          type="InfoIcon"
          backgroundColor="gray"
          padding={1}
          width={14}
        />
      )}
      <TooltipWrapper
        ref={triggerRef}
        id={TOOLTIP_INFO_ID}
        role="tooltip"
        position={position}
        isTooltipOpen={isTooltipOpen}
      >
        <p>{text}</p>
      </TooltipWrapper>
    </TooltipTrigger>
  );
};

const TooltipTrigger = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #ffffff;

  &:hover div[role='tooltip'],
  &:focus div[role='tooltip'] {
    display: block;
  }
`;

const TooltipWrapper = styled.div<TooltipWrapper>`
  background-color: #292f36;
  border-radius: 5px;
  position: absolute;
  padding: 16px;
  width: 285px;
  z-index: 30;
  display: ${({ isTooltipOpen }) => (isTooltipOpen ? 'block' : 'none')};
  ${({ position }) => (position === 'top' ? `bottom: 40px;` : `top: 40px;`)}

  p {
    text-align: left;
    font-size: 1.2rem;
    line-height: 16px;
    color: #ffffff;
  }

  :before {
    content: '';
    position: absolute;
    left: 45%;
    width: 0;
    height: 0;
    border-left: 14px solid transparent;
    border-right: 14px solid transparent;
    ${({ position }) =>
      position === 'top'
        ? ` border-top: 20px solid #292f36; bottom: -20px;`
        : ` border-bottom: 20px solid #292f36; top: -20px;`}
  }
`;
