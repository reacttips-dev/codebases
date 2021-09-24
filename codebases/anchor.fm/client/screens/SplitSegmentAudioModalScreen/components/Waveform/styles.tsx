import { css } from '@emotion/core';
import styled from '@emotion/styled';

export const GlobalWaveformStyles = css`
  .wave-wrapper {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    &::-webkit-scrollbar {
      /* WebKit */
      width: 0;
      height: 0;
    }
  }

  .wave-segment {
    border-radius: 10px;
  }

  // For SAI Wavform
  // We want to keep the regions visible no matter what the waveform size
  .wavesurfer-region {
    width: 3px !important;
    z-index: 3 !important;
  }

  .wave-segment[data-segment-deleted='true'] {
    background-color: rgba(0, 0, 0, 0.3);
  }
  .wave-segment::before,
  .wave-segment::after {
    content: '';
    width: 100%;
    display: block;
    height: 20px;
    position: absolute;
    background: rgb(80, 155, 245) none repeat scroll 0% 0%;
    border-radius: 10px;
    z-index: -1;
  }
  .wave-segment::before {
    top: 0;
  }
  .wave-segment::after {
    bottom: 0;
  }
  .wave-segment[data-segment-deleted='true']::before,
  .wave-segment[data-segment-deleted='true']::after {
    background: rgb(57, 107, 171);
  }
  .wave-handle.wave-handle-end {
    width: 0px;
  }
  .wave-handle.wave-handle-start::before,
  .wave-handle.wave-handle-start::after,
  .wave-handle.wave-handle-end::before,
  .wave-handle.wave-handle-end::after {
    content: '';
    display: block;
    position: absolute;
    background: #f7f7f7;
    height: 10px;
    width: 10px;
    z-index: -2;
    left: -7px;
  }
  .wave-handle.wave-handle-start::before,
  .wave-handle.wave-handle-start::after {
    left: 0;
  }
  .wave-handle.wave-handle-end::before,
  .wave-handle.wave-handle-end::after {
    left: -10px;
  }
  .wave-handle.wave-handle-end::before {
    top: -10px;
  }
  .wave-handle.wave-handle-end::after {
    bottom: -11px;
  }
  .wave-handle.wave-handle-start::before {
    top: -10px;
  }
  .wave-handle.wave-handle-start::after {
    bottom: -11px;
  }
  .wave-handle-remove {
    position: absolute;
    bottom: 7px;
    left: -7px;
    padding: 0;
    line-height: 0;
  }
  .wave-handle-remove:first-of-type {
    display: none;
  }
  .wave-minimized {
    position: absolute;
    bottom: 6px;
    left: -9px;
    padding: 0;
    background-color: #5000b9;
    line-height: 0;
    width: 20px;
    height: 20px;
    color: white;
    border-radius: 50%;
    font-size: 1.4rem;
    display: none;
    z-index: 6;
  }
  .wave-handle-delete {
    position: absolute;
    top: 8px;
    right: 16px;
    padding: 0;
    & span {
      color: #fff;
      transition: opacity 0.15s ease-in-out;
      opacity: 0;
      position: absolute;
      left: -10px;
      bottom: -14px;
      font-size: 1.2rem;
      white-space: nowrap;
      text-align: center;
      width: 42px;
    }
    &:hover span {
      opacity: 1;
    }
  }
  .wave-minimap {
    border-radius: 4px;
  }
  .wave-progress,
  .wave-minimap-progress {
    z-index: 30 !important;
    overflow: visible !important;
    &::before {
      content: '';
      position: absolute;
      top: 0px;
      right: -9px;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 12px solid #000;
      z-index: 3;
    }
  }
  .wave-progress-playhead {
    position: absolute;
    top: 0px;
    right: -20px;
    font-size: 1.2rem;
    color: white;
    background: black;
    border-radius: 10px;
    z-index: 30;
  }
  .wave-handle-input {
    position: absolute;
    top: 7px;
    left: 16px;
    background: transparent;
    border: none;
    color: white;
    max-width: 170px;
    width: 60%;
    white-space: nowrap;
    font-size: 1.6rem;
    height: 24px;
    resize: none;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    &::-webkit-scrollbar {
      /* WebKit */
      width: 0;
      height: 0;
    }
    &:focus {
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.1),
          rgba(255, 255, 255, 0.1)
        ),
        #509bf5;
      height: 40%;
      border: 1px solid white;
      border-radius: 10px;
      width: 80%;
      max-width: 250px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      white-space: unset;
    }
  }
`;

type TimestampInputProps = {
  error: boolean;
};
export const TimestampInput = styled.input<TimestampInputProps>`
  font-family: monospace;
  font-weight: bold;
  font-size: 2.8rem;
  color: #292f36;
  margin: 0 26px;
  width: 220px;
  padding: 0 6px;
  border-radius: 6px;
  border: ${({ error }: TimestampInputProps) =>
    error ? '2px solid #e54751' : '2px solid transparent'};
  &:disabled {
    background: #fff;
  }
  &:focus {
    outline: none;
    border: 2px solid #5000b9;
  }
`;

export const WaveformControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 70px;
  padding: 0 40px;

  & > div {
    display: flex;
    align-items: center;
  }
`;

export const TimestampInputError = styled.p`
  position: absolute;
  top: 60px;
  width: 250px;
  margin-left: 32px;
  /* !important needed to override react-bootstrap-modal styles */
  font-size: 1.2rem !important;
  color: #e54751 !important;
`;

export const TimestampInputLabel = styled.label`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

export const WaveformFooter = styled.div`
  position: fixed;
  bottom: 0;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  background: #fff;
  z-index: 30;
  & > div {
    display: flex;
    justify-content: flex-end;
    padding: 12px 40px;
  }
`;
