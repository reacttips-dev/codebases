/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

const ContentResetPortal = ({ children, container }) => {
  const [clearedContents, setClearedContents] = useState(false)

  useEffect(() => {
    if (clearedContents) {
      return
    }

    /*
     * This is clearly a hack. It assumes the existing content is:
     *
     * 1) an empty ref like `<div ref={ref} />`
     * 2) a React managed component that's fully aware of this hack
     *
     * In our case, `BreadcrumbsContainerLoading` is aware this hack exists, so no harm is done.
     */
    if (!container) {
      return
    }

    container.innerHTML = ''
    setClearedContents(true)
  }, [clearedContents, container])

  if (!clearedContents) {
    return null
  }

  return createPortal(children, container)
}

export default ContentResetPortal
