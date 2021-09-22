import * as React from 'react'
import useSubFeature from '@invisionapp/runtime-provided-resources/use-sub-feature'
import { Modal, Animation } from '@invisionapp/helios'
import st from './index.css'
import { trackEvent } from '../../../utils/analytics'
import {
  APP_HOME_TEMPLATE_GALLERY_PREVIEW_VIEWED,
  APP_HOME_TEMPLATE_GALLERY_VIEWED
} from '../../../constants/TrackingEvents'

const TemplateGallery = (props) => {
  const { subFeature: TemplateGallerySDK, loading, error } = useSubFeature({ subFeatureName: 'template-gallery' })

  const onTemplatePreview = (templateId) => {
    trackEvent(APP_HOME_TEMPLATE_GALLERY_PREVIEW_VIEWED, { template: templateId })
  }

  const handleMouseWheel = (e) => {
    e.stopPropagation()
  }

  React.useEffect(() => {
    trackEvent(APP_HOME_TEMPLATE_GALLERY_VIEWED, { openedForm: 'new' })
  }, [])

  if (loading) {
    return <p>Please wait...</p>
  }

  if (error) {
    return <p>Oops, we encountered an error.</p>
  }

  const Component = TemplateGallerySDK.Component
  return (
    <div className={st.container} onWheel={handleMouseWheel}>
      <Animation
        className={st.animation}
        speed='medium'
        order='fade-in-grow-bottom'
        easing='out'
        count='1'
        fillMode='both'>
        <Modal
          open
          maxWidth='80% '
          className={st.modal}
          closeOnEsc
          disableEventBubbling
          onRequestClose={() => {
            props.onSelect(null)
          }}>
          <Component
            onSelect={props.onSelect}
            V7={props.V7}
            onTemplatePreview={onTemplatePreview}
          />
        </Modal>
      </Animation>
    </div>
  )
}

export default TemplateGallery
