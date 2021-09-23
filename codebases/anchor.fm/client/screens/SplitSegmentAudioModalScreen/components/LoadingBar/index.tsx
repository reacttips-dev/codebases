import React from 'react';
import styled from '@emotion/styled';
import { WaveformProcessingStatus } from '../Waveform/types';
import { Button } from '../../../../shared/Button/NewButton';

type Props = {
  state?: WaveformProcessingStatus;
  onRetry: () => void;
  hideCopy?: boolean;
};

const Container = styled.div`
  position: absolute;
  text-align: center;
  padding: 0px 120px;
  height: 270px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 3;
`;

const Title = styled.p`
  font-weight: bold;
  /* !important needed to override react-bootstrap-modal styles */
  font-size: 2.4rem !important;
  color: #ffffff !important;
`;

const Copy = styled.p`
  /* !important needed to override react-bootstrap-modal styles */
  font-size: 1.8rem !important;
  color: #ffffff !important;
`;

const Bar = styled.div`
  position: relative;
  width: 100%;
  height: 0.25rem;
  margin-bottom: 1rem;
  overflow: hidden;
  background-color: #7fb3f3;
  display: flex;
  height: 1rem;
  border-radius: 0.25rem;
  border-radius: 4px;

  & div::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    content: '';
    background-color: #fff;
    animation: progress 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    will-change: left, right;
  }

  @keyframes progress {
    0% {
      right: 100%;
      left: -35%;
    }
    60% {
      right: -90%;
      left: 100%;
    }
    100% {
      right: -90%;
      left: 100%;
    }
  }
`;

const RetryButton = styled(Button)`
  width: 150px;
  align-self: center;
`;

const ErrorState = ({ onRetry }: Pick<Props, 'onRetry'>) => (
  <Container>
    <Title>Sorry, something went wrong.</Title>
    <RetryButton color="white" onClick={onRetry}>
      Retry
    </RetryButton>
  </Container>
);

export function LoadingBar({ state, onRetry, hideCopy }: Props) {
  const loadingText =
    state === WaveformProcessingStatus.WAITING ? 'Generating' : 'Loading';
  return state === WaveformProcessingStatus.FAILED ? (
    <ErrorState onRetry={onRetry} />
  ) : (
    <Container
      aria-busy="true"
      aria-live="polite"
      role="alert"
      aria-label={loadingText}
    >
      <Title aria-hidden="true">{loadingText}...</Title>
      {!hideCopy && (
        <Copy>
          You can use this tool to split your audio into multiple segments. Then
          use the episode builder to move or insert other segments.
        </Copy>
      )}
      <Bar>
        <div />
      </Bar>
    </Container>
  );
}
