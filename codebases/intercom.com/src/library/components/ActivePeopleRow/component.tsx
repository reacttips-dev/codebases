import React from 'react'
import { IProps } from './index'
import * as Utils from 'marketing-site/src/library/utils'
import { Text } from '../../elements/Text'
import { CTAButton } from '../../elements/CTAButton'
import { PriceForPeriod } from '../../elements/PriceForPeriod'

export class ActivePeopleRow extends React.PureComponent<IProps> {
  openIntercomMessenger(e: React.MouseEvent) {
    e.preventDefault()
    window.Intercom(
      'showNewMessage',
      'Hi, I’d like to know more about your pricing for more than 20,000 active people.',
    )
  }
  render() {
    const { bracket, essentialPriceForPeriod, proPriceForPeriod, subtext, chatWithUsText, cta } =
      this.props
    return (
      <>
        <div className="row-container">
          <div className="active-people-bracket">
            <Text size="caption">{bracket}</Text>
          </div>
          <div className="active-people-price">
            <div className="price-section" data-testid="price-section">
              {cta && chatWithUsText && (
                <div className="cta">
                  <CTAButton
                    onClick={this.openIntercomMessenger}
                    text={chatWithUsText}
                    bgColor={Utils.CTATheme.LinkOnlyBlack}
                  />
                </div>
              )}
              <div>
                {essentialPriceForPeriod && (
                  <div className="price">
                    <span>+&nbsp;</span>
                    <PriceForPeriod
                      {...{
                        ...essentialPriceForPeriod,
                        small: true,
                        simple: true,
                      }}
                    />
                  </div>
                )}
              </div>
              <Text size="caption">{subtext}</Text>
            </div>
            <div className="price-section" data-testid="price-section">
              {cta && chatWithUsText && (
                <div className="cta">
                  <CTAButton
                    onClick={this.openIntercomMessenger}
                    text={chatWithUsText}
                    bgColor={Utils.CTATheme.LinkOnlyBlack}
                  />
                </div>
              )}
              <div>
                {proPriceForPeriod && (
                  <div className="price">
                    <span>+&nbsp;</span>
                    <PriceForPeriod
                      {...{
                        ...proPriceForPeriod,
                        small: true,
                        simple: true,
                      }}
                    />
                  </div>
                )}
              </div>
              <Text size="caption">{subtext}</Text>
            </div>
          </div>
        </div>
        <style jsx>
          {`
            div {
              color: ${Utils.Color.Black};
              font-family: ${Utils.fontGraphik};
            }

            .active-people-bracket {
              flex-basis: 20%;
            }

            .active-people-price {
              display: flex;
              flex: 1;
            }

            .row-container {
              display: flex;
              padding-top: 5px;
              padding-bottom: 10px;
            }

            .price-section {
              display: flex;
              flex-direction: column;
              flex: 1;
            }

            .price {
              font-weight: bold;
              display: flex;
              align-items: center;
            }

            .cta > a {
              padding: 0;
            }
          `}
        </style>
      </>
    )
  }
}
