import React from 'react'
import { MarginSizeOption, mq } from '../../utils'
import { IProps } from './index'

const marginMap = {
  xs: 24,
  sm: 60,
  md: 80,
  lg: 100,
  xl: 130,
  xxl: 150,
}

const mobileMarginMap = {
  xs: 24,
  sm: 60,
  md: 80,
  lg: 100,
  xl: 120,
  xxl: 160,
}

function getMargin(size?: MarginSizeOption) {
  return size ? marginMap[size] : 0
}

function getMobileMargin(size?: MarginSizeOption) {
  return size ? mobileMarginMap[size] : 0
}

export class Section extends React.PureComponent<IProps> {
  render() {
    const { topMargin, bottomMargin, children, className } = this.props
    return (
      <section className={className}>
        {children}
        <style jsx>
          {`
            section {
              margin-top: ${getMobileMargin(topMargin)}px;
              margin-bottom: ${getMobileMargin(bottomMargin)}px;
            }
            @media (${mq.tablet}) {
              section {
                margin-top: ${getMargin(topMargin)}px;
                margin-bottom: ${getMargin(bottomMargin)}px;
              }
            }
          `}
        </style>
      </section>
    )
  }
}
