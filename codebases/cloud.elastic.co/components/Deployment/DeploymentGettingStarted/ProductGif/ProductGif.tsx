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

import React, { FunctionComponent } from 'react'
import { EuiImage } from '@elastic/eui'

import { Theme } from '../../../../types'

const staticImgDir = '/static/images'

type Props = {
  theme: Theme
}

const ProductGif: FunctionComponent<Props> = ({ theme }) => {
  const img = {
    src: `${staticImgDir}/cloud-lightmode.gif`,
    darkSrc: `${staticImgDir}/cloud-darkmode.gif`,
    alt: `Cloud intro`,
  }
  const imgAlt = img.alt

  if (theme === 'dark') {
    return <EuiImage size='fullWidth' hasShadow={true} alt={imgAlt} url={img.darkSrc || img.src} />
  }

  return <EuiImage size='fullWidth' hasShadow={true} alt={imgAlt} url={img.src} />
}

export default ProductGif
