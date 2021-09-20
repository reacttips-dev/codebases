import React from 'react'
import { PricingTierCard } from '../../components/PricingTierCard'
import classnames from 'classnames'
import { Text } from '../../elements/Text'
import * as Utils from 'marketing-site/src/library/utils'
import { Color, containerMaxWidth, gridGap, mq, iconWidth } from '../../utils'
import { IProps } from './index'
import { ProductList } from '../../elements/ProductList'
import { PricingAddOns } from '../PricingAddOns'
import { IProps as IHowPricingWorksModalProps, HowPricingWorksModal } from '../HowPricingWorksModal'
import { SolutionFeaturesModal } from '../SolutionFeaturesModal'
import useModalOpenState from 'marketing-site/lib/useModalOpenState'
import edgeTexture from '../../images/edge-texture.svg'

export function SolutionWithTiers(props: IProps) {
  const {
    subheading,
    addOnsSection,
    addOnsList,
    tiers,
    productList,
    color,
    icon,
    eventContext,
    solutionFeatures,
    customPriceText,
    featuresLinkText,
    howPricingWorks,
  } = props

  const [pricingModalOpen, openPricingModal, closePricingModal] = useModalOpenState()
  const [featuresModalOpen, openFeaturesModal, closeFeaturesModal] = useModalOpenState()

  function howPricingWorksData(): IHowPricingWorksModalProps {
    return Object.assign({}, howPricingWorks, {
      tiers: props.tiers,
      hasActivePeople: props.hasActivePeople,
      hasSeats: props.hasSeats,
      solutionHeading: props.heading,
      pricingModalOpen,
      closePricingModal,
      customPriceText: props.customPriceText,
      eventContext: `${eventContext}_how_pricing_works_modal`,
    })
  }

  const solutionFeaturesModalData = {
    ...solutionFeatures,
    tiers,
    customPriceText,
    modalLinkText: featuresLinkText,
  }

  return (
    <>
      <SolutionFeaturesModal
        {...solutionFeaturesModalData}
        modalOpen={featuresModalOpen}
        closeModal={closeFeaturesModal}
      />
      <section className="pricing-tier">
        <div className="icon-container">
          {icon && <img alt="" src={icon} className="card-icon" />}
        </div>
        <div className="solution-section">
          <HowPricingWorksModal
            {...howPricingWorksData()}
            pricingModalOpen={pricingModalOpen}
            closePricingModal={closePricingModal}
          />
        </div>
        <div className="card-list">
          <div className="sidebar">
            <p className="subheading">
              <Text size="lg">{subheading}</Text>
            </p>
            <div className="product-list">
              <ProductList {...productList} />
            </div>
            {addOnsList && (
              <div className="product-list">
                <ProductList {...addOnsList} />
              </div>
            )}
          </div>
          {tiers.map((tier, index) => {
            const cardClassNames = classnames({
              card: true,
              'card-wrapper': true,
            })

            return (
              <li key={index} className={cardClassNames}>
                <PricingTierCard
                  {...tier}
                  customPriceText={props.customPriceText}
                  openPricingModal={openPricingModal}
                  openFeaturesModal={openFeaturesModal}
                  featuresModalLinkText={solutionFeaturesModalData?.modalLinkText}
                  pricingModalLinkText={howPricingWorks.modalLinkText}
                />
              </li>
            )
          })}
        </div>
        <div className="addons-section">
          <PricingAddOns {...addOnsSection} />
        </div>
        <style jsx>
          {`
            .pricing-tier {
              display: grid;
              grid-template-columns: [content] 14fr;
              max-width: ${containerMaxWidth};
              grid-column-gap: ${gridGap.mobile};
              margin: 0 auto;
              position: relative;
            }
            .pricing-tier:after {
              content: '';
              position: absolute;
              background-color: ${Color.LightGray};
              height: 18px;
              left: 50%;
              mask-image: url(${edgeTexture});
              mask-repeat: repeat no-repeat;
              width: 100vw;
              z-index: -1;
            }
            .pricing-tier:after {
              bottom: -17px;
              transform: translateX(-50%);
            }
            @media (${Utils.mq.desktop}) {
              .pricing-tier {
                padding: 100px 0 0 0;
              }
            }
            .card-icon {
              display: none;
            }
            .card-list {
              border-radius: 8px;
              margin: 0 2%;
            }

            .card-wrapper {
              display: flex;
            }

            .icon-container {
              margin: 0 2%;
            }
            .sidebar {
              padding: 45px 0 0 40px;
            }
            .product-list {
              margin-bottom: 30px;
            }
            .heading,
            .footnote {
              grid-column: content;
              justify-self: center;
              text-align: center;
            }
            .product-lists {
              grid-column: content;
            }
            .solution-section {
              grid-column: content;
            }
            .addons-section {
              grid-column: content;
              margin: 78px auto;
            }
            .pricing-tier .card {
              background-color: ${Color.White};
              border: 1px solid ${Color.LightGray};
              border-top: none !important;
            }
            .card.pro {
              border: 2px solid ${color};
              border-radius: 0 0 8px 8px;
              margin-bottom: -28px;
            }
            .card:last-child {
              margin-bottom: 0;
            }
            .heading {
              margin-bottom: 16px;
            }
            .subheading {
              margin-bottom: 16px;
            }
            .footnote {
              margin-top: 16px;
            }
            .recommended-card-callout {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: -52px -2px 0;
              height: 50px;
              border: 2px solid ${color};
              border-radius: 8px 8px 0 0;
              background-color: ${color};
              color: ${Color.Black};
              text-align: center;
              padding: 0 2%;
            }
            .white-text {
              color: ${Color.White};
            }
            @media (${mq.desktop}) {
              .card-list {
                display: grid;
                grid-column: content;
                grid-template-rows: none;
                grid-template-columns: [left] 1fr [middle] 1fr [middle] 1fr [right] 1fr;
                background-color: ${Color.White};
              }
              .card:last-child {
                grid-column: right;
                border-radius: 0 8px 8px 0;
              }
              .card {
                margin-bottom: 0;
              }
              .subheading {
                margin-bottom: 43px;
              }
              .card-icon {
                position: absolute;
                transform: translateY(-50%);
                width: ${iconWidth}px;
                margin-left: 40px;
                display: block;
              }
            }
            @media (max-width: 768px) {
              .card {
                border-radius: 8px;
                margin: 0 10px;
              }
              .recommended-card-callout {
                margin-top: -10px;
                justify-content: center;
                padding: 0 3%;
              }
              .recommended-card-text {
                max-width: 344px;
                text-align: left;
                width: 88%;
              }
              .card.pro {
                margin-top: 45px;
                margin-bottom: 35px;
              }
              .addons-section {
                margin: 50px 2%;
              }
              .sidebar {
                padding-left: 25px;
              }
            }
          `}
        </style>
      </section>
    </>
  )
}
