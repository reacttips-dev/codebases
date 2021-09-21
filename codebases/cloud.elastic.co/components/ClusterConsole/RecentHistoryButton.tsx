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

import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { isEmpty } from 'lodash'

import {
  EuiBadge,
  EuiButtonEmpty,
  EuiCode,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPopover,
} from '@elastic/eui'

import { ConsoleRequestState } from '../../reducers/clusterConsole'

type Props = {
  history: ConsoleRequestState[]
  onItemClick: (historyItem: ConsoleRequestState) => void
  clearHistory: () => void
}

type State = {
  isMenuOpen: boolean
}

class RecentHistoryButton extends Component<Props, State> {
  state: State = {
    isMenuOpen: false,
  }

  render() {
    const { history } = this.props
    const { isMenuOpen } = this.state
    const disabled = isEmpty(history)

    return (
      <EuiPopover
        id='clusterConsole-recentHistory'
        button={
          <EuiButtonEmpty
            size='xs'
            iconType='clock'
            onClick={this.openMenu}
            disabled={disabled}
            data-test-id='api-console-recent-history-btn'
          >
            <FormattedMessage id='cluster-console-path.recent' defaultMessage='Recent' />
          </EuiButtonEmpty>
        }
        isOpen={isMenuOpen}
        closePopover={this.closeMenu}
        panelPaddingSize='none'
        anchorPosition='downLeft'
      >
        <EuiContextMenuPanel items={this.getItems()} />
      </EuiPopover>
    )
  }

  openMenu = () => {
    this.setState({ isMenuOpen: true })
  }

  closeMenu = () => {
    this.setState({ isMenuOpen: false })
  }

  getItems = () => {
    const { history } = this.props

    const historyItems = history.map((historyItem) => (
      <EuiContextMenuItem
        key={`${historyItem.method} ${historyItem.path}`}
        icon='console'
        className='euiContextMenuItem--m'
        onClick={() => this.selectItem(historyItem)}
      >
        <EuiFlexGroup gutterSize='m' alignItems='center'>
          <EuiFlexItem grow={false}>
            <EuiBadge color='hollow'>{historyItem.method}</EuiBadge>
          </EuiFlexItem>

          <EuiFlexItem>
            <div>
              <EuiCode>{historyItem.path}</EuiCode>
            </div>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiContextMenuItem>
    ))

    historyItems.push(
      <EuiContextMenuItem key='clear history' icon='broom' onClick={this.clearHistory}>
        <FormattedMessage id='cluster-console-path.clear-history' defaultMessage='Clear history' />
      </EuiContextMenuItem>,
    )

    return historyItems
  }

  selectItem(historyItem: ConsoleRequestState) {
    const { onItemClick } = this.props

    this.closeMenu()
    onItemClick(historyItem)
  }

  clearHistory = () => {
    const { clearHistory } = this.props

    this.closeMenu()
    clearHistory()
  }
}

export default RecentHistoryButton
