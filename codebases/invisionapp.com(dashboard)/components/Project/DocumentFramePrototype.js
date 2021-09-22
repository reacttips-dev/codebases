/**
 * This is a prototype for UI testing.  This should never be seen
 * by customers :)
 */
import React from 'react'
import { useSelector } from 'react-redux'
import { ROUTE_PAGES } from '../../constants/AppRoutes'
import PagesContainer from '../../containers/PagesContainer'

import styles from '../../css/project-prototype.css'

const DocumentFramePrototype = props => {
  const state = useSelector(state => ({
    id: state.project.overviewPageId
  }))

  if (props.selectedUrl === ROUTE_PAGES) {
    return <div className={styles.documentFrame}>
      <PagesContainer pageId={state.id} />
    </div>
  }

  return <iframe
    className={styles.documentFrame}
    name='prototype-frame'
    src={props.selectedUrl}
    frameBorder='0'
  />
}

export default DocumentFramePrototype
