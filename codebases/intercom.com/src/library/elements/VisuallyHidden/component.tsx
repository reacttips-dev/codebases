import React from 'react'
import { IProps } from './index'

export class VisuallyHidden extends React.PureComponent<IProps> {
  render() {
    const { children } = this.props
    return (
      <span data-testid="visually-hidden">
        {children}
        <style jsx>
          {`
            span {
              clip: rect(1px, 1px, 1px, 1px);
              clip-path: inset(50%);
              height: 1px;
              width: 1px;
              margin: -1px;
              overflow: hidden;
              padding: 0;
              position: absolute;
            }
          `}
        </style>
      </span>
    )
  }
}
