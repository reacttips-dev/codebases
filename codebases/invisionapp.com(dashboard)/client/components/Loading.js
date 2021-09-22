import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import Info from '@invisionapp/helios/icons/Info'
import Check from '@invisionapp/helios/icons/Check'
import { Text } from '@invisionapp/helios'

import inLogo from '../assets/img/in.svg'

export default class LoadingSpinner extends React.Component {
  renderInnerCirlce() {
    return this.props.warning ? (
      <StyledInfoIcon
        success={this.props.success}
        fill="info"
        size={48}
        className="checkmark"
      />
    ) : (
      <StyledCheckIcon
        success={this.props.success}
        fill="info"
        size={48}
        className="checkmark"
      />
    )
  }

  render() {
    const {
      className,
      showLogo,
      subtitleSuccess,
      success,
      textLoading,
      textSuccess,
      textWarning,
      visible,
      warning
    } = this.props
    return (
      <LoadingWrapper success={success} className={className}>
        <svg className="circular" viewBox="0 0 64 64">
          <circle className="path" cx="32" cy="32" r="30" fill="none" strokeWidth="1" />
        </svg>

        {showLogo && <StyledInLogo success={success} />}

        {success && this.renderInnerCirlce()}

        {visible && (
          <LoadingText
            className="fadingText"
            order="subtitle"
            size="larger"
            $isHidden={success}
          >
            {textLoading || 'Loading'}
          </LoadingText>
        )}
        {visible && textSuccess && (
          <SuccessText
            className="fadingText"
            order="subtitle"
            size="larger"
            $isVisible={success && !warning}
          >
            {textSuccess}
          </SuccessText>
        )}
        {visible && subtitleSuccess && (
          <SuccessText
            className="fadingText subtitle"
            order="body"
            size="larger"
            $isVisible={success && !warning}
          >
            {subtitleSuccess}
          </SuccessText>
        )}
        {visible && textWarning && (
          <SuccessText
            className="fadingText"
            order="subtitle"
            size="larger"
            $isVisible={success && warning}
          >
            {textWarning}
          </SuccessText>
        )}
      </LoadingWrapper>
    )
  }
}

const LoadingText = styled(Text)`
  ${({ $isHidden }) => ($isHidden ? 'opacity: 0;' : '')};
`

const SuccessText = styled(Text)`
  ${({ $isVisible }) => ($isVisible ? '' : 'opacity: 0;')};
  margin-top: ${({ theme }) => theme.spacing.m};
`

const rotate = keyframes`
  100%{
    transform: rotate(360deg);
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`

const rotateIn = keyframes`
  from {
    opacity: 0;
    transform: rotate(-100deg);
  }
  to {
    opacity: 1;
    transform: rotate(0deg);
  }
`

const loadingdash = keyframes`
  0%{
      stroke-dasharray: 1,200;
      stroke-dashoffset: 0;
  }
  50%{
      stroke-dasharray: 150,200;
      stroke-dashoffset: -50;
  }
  100%{
      stroke-dasharray: 150,200;
      stroke-dashoffset: -185;
  }
`

const StyledInLogo = styled(({ success, ...rest }) => (
  <img src={inLogo} alt="InVision Logo" {...rest} />
))`
  position: absolute;
  transistion: ${() =>
      css`
        ${fadeIn}
      `}
    0.3s cubic-bezier(0.645, 0.045, 0.155, 0.77) forwards;

  ${({ success }) =>
    success
      ? css`
          animation: ${fadeOut} 0.6s cubic-bezier(0.645, 0.045, 0.155, 0.77) forwards;
        `
      : ''};
`

const LoadingWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  .fadingText {
    position: absolute;
    top: 85px;
    transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.155, 0.77);
  }

  .subtitle {
    top: 125px;
  }

  .circular {
    position: absolute;
    width: 120px;
    height: 120px;

    ${({ success }) =>
      success
        ? ''
        : css`
            animation: ${rotate} 2s linear infinite;
          `};
  }

  .path {
    stroke: #ff3366 300ms cubic-bezier(0.645, 0.045, 0.155, 0.77);
    stroke-dashoffset: 0;
    stroke-linecap: round;
    transition: stroke-dasharray 300ms cubic-bezier(0.645, 0.045, 0.155, 0.77);
    ${({ success, theme }) =>
      success
        ? css`
            stroke: ${theme.palette.info.regular};
            stroke-dasharray: 190, 200;
          `
        : css`
            animation: ${loadingdash} 1.5s ease-in-out infinite;
            stroke-dasharray: 1, 200;
          `};
  }
`

const StyledCheckIcon = styled(Check)`
  opacity: 0;
  ${({ success }) =>
    success
      ? css`
          animation: ${rotateIn} 0.6s cubic-bezier(0.645, 0.045, 0.155, 0.77) forwards;
        `
      : ''};
`

const StyledInfoIcon = styled(Info)`
  width: 64px;
  height: 64px;
  opacity: 0;
  ${({ success }) =>
    success
      ? css`
          animation: ${rotateIn} 0.6s cubic-bezier(0.645, 0.045, 0.155, 0.77) forwards;
        `
      : ''};
`
