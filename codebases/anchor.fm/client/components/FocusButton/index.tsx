import React from 'react';
import styled from '@emotion/styled';

type Props = {
  isDisabled?: boolean;
  ariaExpanded?: boolean;
  ariaHasPopup?: boolean;
  ariaLabel?: string;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

/**
 * button component that allows you to have a focus state on an element when
 * using keyboard to focus, but not if you focus with a mouse click
 *
 * FocusButton can be used if you need persistent clickable elements that with
 * focus states only when the user navigates to them via keyboard. the only
 * styling this enforces right now is a light border around the child element
 * its wrapping. you have full control what the child component looks like
 *
 * we can deprecate this once `focus-visible` has better support
 * https://caniuse.com/?search=focus-visible
 */
export function FocusButton({
  children,
  ariaExpanded,
  ariaHasPopup,
  ariaLabel,
  type,
  onClick,
  isDisabled,
  className,
}: Props) {
  return (
    <Button
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHasPopup}
      aria-label={ariaLabel}
      type={type}
      onClick={onClick}
      className={className}
    >
      <InnerSpan className="focus-span" tabIndex={-1}>
        {children}
      </InnerSpan>
    </Button>
  );
}

const Button = styled.button`
  padding: 0;
  &:focus > .focus-span {
    border: 1px solid #702cd5;
  }
`;

const InnerSpan = styled.span`
  border: 1px solid transparent;
  display: block;
  &:focus {
    outline: 0;
  }
`;
