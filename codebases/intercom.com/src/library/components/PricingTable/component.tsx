import classnames from 'classnames'
import Modal, { ModalSize } from 'marketing-site/src/components/common/Modal'
import { Text } from 'marketing-site/src/library/elements/Text'
import { Color, CTATheme } from 'marketing-site/src/library/utils'
import React from 'react'
import { CTALink } from '../../elements/CTALink'
import { PlanCtaCard } from '../../elements/PlanCtaCard'
import { RichText } from '../../elements/RichText'
import tierStyles from '../PricingTierCard/styles.scss'
import { IPriceMetric, IPriceMetricValue, IProps } from './index'
import styles from './styles.scss'

export function PricingTable({
  priceMetrics,
  planGroupings,
  headerText,
  earlyStageCta,
  modalOpen,
  closeModal,
}: IProps) {
  function getPricingMetricValue({ name }: IPriceMetric, values: IPriceMetricValue[]) {
    const { mainText = '–', subText = '' } = values.find(({ key }) => key.name === name) || {}
    return (
      <>
        <Text size="caption">
          <RichText html={mainText} />
        </Text>
        {subText && (
          <span className="pricing-table__subtext">
            <RichText html={subText} />
          </span>
        )}
      </>
    )
  }

  const onlyOnePlanInEachGroup = planGroupings.every((group) => group.plans.length === 1)
  const overlayStyles = {
    backgroundColor: 'rgba(160, 160, 160, .7)',
    zIndex: '300',
  }
  const numberOfColumns = planGroupings.length
  const numberOfPlansPerColumn = planGroupings[0].plans.length
  const singlePlanGroup = numberOfColumns === 1 && numberOfPlansPerColumn === 1
  const contentStyles = {
    boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.245867)',
    borderRadius: '4px',
    padding: '30px 50px 0',
    width: '1190px',
    margin: '0 auto',
    maxHeight: `${singlePlanGroup ? '730px' : '685px'}`,
    height: `85vh`,
  }

  return (
    <>
      <Modal
        isOpen={!!modalOpen}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
        size={ModalSize.Large}
        onRequestClose={closeModal || (() => {})}
        backgroundColor={Color.LightGray}
        style={{
          content: contentStyles,
          overlay: overlayStyles,
        }}
      >
        <div className="pricing-table__container">
          <span className="pricing-table__center-text">
            <Text size="xl">{headerText}</Text>
          </span>
          <div
            className={classnames('pricing-table__plan-container', {
              'pricing-table__plan-container--wide-first-column': singlePlanGroup,
            })}
          >
            <div
              className={classnames(`pricing-table__plan-group-columns_${numberOfColumns}`, {
                'pricing-table__plan-group-columns_1--with-wide-first-column': singlePlanGroup,
              })}
            >
              {planGroupings.map(({ header, plans, altHeaderBgColor }) => (
                <div key={header}>
                  <div
                    style={altHeaderBgColor && { backgroundColor: altHeaderBgColor }}
                    className="pricing-table__group-heading"
                  >
                    <Text size="body+">{header}</Text>
                  </div>
                  <div
                    className={classnames(
                      `pricing-table__plan-header-group_${numberOfPlansPerColumn}`,
                      {
                        'pricing-table__plan-header-group': !onlyOnePlanInEachGroup,
                      },
                    )}
                  >
                    {plans.map((plan) => (
                      <PlanCtaCard
                        key={plan.name}
                        plan={plan}
                        compact={singlePlanGroup}
                        context="pricing-table"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {priceMetrics.map((metric, index) => (
            <div
              key={metric.name}
              className={classnames({
                'pricing-table__row': true,
                'pricing-table__merged-row': metric.mainText,
                'pricing-table__merged-row--wide-first-column': singlePlanGroup,
              })}
            >
              <div className="pricing-table__metric-label-column">
                <div className="pricing-table__badge">{index + 1}</div>
                <div
                  className={classnames('pricing-table__metric-label', {
                    'pricing-table__metric-label--wide': singlePlanGroup,
                  })}
                >
                  <div>
                    <Text size="md+">{metric.name}</Text>
                  </div>
                  <div>
                    <Text size="caption">{metric.description}</Text>
                  </div>
                </div>
              </div>
              <div
                className={classnames(`pricing-table__plan-group-columns_${numberOfColumns}`, {
                  'pricing-table__merged-column': metric.mainText,
                })}
              >
                {metric.mainText ? (
                  <div className="pricing-table__column pricing-table__merged-column-inner">
                    <div
                      className={classnames('pricing-table__main-text-wrapper', {
                        'pricing-table__main-text-wrapper--lightgray': singlePlanGroup,
                      })}
                    >
                      <RichText html={metric.mainText} />
                    </div>
                    {metric.subText && (
                      <>
                        {!singlePlanGroup ? (
                          <span className="pricing-table__subtext-div-line" />
                        ) : null}
                        <span className="pricing-table__subtext">
                          <RichText html={metric.subText} />
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  planGroupings.map(({ header, plans }) => (
                    <div
                      key={header}
                      className={`pricing-table__plan-group_${numberOfColumns}_${numberOfPlansPerColumn}`}
                    >
                      {plans.map((plan) => (
                        <div key={plan.name} className="pricing-table__column">
                          {getPricingMetricValue(metric, plan.priceMetricValues || [])}
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-table__footnote">
          <Text size="body">{earlyStageCta && earlyStageCta.text} </Text>
          {earlyStageCta && (
            <span>
              <CTALink {...earlyStageCta.cta} bgColor={CTATheme.LinkOnlyBlack} />
            </span>
          )}
        </div>
      </Modal>
      <style jsx>{tierStyles}</style>
      <style jsx>{styles}</style>
    </>
  )
}
