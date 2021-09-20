import React from 'react'
import { IProps } from './index'
import { Text } from '../../elements/Text'
import { FeatureSection } from '../FeatureSection'
import { CTALink } from '../../elements/CTALink'
import { CTATheme, Color, mq } from '../../utils'
import { PriceForPeriod } from '../../elements/PriceForPeriod'
import Modal, { ModalSize } from 'marketing-site/src/components/common/Modal'

export function SolutionFeaturesModal(props: IProps) {
  const {
    heading,
    subheading,
    featureSections,
    tiers,
    customPriceText,
    premiumCtaText,
    proEssentialCtaText,
    proPurchaseUrl,
    essentialPurchaseUrl,
    eventContext,
    modalOpen,
    closeModal,
  } = props

  const contentStyles = {
    backgroundColor: Color.White,
    boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.245867)',
    borderRadius: '4px',
    padding: '40px 20px',
    width: '1130px',
    margin: '0 auto',
  }
  const overlayStyles = {
    backgroundColor: 'rgba(160, 160, 160, .7)',
    zIndex: '300',
  }

  return (
    <>
      <Modal
        isOpen={modalOpen}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
        size={ModalSize.Large}
        onRequestClose={closeModal}
        backgroundColor={Color.LightGray}
        style={{
          content: contentStyles,
          overlay: overlayStyles,
        }}
      >
        <div className="solution-features-heading">
          <Text size="xl">{heading}</Text>
        </div>
        <div className="solution-features-subheading">
          <Text size="body">{subheading}</Text>
        </div>
        <div className="heading-container">
          <div className="heading-spacer" />
          <div className="heading-tiers">
            {tiers.map((tierCardProps, index) => {
              const isPremium = tierCardProps.name === 'Premium'
              const isPro = tierCardProps.name === 'Pro'
              return (
                <div className="tier-info" key={index}>
                  <Text size="lg+">{tierCardProps.name}</Text>
                  {tierCardProps.priceForPeriod ? (
                    <PriceForPeriod
                      {...{
                        ...tierCardProps.priceForPeriod,
                        small: true,
                      }}
                    />
                  ) : (
                    <Text size="body">{customPriceText}</Text>
                  )}
                  <div className="cta">
                    {isPremium ? (
                      <CTALink
                        bgColor={CTATheme.LinkOnlyBlack}
                        text={premiumCtaText}
                        url="#chat-with-us"
                        eventContext={eventContext || 'features_modal'}
                        eventObjectName="chat_with_us_cta"
                      />
                    ) : (
                      <CTALink
                        bgColor={CTATheme.LinkOnlyBlack}
                        text={proEssentialCtaText}
                        url={isPro ? proPurchaseUrl : essentialPurchaseUrl}
                        eventContext={eventContext || 'features_modal'}
                        eventObjectName={`try_for_free_${isPro ? 'pro' : 'essential'}_cta`}
                        newWindow
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {featureSections.map((featureSectionProps, index) => (
          <div key={index}>
            <FeatureSection {...featureSectionProps} />
          </div>
        ))}
      </Modal>
      <style jsx>
        {`
          .solution-features-heading {
            text-align: center;
          }
          .solution-features-subheading {
            text-align: center;
            margin: 15px 0 45px 0;
          }
          .heading-container {
            display: flex;
          }
          .heading-tiers {
            flex: 1 1 0;
            display: flex;
            justify-content: space-evenly;
          }
          .tier-info {
            display: flex;
            flex-direction: column;
            width: 33%;
            margin-bottom: 10px;
          }
          .cta > a {
            text-align: left;
          }
          .heading-spacer {
            flex-basis: 42%;
          }
          .cta {
            margin-top: auto;
          }
          .see-features-button {
            cursor: pointer;
            display: none;
          }
          .see-features-button:focus {
            outline: none;
          }
          .see-features {
            cursor: pointer;
            display: inline;
            vertical-align: middle;
            border-bottom: 1px dotted black;
            padding-bottom: 1px;
          }
          .see-features:hover {
            text-decoration: underline;
            border-bottom: 1px solid black;
          }
          .plus-sign {
            margin-right: 8px;
            vertical-align: middle;
          }
          @media (${mq.desktop}) {
            .see-features-button {
              display: inherit;
            }
          }
        `}
      </style>
    </>
  )
}
