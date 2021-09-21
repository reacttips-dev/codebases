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

import React, { FunctionComponent, Fragment } from 'react'

import { EuiSpacer } from '@elastic/eui'

import Thumbnail, { ThumbnailProps } from './Thumbnail'
import LoadingThumbnail from './LoadingThumbnail'

interface ThumbnailItemProps extends ThumbnailProps {
  id: string
}

interface Props {
  thumbnails?: ThumbnailItemProps[]
}

const PortalThumbnails: FunctionComponent<Props> = ({ thumbnails }) => (
  <Fragment>
    {thumbnails === undefined ? (
      <Fragment>
        <LoadingThumbnail />

        <EuiSpacer />

        <LoadingThumbnail />

        <EuiSpacer />

        <LoadingThumbnail />
      </Fragment>
    ) : (
      thumbnails.map((thumbnail, index) => (
        <Fragment key={thumbnail.id}>
          {index > 0 && <EuiSpacer />}

          <Thumbnail {...thumbnail} />
        </Fragment>
      ))
    )}
  </Fragment>
)

export default PortalThumbnails
