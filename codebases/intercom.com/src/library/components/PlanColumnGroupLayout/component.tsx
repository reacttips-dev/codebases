import classnames from 'classnames'
import useModalOpenState from 'marketing-site/lib/useModalOpenState'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { JumpLink } from '../../elements/JumpLink'
import { RichText } from '../../elements/RichText'
import { RouterWithQueryParams, Color } from '../../utils'
import { EnterpriseSolutionBanner } from '../EnterpriseSolutionBanner'
import { FeaturesModal } from '../FeaturesModal'
import { MagicLine } from '../MagicLine'
import { PlanColumnGroup } from '../PlanColumnGroup'
import { IProps } from './index'
import PricingModalRenderer from './PricingModalRenderer'
import styles from './styles.scss'

export function PlanColumnGroupLayout({
  planColumnGroups,
  gutter = false,
  richHeader,
  bgColor = Color.LightGray,
  hidePricingModalLink,
  hideAddonJumpLink,
  pricingModal,
  featuresModalData,
  banner,
  withMagicSparkles,
}: IProps) {
  const router = new RouterWithQueryParams(useRouter())

  const { featuresModal } = router.queryParams()

  const [pricingModalOpen, openPricingModal, closePricingModal] = useModalOpenState()
  const [featuresModalOpen, openFeaturesModal, closeFeaturesModal] = useModalOpenState()

  const groupWrapperClasses = classnames('plan-column-group-wrapper', {
    'plan-column-group-wrapper--theme': bgColor,
  })

  useEffect(() => {
    if (featuresModal) {
      openFeaturesModal()
    }
  }, [featuresModal, openFeaturesModal])

  const closeFeatureModalHandler = function (): void {
    const path = router.getCurrentPath()
    const queryParamString = router.removeQueryParam('featuresModal')

    router.updateUrl(`${path}?${queryParamString}`)
    closeFeaturesModal()
  }

  return (
    <>
      {hideAddonJumpLink ? null : (
        <JumpLink text="Explore add-ons" elementToScrollTo=".pricing-addons" />
      )}
      {pricingModal && (
        <PricingModalRenderer
          pricingModal={pricingModal}
          modalOpen={pricingModalOpen}
          closeModal={closePricingModal}
        />
      )}
      {featuresModalData && (
        <FeaturesModal
          {...featuresModalData}
          modalOpen={featuresModalOpen}
          closeModal={closeFeatureModalHandler}
        />
      )}
      <div className={groupWrapperClasses}>
        <div className="plan-column-group">
          {richHeader && (
            <div className="plan-column-group__header">
              <RichText document={richHeader} />
            </div>
          )}
          <div
            className={
              gutter
                ? 'plan-column-group__children plan-column-group__gutter'
                : 'plan-column-group__children'
            }
          >
            {planColumnGroups &&
              planColumnGroups.map((child, index) => (
                <PlanColumnGroup
                  key={index}
                  {...child}
                  openPricingModal={openPricingModal}
                  openFeaturesModal={openFeaturesModal}
                  modalLinkText={featuresModalData?.modalLinkText}
                  pricingModalLinkText={pricingModal?.modalLinkText}
                  singlePlanGroup={planColumnGroups.length === 1}
                  hidePricingModalLink={hidePricingModalLink}
                />
              ))}
          </div>
        </div>

        {banner && (
          <div className="plan-column-group__banner plan-column-group__banner--theme">
            <EnterpriseSolutionBanner {...banner} />
          </div>
        )}
      </div>

      {withMagicSparkles && (
        <span className="plan-column-group__texture">
          <MagicLine texture="sparkle-right" />
        </span>
      )}

      <style jsx>{`
        .plan-column-group__banner--theme {
          backgroundcolor: ${banner?.bgColor || Color.White};
        }
      `}</style>
      <style jsx>{styles}</style>
    </>
  )
}
