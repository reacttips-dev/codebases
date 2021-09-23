/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';
import styled from '@emotion/styled';

type Props = {
  type: 'connecting' | 'connected';
};

type DotCount = 1 | 2 | 3;

export function ConnectDots({ type }: Props) {
  switch (type) {
    case 'connecting':
      return (
        <LoadingDotWrapper>
          <div css={getLoadingDotCss(1)} />
          <div css={getLoadingDotCss(2)} />
          <div css={getLoadingDotCss(3)} />
        </LoadingDotWrapper>
      );
    case 'connected':
    default:
      return (
        <ConnectedDotWrapper>
          <div
            css={css`
              background-color: #2dcfb3;
              border-radius: 100%;
              width: 100%;
              height: 100%;
              animation: ${dotFadeIn} 1s;
            `}
          />
        </ConnectedDotWrapper>
      );
  }
}

const dotFadeIn = keyframes`
  0% {
    opacity: 0
  }
  100% {
    opacity: 1
  }
`;

const ConnectedDotWrapper = styled.div`
  border: 1px solid #2dcfb3;
  padding: 1px;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  display: inline-block;
`;

const LoadingDotWrapper = styled.div`
  display: inline-flex;
`;

function getLoadingDotCss(dotCount: DotCount) {
  return {
    borderRadius: '100%',
    height: 6,
    width: 6,
    backgroundColor: '#acaeb1',
    marginRight: 4,
    animation: `${getLoadingDotKeyframes(dotCount)} 2s infinite`,
  };
}

// there's probably a more 1337 way of doing this, but this works for now
function getLoadingDotKeyframes(dotCount: DotCount) {
  switch (dotCount) {
    case 1:
      return keyframes`
        0% {
          opacity: 0
        }
        50% {
          opacity: .5
        }
        100% {
          opacity: 1
        }
      `;
    case 2:
      return keyframes`
        0% {
          opacity: .5
        }
        50% {
          opacity: 1
        }
        100% {
          opacity: 0
        }
      `;
    case 3:
      return keyframes`
        0% {
          opacity: 1
        }
        50% {
          opacity: 0
        }
        100% {
          opacity: .5
        }
      `;
  }
}
