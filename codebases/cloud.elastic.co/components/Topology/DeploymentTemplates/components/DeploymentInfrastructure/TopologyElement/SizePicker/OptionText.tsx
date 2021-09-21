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

import React, { Fragment } from 'react'

import { EuiFlexItem, EuiText, EuiFlexGroup } from '@elastic/eui'

const OptionText = ({ primaryOptionText, secondaryOptionText, cpuText }) => (
  <EuiFlexGroup style={{ width: '400px' }} gutterSize='s'>
    <EuiFlexItem>
      <EuiText textAlign='center' size='s'>
        {primaryOptionText}
      </EuiText>
    </EuiFlexItem>
    {secondaryOptionText && secondaryOptionText.length > 0 && (
      <Fragment>
        <EuiFlexItem grow={false}>
          <EuiText color='subdued'>|</EuiText>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiText textAlign='center' size='s'>
            {secondaryOptionText}
          </EuiText>
        </EuiFlexItem>
      </Fragment>
    )}
    {cpuText && (
      <Fragment>
        <EuiFlexItem grow={false}>
          <EuiText color='subdued'>|</EuiText>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiText textAlign='center' size='s'>
            {cpuText}
          </EuiText>
        </EuiFlexItem>
      </Fragment>
    )}
  </EuiFlexGroup>
)

export default OptionText
