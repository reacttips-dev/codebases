import React from 'react'
import { CurrentUILocaleContext } from '../../utils'
import { Text } from '../Text/component'
import { IProps } from './index'

export class PriceForPeriod extends React.PureComponent<IProps> {
  static contextType = CurrentUILocaleContext

  render() {
    const { price, simple, small, subText } = this.props
    const introText = this.props.introText || 'from'
    const periodText = this.props.periodText || 'mo'
    return (
      <div className="monthly-price">
        <div className="monthly-price-bottom-row">
          {!simple && <Text size="body">{introText}&nbsp; </Text>}
          <Text size={small ? 'body+' : 'lg+'}>${price}</Text>
          <Text size="body">/{periodText}</Text>
        </div>
        {subText && (
          <div className="monthly-price-subtext">
            <Text size="caption">{subText}</Text>
          </div>
        )}
        <style jsx>
          {`
            .monthly-price {
              display: grid;
              grid-template-rows: auto;
              word-break: break-word;
            }

            .monthly-price-top-row {
              grid-row: 1;
            }

            .monthly-price-bottom-row {
              grid-row: 2;
            }
          `}
        </style>
      </div>
    )
  }
}
