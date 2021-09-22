import React from 'react'
import styled, { keyframes } from 'styled-components'
import { HeliosTheme } from '@invisionapp/helios/css/theme'
import { PaddedColumn } from './Table'

type LoadingRowProps = {
  topBorder: boolean
  style?: React.CSSProperties
}

const LoadingRow = ({ topBorder, style }: LoadingRowProps) => {
  return (
    <Row topBorder={topBorder} style={style ?? {}}>
      <Avatar />
      <Lines>
        <Line />
        <EmailLine />
      </Lines>
      <Role />
    </Row>
  )
}

export const LoadingUserWithAvatar = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Avatar style={{ marginTop: 0, marginBottom: 0, marginLeft: 0 }} />
      <div>
        <Line />
        <EmailLine />
      </div>
    </div>
  )
}

export const LoadingLine = (props: any) => {
  return <Role {...props} />
}

const animationDuration = '1.5s'

const pulseBackgroundColor = (props: { theme: HeliosTheme }) => keyframes`
  0% {
    background-color: ${props.theme.palette.structure.lightest};
  }
  60% {
    background-color: ${props.theme.palette.structure.lighter};
  }
  100% {
    background-color: ${props.theme.palette.structure.lightest};
  }
`

const Row = styled.div<LoadingRowProps>`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.palette.structure.lighter};

  &:first {
    border-top: 1px solid ${props => props.theme.palette.structure.lighter};
  }

  ${props =>
    props.topBorder ? `border-top: 1px solid ${props.theme.palette.structure.lighter};` : ''};
`

const Avatar = styled.div<{ theme?: HeliosTheme }>`
  width: 36px;
  height: 36px;
  flex: none;
  align-self: center;
  margin: 16px ${props => props.theme.spacing.s};
  animation: ${pulseBackgroundColor} ${animationDuration} infinite ease-in-out;
  background-color: ${props => props.theme.palette.structure.lightest};
  border-radius: 50%;
`

const Lines = styled(PaddedColumn)`
  flex: 1;
  padding-left: 0;
`

const Line = styled.div<{ theme?: HeliosTheme }>`
  width: 100px;
  height: 14px;
  margin-bottom: 8px;
  animation: ${pulseBackgroundColor} ${animationDuration} infinite ease-in-out;
  background-color: ${props => props.theme.palette.structure.lightest};
  border-radius: 2px;
`

const EmailLine = styled(Line)`
  width: 140px;
  margin-bottom: 0;
`

const Role = styled.div<{ theme?: HeliosTheme }>`
  width: 100px;
  height: 14px;
  flex: none;
  align-self: center;
  margin-right: ${props => props.theme.spacing.m};
  animation: ${pulseBackgroundColor} ${animationDuration} infinite ease-in-out;
  background-color: ${props => props.theme.palette.structure.lightest};
  border-radius: 2px;
`

export default LoadingRow
