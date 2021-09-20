import React from 'react'
import { CurrentUILocaleContext } from '../../utils'
import { IProps } from './index'
import { Text } from '../../elements/Text'
import { PriceForPeriod } from '../../elements/PriceForPeriod'

export class TierPricingSection extends React.PureComponent<IProps> {
  static contextType = CurrentUILocaleContext
  render() {
    const { priceForPeriod, activePeople, seats } = this.props
    return (
      <>
        <div>
          {PriceForPeriod && (
            <div className="plan-tier-title">
              <span>+&nbsp;</span>
              <PriceForPeriod
                {...{
                  ...priceForPeriod,
                  small: true,
                  simple: true,
                }}
              />
            </div>
          )}
        </div>
        <div>
          <Text size="caption">{activePeople}</Text>
        </div>
        <div>
          <Text size="caption">{seats}</Text>
        </div>
        <style jsx>
          {`
            .plan-tier-title {
              font-weight: bold;
              display: flex;
              align-items: center;
            }
          `}
        </style>
      </>
    )
  }
}
