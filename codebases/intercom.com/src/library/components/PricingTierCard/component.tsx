import classnames from 'classnames'
import { useChatWithUsTrigger } from 'marketing-site/src/components/context/ChatWithUsContext'
import { RichText } from 'marketing-site/src/library/elements/RichText'
import { Text } from 'marketing-site/src/library/elements/Text'
import { Tooltip } from 'marketing-site/src/library/elements/Tooltip'
import {
  AnalyticsEvent,
  googleTagManagerCustomEvents,
  Icon,
  renderIconSVG,
  triggerGoogleTagManagerCustomEvent,
} from 'marketing-site/src/library/utils'
import React, { useState } from 'react'
import { IProps } from './index'
import styles from './styles.scss'

export function PricingTierCard({
  featureListTitleRichText,
  featureList,
  name,
  category,
  renderCta,
  openPricingModal,
  customPriceText,
  description,
  priceForPeriod,
  eventContext,
  openFeaturesModal,
  badgeText,
  badgeIcon,
  headerIcon,
  borderColor: borderColorProp,
  featuresModalLinkText,
  pricingModalLinkText,
  hidePricingModalLink = false,
  headerRendered = true,
  featureModalButtonStyle,
  hidePricingSection,
  singlePlanGroup = false,
}: IProps) {
  const chatWithUsTrigger = useChatWithUsTrigger()

  const chatWithUsTriggerWithGTM = (event: React.MouseEvent<HTMLElement>) => {
    triggerGoogleTagManagerCustomEvent(googleTagManagerCustomEvents.pricingClickedGetADemo)
    return chatWithUsTrigger(event)
  }

  const { introText, price, periodText, subText } = priceForPeriod || {
    introText: 'from',
    price: null,
    periodText: 'mo',
    subText: null,
  }
  const [featuresOpen, setFeaturesOpen] = useState(false)

  const componentClasses = classnames('pricing-tier-card', {
    'pricing-tier-card--border': borderColorProp,
    'pricing-tier-card--large': singlePlanGroup,
    'pricing-tier-card--rounded': !headerRendered,
  })

  const modalClickHandler = function () {
    new AnalyticsEvent({
      action: 'clicked',
      object: 'price_calculation',
      place: 'pricing_page',
      context: eventContext || name,
      metadata: {},
    }).send()
    openPricingModal && openPricingModal()
  }

  const featuresModalClickHandler = function (): void {
    new AnalyticsEvent({
      action: 'clicked',
      object: 'show_all_features',
      place: 'pricing_page',
      context: `${eventContext && eventContext.toLowerCase()}_plan`,
      metadata: {},
    }).send()
    openFeaturesModal && openFeaturesModal()
  }

  const shouldUseSmallerFontForName = name?.length > 0 && (category?.length || 0) > 0

  function featureItemsColumns() {
    if (singlePlanGroup && hasGroupableFeatures()) {
      return groupFeatures()
    } else {
      return [featureList.items]
    }
  }

  function groupFeatures() {
    const halfIndex = Math.floor(featureList.items.length / 2)
    const groupSplitIndex = featureList.items
      .map((item) => {
        return item.hideCheckmark
      })
      .indexOf(true, halfIndex)

    return [featureList.items.slice(0, groupSplitIndex), featureList.items.slice(groupSplitIndex)]
  }

  function hasGroupableFeatures() {
    return (
      featureList.items.filter((item) => {
        return item.hideCheckmark
      }).length > 0
    )
  }

  function toggleFeatures() {
    featuresOpen ? setFeaturesOpen(false) : setFeaturesOpen(true)
  }

  return (
    <div className={componentClasses} data-testid={`pricing-tier-card-${name.toLowerCase()}`}>
      {/* Top Section */}
      <div
        className={classnames('pricing-tier-card__section', {
          'pricing-tier-card__section--compact': singlePlanGroup,
        })}
      >
        {/* CTA Button */}
        {singlePlanGroup ? (
          /* eslint-disable-next-line */
          <div
            className="pricing-tier-card__cta pricing-tier-card__cta--top"
            onClick={chatWithUsTriggerWithGTM}
          >
            {renderCta()}
          </div>
        ) : null}
        {/* Badge (optional) */}
        {badgeText ? (
          <div className="pricing-tier-card__badge-wrapper">
            <div className="pricing-tier-card__badge">
              {badgeIcon && (
                <img alt="" src={badgeIcon} className="pricing-tier-card__badge-icon" />
              )}
              <span className="pricing-tier-card__badge-text">{badgeText}</span>
            </div>
          </div>
        ) : null}
        {!badgeText && !category && !headerIcon ? (
          <div className="pricing-tier-card__badge-wrapper pricing-tier-card__badge-wrapper--hide-on-mobile" />
        ) : null}
        {/* Header icon (optional) */}
        {/* eslint-disable-next-line */}
        {headerIcon ? (
          <img
            alt="icon"
            className={
              shouldUseSmallerFontForName
                ? 'pricing-tier-card__header-icon--small'
                : 'pricing-tier-card__header-icon'
            }
            src={headerIcon}
          />
        ) : null}
        {/* Category (optional) */}
        <div className="pricing-tier-card__category">
          <Text size={shouldUseSmallerFontForName ? 'lg-eyebrow' : 'xl'}>{category}</Text>
        </div>
        {/* Title */}
        <div className="pricing-tier-card__title graphik-font">
          <Text size={shouldUseSmallerFontForName ? 'lg+' : 'xxl'}>{name}</Text>
        </div>
        {/* Description (optional) */}
        {description && (
          <div
            className={classnames('pricing-tier-card__description', {
              'pricing-tier-card__description--compact': singlePlanGroup,
            })}
          >
            <Text size="body">{description}</Text>
          </div>
        )}
        {/* CTA Button */}
        {/* eslint-disable-next-line */}
        <div
          className={classnames('pricing-tier-card__cta pricing-tier-card__cta--bottom', {
            'pricing-tier-card__cta--show-on-mobile': singlePlanGroup,
          })}
          onClick={chatWithUsTriggerWithGTM}
        >
          {renderCta()}
        </div>
        {/* Price per Period */}
        {/* if there's a Price Per Period, display it, otherwise show custom text */}
        {!hidePricingSection && (
          <div className="pricing-tier-card__price-for-period">
            {price ? (
              <>
                {/* wrap price in button to open pricing modal on desktop screens */}
                <div className="pricing-tier-card__show-on-desktop">
                  {introText}{' '}
                  <span className="pricing-tier-card__price-for-period--dollar-amount">
                    ${price}
                  </span>
                  /{periodText}
                </div>
                {/* no pricing modal on mobile */}
                <div className="pricing-tier-card__hide-on-desktop">
                  {introText}{' '}
                  <span className="pricing-tier-card__price-for-period--dollar-amount">
                    ${price}
                  </span>
                  /{periodText}
                </div>
              </>
            ) : (
              <div className="pricing-tier-card__price-for-period--custom-text">
                {customPriceText || 'Custom pricing'}
              </div>
            )}
            <div
              className={classnames('pricing-tier-card__price-for-period-subtext', {
                'pricing-tier-card__price-for-period-subtext--compact': singlePlanGroup,
              })}
            >
              {subText && <Text size="caption">{subText}</Text>}
            </div>
          </div>
        )}

        {!hidePricingModalLink && (
          <div className="pricing-tier-card__show-on-desktop">
            <button className="pricing-tier-card__pricing-modal-button" onClick={modalClickHandler}>
              {pricingModalLinkText || 'How we calculate price'}
            </button>
          </div>
        )}

        {/* Toggle for show/hide features on mobile */}
        <button className="pricing-tier-card__features-toggle" onClick={toggleFeatures}>
          <svg
            width="7"
            height="12"
            viewBox="0 0 7 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`pricing-tier-card__features-toggle-arrow ${
              featuresOpen ? 'pricing-tier-card__features-toggle-arrow--rotate' : ''
            }`}
          >
            <path
              d="M3.72868 6L1.23165e-07 1.6716L1.75 2.08685e-08L7 6L1.75 12L1.99336e-08 10.3284L3.72868 6Z"
              fill="#222222"
            />
          </svg>
          <Text size="body">{featuresOpen ? 'Hide details' : 'See details'}</Text>
        </button>
      </div>
      {/* Bottom Section */}
      <div
        className={classnames('pricing-tier-card__section', {
          'pricing-tier-card__section--hidden': !featuresOpen,
          'pricing-tier-card__section--space-between':
            featureModalButtonStyle === 'bottom_of_pricing_card',
        })}
      >
        {/* Feature List w/ optional title */}
        <div
          className={classnames('pricing-tier-card__features', {
            'pricing-tier-card__features--with-columns': singlePlanGroup,
          })}
        >
          {featureListTitleRichText && (
            <div className="pricing-tier-card__features-title">
              <Text size="body">
                <RichText html={featureListTitleRichText} />
              </Text>
            </div>
          )}
          {featureItemsColumns().map((listItemGroup) => (
            <div
              key={`${listItemGroup[0].text}`}
              className={classnames({ 'pricing-tier-card__features-column': singlePlanGroup })}
            >
              <ul>
                {listItemGroup.map((listItem) => (
                  <li
                    className={classnames('pricing-tier-card__features-list-item', {
                      'pricing-tier-card__features-list-item--no-checkmark': listItem.hideCheckmark,
                      'pricing-tier-card__features-list-item--double-column': singlePlanGroup,
                      'pricing-tier-card__features-list-item--first-in-group':
                        listItem.hideCheckmark && singlePlanGroup,
                    })}
                    key={listItem.text}
                  >
                    <Tooltip text={listItem.tooltip} above={true}>
                      <RichText html={listItem.richText.replace(/\n/g, '</br>')} />
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className={classnames(
            'pricing-tier-card__features-modal pricing-tier-card__show-on-desktop',
            {
              'pricing-tier-card__features-modal--center':
                featureModalButtonStyle === 'bottom_of_pricing_card',
            },
          )}
        >
          <button onClick={featuresModalClickHandler} type="button">
            <span
              className={classnames('features-table__see-features', {
                'features-table__see-features--no-border':
                  featureModalButtonStyle === 'bottom_of_pricing_card',
              })}
            >
              {featuresModalLinkText}
              {featureModalButtonStyle === 'bottom_of_pricing_card'
                ? renderIconSVG(Icon.Arrow, 'features-table__see-features-icon')
                : null}
            </span>
          </button>
        </div>
      </div>
      <style jsx>{`
        .pricing-tier-card--border {
          border: 2px solid ${borderColorProp};
        }
      `}</style>
      <style jsx>{styles}</style>
    </div>
  )
}
