import styled from '@emotion/styled';
import React from 'react';

type ZoomButtonsProps = {
  onZoomOut: () => void;
  onZoomIn: () => void;
  isDisabled?: boolean;
};

export function ZoomButtons({
  onZoomIn,
  onZoomOut,
  isDisabled = false,
}: ZoomButtonsProps) {
  return (
    <>
      <ZoomOutButton onClick={onZoomOut} disabled={isDisabled}>
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.1889 16L12.7944 11.5C13.6306 10.3 14.1167 8.84 14.1167 7.26C14.1167 3.24 10.9667 0 7.05833 0C3.15 0 0 3.24 0 7.26C0 11.28 3.15 14.52 7.05833 14.52C8.575 14.52 9.99444 14.02 11.1417 13.18L15.5361 17.7C15.925 18.1 16.5861 18.1 16.975 17.7L17.1889 17.48C17.5778 17.08 17.5778 16.42 17.1889 16ZM7.05833 12.36C4.31667 12.36 2.1 10.08 2.1 7.26C2.1 4.44 4.31667 2.16 7.05833 2.16C9.8 2.16 12.0167 4.44 12.0167 7.26C12.0167 10.08 9.8 12.36 7.05833 12.36Z"
            fill="#5F6369"
          />
          <path
            d="M4.70557 6.34C4.21946 6.34 3.83057 6.74 3.83057 7.24C3.83057 7.74 4.21946 8.14 4.70557 8.14H9.41112C9.89723 8.14 10.2861 7.74 10.2861 7.24C10.2861 6.74 9.89723 6.34 9.41112 6.34H4.70557Z"
            fill="#5F6369"
          />
        </svg>
        <span>Zoom out (-)</span>
      </ZoomOutButton>
      <ZoomInButton onClick={onZoomIn} disabled={isDisabled}>
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.2957 16L12.8739 11.5C13.7152 10.3 14.2043 8.84 14.2043 7.26C14.2043 3.24 11.0348 0 7.10217 0C3.16957 0 0 3.24 0 7.26C0 11.28 3.16957 14.52 7.10217 14.52C8.62826 14.52 10.0565 14.02 11.2109 13.18L15.6326 17.7C16.0239 18.1 16.6891 18.1 17.0804 17.7L17.2957 17.48C17.687 17.08 17.687 16.42 17.2957 16ZM7.10217 12.36C4.34348 12.36 2.11304 10.08 2.11304 7.26C2.11304 4.44 4.34348 2.16 7.10217 2.16C9.86087 2.16 12.0913 4.44 12.0913 7.26C12.0913 10.08 9.86087 12.36 7.10217 12.36Z"
            fill="#5F6369"
          />
          <path
            d="M4.83258 6.34C4.34345 6.34 3.95215 6.74 3.95215 7.24C3.95215 7.74 4.34345 8.14 4.83258 8.14H9.56737C10.0565 8.14 10.4478 7.74 10.4478 7.24C10.4478 6.74 10.0565 6.34 9.56737 6.34H4.83258Z"
            fill="#5F6369"
          />
          <path
            d="M6.2998 9.58C6.2998 10.08 6.69111 10.48 7.18024 10.48C7.66937 10.48 8.06067 10.08 8.06067 9.58L8.06067 4.74C8.06067 4.24 7.66937 3.84 7.18024 3.84C6.69111 3.84 6.2998 4.24 6.2998 4.74L6.2998 9.58Z"
            fill="#5F6369"
          />
        </svg>
        <span>Zoom in (+)</span>
      </ZoomInButton>
    </>
  );
}

const ZoomButton = styled.button`
  position: relative;
  border: 2px solid #dfe0e1;
  height: 50px;
  width: 50px;

  &:hover {
    background: #ebebec;
    span {
      opacity: 1;
    }
  }
  &:focus::before {
    content: '';
    border: 1px dotted #c9cbcd;
    width: 92%;
    position: absolute;
    height: 90%;
    border-radius: 50% 0px 0 50%;
    top: 3px;
    left: 2px;
  }

  & span {
    transition: opacity 0.15s ease-in-out;
    opacity: 0;
    color: #7f8287;
    position: absolute;
    bottom: -20px;
    font-size: 12px;
    white-space: nowrap;
    left: -7px;
  }
  & svg {
    position: absolute;
    top: 13px;
  }
`;

const ZoomOutButton = styled(ZoomButton)`
  border-radius: 50% 0px 0 50%;
  & svg {
    left: 17px;
  }
  &:focus::before {
    border-radius: 50% 0px 0 50%;
    top: 3px;
    left: 2px;
  }
`;

const ZoomInButton = styled(ZoomButton)`
  border-left: none;
  border-radius: 0 50% 50% 0;
  & svg {
    left: 13px;
  }
  &:focus::before {
    border-radius: 0 50% 50% 0;
    top: 3px;
    left: 2px;
  }
`;
