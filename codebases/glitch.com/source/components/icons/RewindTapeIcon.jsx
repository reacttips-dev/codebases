import React from 'react';
import styled from 'styled-components';

const StyledRewindTapeReel = styled.svg`
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0;
  ${(props) => (props.side === 'left' ? 'left: 0;' : 'right: 0;')}
  background-repeat: no-repeat;
  animation: rotate-tape-reel 1s infinite linear;
  @keyframes rotate-tape-reel {
    to {
      transform: rotate(-360deg);
    }
  }
`;

const RewindTapeReel = ({ side }) => {
  return (
    <StyledRewindTapeReel side={side} version="1.1" xmlns="http://www.w3.org/2000/svg">
      <title>rewind-tape-reel</title>
      <defs>
        <circle id="path-1" cx="5.5" cy="5.5" r="5.5" />
      </defs>
      <g id="rewind" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="rewind-tape-reel" transform="translate(1.000000, 1.000000)">
          <g id="Line-6-+-Line-7-Mask">
            <mask id="mask-2" fill="white">
              <use xlinkHref="#path-1" />
            </mask>
            <g id="Mask" />
            <polygon id="Line-6" fill="#222222" fillRule="nonzero" mask="url(#mask-2)" points="4.75 7.75 6.25 7.75 6.25 12.2915946 4.75 12.2915946" />
            <polygon id="Line-6" fill="#222222" fillRule="nonzero" mask="url(#mask-2)" points="4.75 -1.25 6.25 -1.25 6.25 3.25 4.75 3.25" />
            <polygon id="Line-7" fill="#222222" fillRule="nonzero" mask="url(#mask-2)" points="7.75 6.25 7.75 4.75 13.25 4.75 13.25 6.25" />
            <polygon id="Line-7" fill="#222222" fillRule="nonzero" mask="url(#mask-2)" points="-2.25 6.25 -2.25 4.75 3.25 4.75 3.25 6.25" />
          </g>
          <circle id="Oval-2-Copy" stroke="#222222" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round" cx="5.5" cy="5.5" r="5.5" />
        </g>
      </g>
    </StyledRewindTapeReel>
  );
};

const StyledRewindTapeContainer = styled.div`
  display: inline-block;
  position: relative;
  height: 13px;
  width: 30px;
  background-repeat: no-repeat;
`;

const RewindTapeContainer = ({ children }) => {
  return (
    <>
      <StyledRewindTapeContainer>
        <svg width="30px" height="13px" viewBox="0 0 30 13" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <title>rewind-tape</title>
          <g id="rewind" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="square" strokeLinejoin="round">
            <g id="rewind-tape" transform="translate(1.000000, 1.000000)" stroke="#222222" strokeWidth="1.5">
              <g id="RightCircle" transform="translate(17.000000, 0.000000)">
                <circle cx="5.5" cy="5.5" r="5.5" />
              </g>
              <g id="LeftCircle">
                <circle cx="5.5" cy="5.5" r="5.5" />
              </g>
              <path d="M6,11 L21.8145355,11" id="Line-5" />
            </g>
          </g>
        </svg>
        {children}
      </StyledRewindTapeContainer>
    </>
  );
};

export default function RewindTape() {
  return (
    <RewindTapeContainer>
      <RewindTapeReel side="left" />
      <RewindTapeReel side="right" />
    </RewindTapeContainer>
  );
}
