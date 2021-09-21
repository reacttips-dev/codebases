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

import React, { ReactNode, FunctionComponent, Fragment } from 'react'
import { WrappedComponentProps, injectIntl } from 'react-intl'
import cx from 'classnames'
import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiTitle, EuiText } from '@elastic/eui'
import { CuiThemedIcon } from '../../cui'
import ExternalLink from '../ExternalLink'

import './landingImage.scss'

export type ConsumerProps = {
  image: string
  darkImage?: string
  title?: ReactNode
  description?: ReactNode
  link?: string
  className?: string
}

type Props = ConsumerProps & WrappedComponentProps

const LandingImage: FunctionComponent<Props> = ({
  title,
  description,
  image,
  darkImage,
  link,
  className,
}) => (
  <EuiFlexGroup
    direction='column'
    justifyContent='center'
    alignItems='center'
    className={cx('landing-image', className)}
  >
    <EuiFlexItem>
      <LinkWrapper link={link}>
        <CuiThemedIcon size='original' lightType={image} darkType={darkImage ? darkImage : image} />

        {title && (
          <Fragment>
            <EuiSpacer size='m' />
            <EuiTitle size='m'>
              <h3>{title}</h3>
            </EuiTitle>
          </Fragment>
        )}

        {description && (
          <Fragment>
            <EuiSpacer size='xs' />
            <EuiText textAlign='center'>{description}</EuiText>
          </Fragment>
        )}
      </LinkWrapper>
    </EuiFlexItem>
  </EuiFlexGroup>
)

const LinkWrapper = ({ link, children }) =>
  !link ? (
    children
  ) : (
    <ExternalLink showExternalLinkIcon={false} href={link}>
      {children}
    </ExternalLink>
  )

export default injectIntl(LandingImage)
