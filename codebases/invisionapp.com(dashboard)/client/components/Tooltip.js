import * as React from 'react'
import styled from 'styled-components'

/*
  Implemented with CSS because it's much more simple and has zero impact
  on render performance.

  Also, this should be pulled into the design system of it's agreed
  this is a desireable approach.
*/

class Tooltip extends React.PureComponent {
  render() {
    const offset = this.props.offset === undefined ? 20 : this.props.offset
    const width = this.props.width === undefined ? 120 : this.props.width

    return (
      <StyledTooltip offset={offset} data-title={this.props.text} width={width}>
        {this.props.children}
      </StyledTooltip>
    )
  }
}

const StyledTooltip = styled.span`
  position: relative;
  display: inline;
  cursor: pointer;
  white-space: nowrap;

  &:before,
  &:after {
    position: absolute;
    display: block;
    opacity: 0;
    pointer-events: none;
  }

  &:after {
    bottom: ${props => props.offset}px;
    left: 50%;
    width: 0;
    height: 0;
    border-top: 6px solid rgba(0, 0, 0, 0.75);
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    content: '';
  }

  &:before {
    bottom: ${props => props.offset + 6}px;
    left: 50%;
    width: ${props => props.width}px;
    padding: 8px;
    background: rgba(0, 0, 0, 0.75);
    border-radius: 5px;
    color: #fff;
    content: attr(data-title);
    cursor: default;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    white-space: normal;
  }

  &:after,
  &:before {
    transform: translate3d(-50%, 10px, 0);
    transition: all 0.15s ease-in-out;
  }
  &:hover:after,
  &:hover:before {
    opacity: 1;
    transform: translate3d(-50%, 0, 0);
  }
`

export default Tooltip
