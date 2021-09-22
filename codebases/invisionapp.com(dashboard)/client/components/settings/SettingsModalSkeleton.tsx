import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import { HeliosTheme } from '@invisionapp/helios/css/theme'

const SettingsModalSkeleton = () => {
  return (
    <SkeletonContainer>
      <HeadingSkeleton />
      <SubheadingSkeleton />
      <div>
        <RowSkeleton>
          <LabelSkeleton>
            <div />
          </LabelSkeleton>
          <FieldSkeleton>
            <div />
          </FieldSkeleton>
        </RowSkeleton>
        <RowSkeleton>
          <LabelSkeleton>
            <div />
          </LabelSkeleton>
          <FieldSkeleton>
            <div />
          </FieldSkeleton>
        </RowSkeleton>
        <RowSkeleton>
          <LabelSkeleton>
            <div />
          </LabelSkeleton>
          <FieldSkeleton>
            <div />
          </FieldSkeleton>
        </RowSkeleton>
      </div>
      <ButtonSkeleton />
    </SkeletonContainer>
  )
}

export default SettingsModalSkeleton

const animationDuration = '1.5s'

const pulseBackgroundColor = (props: { theme: HeliosTheme }) => keyframes`
      0% {
        border-color: ${props.theme.palette.structure.lightest};
        background-color: ${props.theme.palette.structure.lightest};
      }
      60% {
        border-color: ${props.theme.palette.structure.lighter};
        background-color: ${props.theme.palette.structure.lighter};
      }
      100% {
        border-color: ${props.theme.palette.structure.lightest};
        background-color: ${props.theme.palette.structure.lightest};
      }
    `

const SkeletonContainer = styled.div`
  width: 97%;
  max-width: 620px;
  margin: 48px auto 0;
`
const HeadingSkeleton = styled.div`
  width: 140px;
  height: 48px;
  margin: 0 auto 16px;
  animation: ${pulseBackgroundColor} ${animationDuration} infinite ease-in-out;
  background-color: ${props => props.theme.palette.structure.lightest};
  border-radius: 2px;
`
const SubheadingSkeleton = styled.div`
  width: 180px;
  height: 24px;
  margin: 0 auto 48px;
  animation: ${pulseBackgroundColor} ${animationDuration} infinite ease-in-out;
  background-color: ${props => props.theme.palette.structure.lightest};
  border-radius: 2px;
`
const RowSkeleton = styled.div`
  display: flex;
  padding: 24px 16px;
  border-bottom: 1px solid ${props => props.theme.palette.structure.lighter};

  &:first-child {
    border-top: 1px solid ${props => props.theme.palette.structure.lighter};
  }
`
const LabelSkeleton = styled.div`
  flex: 1;

  div {
    width: 300px;
    height: 14px;
    animation: ${pulseBackgroundColor} ${animationDuration} infinite ease-in-out;
    background-color: ${props => props.theme.palette.structure.lightest};
    border-radius: 2px;
  }
`
const FieldSkeleton = styled.div`
  flex: none;
  div {
    width: 100px;
    height: 14px;
    animation: ${pulseBackgroundColor} ${animationDuration} infinite ease-in-out;
    background-color: ${props => props.theme.palette.structure.lightest};
    border-radius: 2px;
  }
`
const ButtonSkeleton = styled.div`
  width: 160px;
  height: 52px;
  margin: 56px auto 0;
  animation: ${pulseBackgroundColor} ${animationDuration} infinite ease-in-out;
  background-color: ${props => props.theme.palette.structure.lightest};
  border-radius: 26px;
`
