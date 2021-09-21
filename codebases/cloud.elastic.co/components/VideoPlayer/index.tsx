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
import React from 'react'
import { FormattedMessage } from 'react-intl'
import ScriptLoader from 'react-script-loader-hoc'

import { EuiFlexItem, EuiLoadingSpinner } from '@elastic/eui'

import { CuiAlert } from '../../cui'

const VIDYARD_EMBED_JS_URL = 'https://play.vidyard.com/embed/v4.js'

function VidyardPlayer(props: {
  scriptsLoadedSuccessfully: boolean
  maxWidth: string
  maxHeight: string
  type: string
  uuid: string
  aspect?: '4:3' | '16:9' | '16:10'
}) {
  const { scriptsLoadedSuccessfully, maxWidth, maxHeight, type, uuid, aspect } = props
  const containerRef = React.useRef<any>()
  React.useEffect(() => {
    if (scriptsLoadedSuccessfully) {
      // @ts-ignore
      window.VidyardV4.api
        .renderPlayer({
          aspect,
          container: containerRef.current,
          height: maxHeight,
          type,
          uuid,
          width: maxWidth,
          muted: '1',
          cc: 'en',
          autoplay: '1',
        })
        .catch((e: any) => {
          console.error(e.message)
          return (
            <CuiAlert type='danger' data-test-id='vidyard-player-error'>
              <FormattedMessage
                id='vidyard-player-error'
                defaultMessage='Oops, looks like something went wrong.'
              />
            </CuiAlert>
          )
        })
    }
  }, [scriptsLoadedSuccessfully])

  if (!scriptsLoadedSuccessfully) {
    return (
      <EuiFlexItem style={{ alignItems: 'center' }}>
        <EuiLoadingSpinner size='xl' />
      </EuiFlexItem>
    )
  }

  return (
    <EuiFlexItem grow={false}>
      <div ref={containerRef} />
    </EuiFlexItem>
  )
}

export default ScriptLoader(VIDYARD_EMBED_JS_URL)(VidyardPlayer)
