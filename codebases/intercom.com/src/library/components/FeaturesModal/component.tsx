import classnames from 'classnames'
import Modal, { ModalSize } from 'marketing-site/src/components/common/Modal'
import { Text } from 'marketing-site/src/library/elements/Text'
import React from 'react'
import { PlanCtaCard } from '../../elements/PlanCtaCard'
import { Color, getColor, Icon, renderIconSVG } from '../../utils'
import styles from './styles.scss'
import tierStyles from '../PricingTierCard/styles.scss'
import { IProps } from './index'
import { FeaturesModalGroup } from '../FeaturesModalGroup'

export function FeaturesModal({
  addOnLegendText,
  closeModal,
  featuresGroups,
  footerText,
  headerText,
  includedLegendText,
  legendTitle,
  modalOpen,
  planGroupings,
  showLegend,
  enterpriseLegendText,
}: IProps) {
  const overlayStyles = {
    backgroundColor: 'rgba(160, 160, 160, .7)',
    zIndex: '300',
  }

  const numberOfColumns = planGroupings.length
  const numberOfPlansPerColumn = planGroupings[0].plans.length
  const onlyOnePlanInEachGroup = planGroupings.every((x) => x.plans.length === 1)
  const singlePlanGroup = numberOfColumns === 1 && numberOfPlansPerColumn === 1
  const contentStyles = {
    boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.245867)',
    borderRadius: '4px',
    padding: '32px',
    width: `${singlePlanGroup ? '870px' : '1190px'}`,
    margin: '0 auto',
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
        <div className={`features-table__container_${numberOfColumns}_${numberOfPlansPerColumn}`}>
          <span className="features-table__center-text">
            <Text size="xl">{headerText}</Text>
          </span>
          <div
            className={classnames('features-table__plan-container', {
              'features-table__plan-container--with-wide-first-column': singlePlanGroup,
            })}
          >
            <div
              className={classnames('features-table__legend_container', {
                'features-table__legend_container--wide-first-column': singlePlanGroup,
              })}
            >
              {showLegend ? (
                <>
                  <div className="features-table__legend-title">
                    <Text size="caption+">{legendTitle}</Text>
                  </div>
                  <div className="features-table__legend">
                    <div className="features-table__legend-row">
                      <div className="features-table__legend-row--icon">
                        {renderIconSVG(Icon.FeatureCheckmark)}
                      </div>
                      <div>
                        <Text size="caption+">{includedLegendText}</Text>
                      </div>
                    </div>
                    <div className="features-table__legend-row">
                      <div className="features-table__legend-row--icon">
                        {renderIconSVG(Icon.Plus)}
                      </div>
                      <div>
                        <Text size="caption+">{addOnLegendText}</Text>
                      </div>
                    </div>
                    {enterpriseLegendText && (
                      <div className="features-table__legend-row">
                        <div className="features-table__legend-row--spanner-icon" />
                        <div>
                          <Text size="caption+">{enterpriseLegendText}</Text>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
            <div
              className={classnames(`features-table__plan-group-columns_${numberOfColumns}`, {
                'features-table__plan-group-columns_1--with-wide-first-column': singlePlanGroup,
              })}
            >
              {planGroupings.map(
                ({ header, plans, altHeaderBgColor: originalAltHeaderBgColor }) => {
                  const altHeaderBgColor =
                    originalAltHeaderBgColor && getColor(originalAltHeaderBgColor)
                  return (
                    <div key={header}>
                      <div
                        style={altHeaderBgColor && { backgroundColor: altHeaderBgColor }}
                        className="features-table__group-heading"
                      >
                        <Text size="body+">{header}</Text>
                      </div>
                      <div
                        className={classnames(
                          `features-table__plan-header-group_${numberOfPlansPerColumn}`,
                          {
                            'features-table__plan-header-group': !onlyOnePlanInEachGroup,
                            'features-table__plan-header-with-border-radius': !header,
                          },
                        )}
                      >
                        {plans.map((plan) => (
                          <PlanCtaCard
                            plan={plan}
                            key={plan.name}
                            compact={singlePlanGroup}
                            context="features-table"
                          />
                        ))}
                      </div>
                    </div>
                  )
                },
              )}
            </div>
          </div>
          {featuresGroups.map((group, index) => (
            <FeaturesModalGroup
              key={group.title}
              featuresGroup={group}
              planGroupings={planGroupings}
              isLastContainer={featuresGroups.length - 1 === index}
              showLegend={showLegend}
            />
          ))}
          {footerText && (
            <div className="features-table__footer-text">
              <Text size="md+">{footerText}</Text>
            </div>
          )}
        </div>
      </Modal>
      <style jsx>{tierStyles}</style>
      <style jsx>{styles}</style>
    </>
  )
}
