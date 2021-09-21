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

import React, { Component, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiPortal,
  EuiFlyout,
  EuiFlyoutHeader,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiTitle,
  EuiText,
  EuiTabs,
  EuiTab,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  htmlIdGenerator,
} from '@elastic/eui'

interface Props {
  title: ReactNode
  tabs?: Array<{
    id: string
    name: ReactNode
  }>
  onClose: () => void
  children: (activeTabId?: string) => ReactNode
}

interface State {
  htmlId: string
  activeTabId?: string
}

const makeId = htmlIdGenerator()

export default class ElasticsearchFlyout extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      htmlId: makeId(),
      activeTabId: props.tabs ? props.tabs[0].id : undefined,
    }
  }

  render(): JSX.Element {
    const { tabs, onClose, children } = this.props
    const { htmlId, activeTabId } = this.state

    return (
      <EuiPortal>
        <EuiFlyout
          size='m'
          ownFocus={true}
          aria-labelledby={htmlId}
          onClose={onClose}
          className='fs-unmask'
        >
          <EuiFlyoutHeader hasBorder={!tabs}>
            <EuiTitle size='m'>
              <h2 id={htmlId}>
                <FormattedMessage
                  id='deploymentInfrastructure-flyout-title'
                  defaultMessage='Elasticsearch plugins and settings'
                />
              </h2>
            </EuiTitle>
            <EuiSpacer size='l' />
            {tabs && (
              <EuiTabs size='s'>
                {tabs.map(({ id, name }) => (
                  <EuiTab
                    key={id}
                    onClick={() => this.setState({ activeTabId: id })}
                    isSelected={activeTabId === id}
                  >
                    {name}
                  </EuiTab>
                ))}
              </EuiTabs>
            )}
          </EuiFlyoutHeader>
          <EuiFlyoutBody>{children(activeTabId)}</EuiFlyoutBody>
          <EuiFlyoutFooter>
            <EuiFlexGroup justifyContent='flexStart' alignItems='center'>
              <EuiFlexItem grow={false}>
                <EuiButton
                  data-test-subj='deploymentInfrastructure-flyout-closeButton'
                  color='primary'
                  fill={true}
                  iconType='arrowLeft'
                  onClick={onClose}
                >
                  <FormattedMessage
                    id='deploymentInfrastructure-flyout-back'
                    defaultMessage='Back'
                  />
                </EuiButton>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiText size='s' color='subdued'>
                  <FormattedMessage
                    id='deploymentInfrastructure-flyout-message'
                    defaultMessage='You must click the save button on the main page for these changes to take effect.'
                  />
                </EuiText>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlyoutFooter>
        </EuiFlyout>
      </EuiPortal>
    )
  }
}
