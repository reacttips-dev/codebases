import classnames from 'classnames'
import React from 'react'
import { PricingTierCard } from '../../components/PricingTierCard'
import { getColorTheme, Color } from '../../utils'
import { IProps } from './index'
import styles from './styles.scss'

export function PlanColumnGroup({
  plans,
  gutter = false,
  header,
  headerBgColor,
  openPricingModal,
  openFeaturesModal,
  modalLinkText,
  pricingModalLinkText,
  singlePlanGroup = false,
  hidePricingModalLink,
}: IProps) {
  const themeColors = getColorTheme(headerBgColor || Color.White)

  const planColumnClasses = classnames('plan-columns plan-columns--theme', {
    'plan-columns-gutter': gutter,
    'plan-columns--wide': singlePlanGroup,
    'plan-columns--border': headerBgColor && !header,
  })
  const planColumnsWrapperClasses = classnames('plan-columns-wrapper', {
    'plan-columns-wrapper--single-child': singlePlanGroup,
  })

  return (
    <div className={planColumnsWrapperClasses}>
      {header && <div className={'plan-columns__header plan-columns__header--theme'}>{header}</div>}
      <div className={planColumnClasses}>
        {plans.map((plan) => (
          <PricingTierCard
            key={plan.name}
            {...plan}
            headerRendered={!!header}
            openPricingModal={openPricingModal}
            openFeaturesModal={openFeaturesModal}
            featuresModalLinkText={modalLinkText}
            pricingModalLinkText={pricingModalLinkText}
            hidePricingModalLink={hidePricingModalLink}
            singlePlanGroup={singlePlanGroup}
          />
        ))}
      </div>

      <style jsx>{`
        .plan-columns__header--theme {
          background-color: ${themeColors.backgroundColor};
          color: ${themeColors.textColor};
        }

        .plan-columns--theme > * + * {
          border-top: 2px solid ${themeColors.backgroundColor};
        }

        .plan-columns--border::before {
          content: '';
          position: absolute;
          height: 13px;
          width: 100%;
          z-index: -1;
          left: 0;
          top: -4px;
          border-radius: 6px;
          background: ${themeColors.backgroundColor};
          max-width: 395px;
          left: 50%;
          transform: translateX(-50%);
        }

        @media (min-width: 665px) {
          .plan-columns--theme > * {
            border-top: 2px solid ${themeColors.backgroundColor};
          }

          .plan-columns--theme > * + * {
            border-left: 2px solid ${themeColors.backgroundColor};
          }
        }
      `}</style>

      <style jsx>{styles}</style>
    </div>
  )
}
