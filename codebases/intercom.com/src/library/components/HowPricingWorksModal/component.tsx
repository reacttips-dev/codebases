import React from 'react'
import { IProps } from './index'
import * as Utils from 'marketing-site/src/library/utils'
import { Text } from '../../elements/Text'
import { Color } from '../../utils'
import { CTALink } from '../../elements/CTALink'
import { CTATheme } from 'marketing-site/src/library/utils'
import { ActivePeopleRow } from '../ActivePeopleRow'
import { TierPricingSection } from '../TierPricingSection'
import { PriceForPeriod } from '../../elements/PriceForPeriod'
import Modal, { ModalSize } from 'marketing-site/src/components/common/Modal'

export function HowPricingWorksModal(props: IProps) {
  const {
    activePeopleHeading,
    activePeopleDescription,
    activePeopleRows,
    activePeopleIncluded,
    chatWithUsCta,
    closePricingModal,
    customPriceText,
    footNoteCTAs,
    essentialCta,
    hasActivePeople,
    hasSeats,
    heading,
    pricingModalOpen,
    premiumText,
    proCta,
    seatsDescription,
    seatsHeading,
    seatsIncluded,
    solutionHeading,
    startingPriceHeading,
    startingPriceDescription,
    tiers,
    trialText,
    tierSeatSections,
    chatWithUsText,
    eventContext,
  } = props

  const contentStyles = {
    backgroundColor: Color.White,
    boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.245867)',
    borderRadius: '4px',
    padding: '40px 0px 40px 0px',
    width: '1100px',
    margin: '0 auto',
    bottom: '10%',
    maxHeight: '950px',
  }

  const overlayStyles = {
    backgroundColor: 'rgba(160, 160, 160, .7)',
    zIndex: '300',
  }

  const getIndexForSeats = () => {
    return hasActivePeople ? 3 : 2
  }

  return (
    <>
      <Modal
        isOpen={pricingModalOpen}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
        size={ModalSize.Medium}
        onRequestClose={closePricingModal}
        backgroundColor={Color.White}
        style={{
          content: contentStyles,
          overlay: overlayStyles,
        }}
      >
        <div className="pricing-modal-container" role="table">
          <div className="pricing-modal-header">
            <Text size="xl">{`${heading}: ${solutionHeading}`}</Text>
          </div>
          <div className="sp__40" />
          <div className="pricing-tier-container">
            {/* Pro and Essential Price Breakdown */}
            <div className="essential-pro-tiers">
              <div className="pricing-modal-row" role="row">
                <div className="pricing-modal-label try-for-free">
                  <Text size="caption">{trialText}</Text>
                </div>
                <div className="pricing-modal-tier-titles">
                  <div className="pricing-modal-column">
                    <div className="plan-tier-title" role="columnheader">
                      <Text size="md+">{tiers[0].name}</Text>
                    </div>
                    {essentialCta && (
                      <CTALink
                        {...essentialCta}
                        bgColor={CTATheme.BlackOutline}
                        arrow={false}
                        eventContext={eventContext}
                      />
                    )}
                  </div>
                  <div className="pricing-modal-column">
                    <div className="plan-tier-title" role="columnheader">
                      <Text size="md+">{tiers[1].name}</Text>
                    </div>
                    {proCta && (
                      <CTALink
                        {...proCta}
                        bgColor={CTATheme.BlackFill}
                        arrow={false}
                        eventContext={eventContext}
                      />
                    )}
                  </div>
                </div>
              </div>
              {/* Starting Price Component */}
              <div className="pricing-modal-row lightgray" role="row">
                <div className="pricing-modal-label">
                  <div className="header-alignment" role="columnheader">
                    <div className="bold-yellow-number">
                      <Text size="md+">1</Text>
                    </div>
                    <Text size="lg">{startingPriceHeading}</Text>
                  </div>
                  <Text size="caption">{startingPriceDescription}</Text>
                </div>
                {/* Essential Price */}
                <div className="pricing-modal-column" role="cell">
                  {tiers[0].priceForPeriod && (
                    <PriceForPeriod
                      {...{
                        ...tiers[0].priceForPeriod,
                        simple: true,
                      }}
                    />
                  )}
                  {hasActivePeople && (
                    <div className="metric-count">
                      <Text size="caption">{activePeopleIncluded}</Text>
                    </div>
                  )}
                  {hasSeats && <Text size="caption">{seatsIncluded}</Text>}
                </div>
                {/* Pro Price */}
                <div className="pricing-modal-column" role="cell">
                  {tiers[1].priceForPeriod && (
                    <PriceForPeriod
                      {...{
                        ...tiers[1].priceForPeriod,
                        simple: true,
                      }}
                    />
                  )}
                  {hasActivePeople && (
                    <div className="metric-count">
                      <Text size="caption">{activePeopleIncluded}</Text>
                    </div>
                  )}
                  {hasSeats && <Text size="caption">{seatsIncluded}</Text>}
                </div>
              </div>
              {/* Active People Component */}
              {hasActivePeople && (
                // eslint-disable-next-line
                <div className="active-people-row" role="row-group">
                  <div className="pricing-modal-label usage-row" role="row">
                    <div className="active-people-header header-alignment" role="columnheader">
                      <div className="bold-yellow-number">
                        <Text size="md+">2</Text>
                      </div>
                      <Text size="lg">{activePeopleHeading}</Text>
                    </div>
                  </div>
                  <div className="pricing-modal-label usage-row" role="row">
                    <div className="active-people-tiers-container">
                      <div className="usage-description">
                        <Text size="caption">{activePeopleDescription}</Text>
                      </div>
                      <div className="active-people-tiers">
                        {activePeopleRows.map((activePeopleRowProps, index) => (
                          <div className="active-people-row-item" role="cell" key={index}>
                            <ActivePeopleRow
                              {...activePeopleRowProps}
                              chatWithUsText={chatWithUsText}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Seats Component */}
              {hasSeats && (
                <div className="pricing-modal-row lightgray" role="row">
                  <div className="pricing-modal-label">
                    <div className="header-alignment" role="columnheader">
                      <div className="bold-yellow-number">
                        <Text size="md+">{getIndexForSeats()}</Text>
                      </div>
                      <Text size="lg">{seatsHeading}</Text>
                    </div>
                    <div className="seats-description">
                      <Text size="caption">{seatsDescription}</Text>
                    </div>
                  </div>
                  {tierSeatSections.map((tierSeatProps, index) => (
                    <div className="pricing-modal-column seat-price" key={index} role="cell">
                      <TierPricingSection {...tierSeatProps} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Premium */}
            <div className="premium-column">
              <div className="plan-tier-title" role="columnheader">
                <Text size="md+">{tiers[2].name}</Text>
              </div>
              {chatWithUsCta && (
                <CTALink
                  {...chatWithUsCta}
                  bgColor={CTATheme.BlackOutline}
                  arrow={false}
                  eventContext={eventContext}
                />
              )}
              <div className="price">
                {tiers[2].priceForPeriod ? (
                  <PriceForPeriod {...tiers[2].priceForPeriod} />
                ) : (
                  <div className="monthly-price-inner">
                    <Text size="body">{customPriceText}</Text>
                  </div>
                )}
              </div>
              <Text size="caption">{premiumText}</Text>
            </div>
          </div>
          {footNoteCTAs &&
            footNoteCTAs.map((ctaData) => (
              <div key={ctaData.text} className="footnote">
                <Text size="body">{ctaData.text} </Text>
                <span>
                  <CTALink {...ctaData.cta} bgColor={CTATheme.LinkOnlyBlack} />
                </span>
              </div>
            ))}
        </div>
      </Modal>
      <style jsx>
        {`
          .pricing-modal-container {
            display: flex;
            flex-direction: column;
            flex: 1;
          }

          .pricing-tier-container {
            display: flex;
          }

          .pricing-modal-header {
            color: black;
            background-color: ${Utils.Color.White};
            font-family: ${Utils.fontGraphik};
            text-align: center;
          }

          .plan-tier-title {
            padding-bottom: 5px;
          }

          .price {
            font-weight: bold;
          }

          .active-people-row-item {
            padding-top: 5px;
            border-bottom: 1px dotted ${Utils.Color.Black};
          }

          .active-people-row-item:last-of-type {
            border-bottom: 0px;
          }

          .pricing-modal-row {
            display: flex;
            justify-content: center;
            padding-top: 15px;
            padding-bottom: 15px;
            padding-left: 15px;
          }

          .active-people-tiers-container {
            display: flex;
            justify-content: center;
          }

          .active-people-tiers {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
          }

          .pricing-modal-tier-titles {
            display: flex;
            flex: 1;
            justify-content: center;
          }

          .monthly-price-inner {
            padding-top: 15px;
          }

          .essential-pro-tiers {
            flex-basis: 72%;
            display: flex;
            flex-direction: column;
          }

          .premium-column {
            margin-left: 10px;
            border: 2px solid #f5f5f5;
            border-radius: 10px;
            width: 24%;
            padding: 13px 15px 0;
          }

          .lightgray {
            background-color: ${Utils.Color.LightGray};
          }

          .pricing-modal-label {
            flex-basis: 40%;
            padding-left: 20px;
          }

          .pricing-modal-column {
            flex: 2;
            justify-content: center;
          }

          .usage-description {
            flex-basis: 25%;
            padding: 15px;
          }

          .usage-row {
            width: 100%;
          }

          .sp__40 {
            height: 20px;
          }

          .bold-yellow-number {
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid ${Utils.Color.Yellow};
            background-color: ${Utils.Color.Yellow};
            border-radius: 100px;
            width: 25px;
            height: 25px;
            margin-right: 10px;
          }

          .footnote {
            text-align: center;
            padding-top: 25px;
            margin: 0 3%;
          }

          .metric-count {
            padding-top: 15px;
          }

          .seats-description {
            padding-right: 20px;
          }

          .active-people-header {
            padding-top: 15px;
            padding-left: 15px;
          }

          .header-alignment {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding-bottom: 10px;
          }

          .seat-price {
            padding-top: 45px;
          }

          .try-for-free {
            padding-top: 50px;
          }
        `}
      </style>
    </>
  )
}
