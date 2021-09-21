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

import React, { Component, Fragment, ReactNode } from 'react'
import { noop } from 'lodash'

import { EuiSpacer, EuiTab, EuiTabs } from '@elastic/eui'

interface CuiTab {
  content: ReactNode
  disabled?: boolean
  id?: string
  title: ReactNode
  url?: string
}

interface Props {
  onTabClick: (tab: CuiTab) => void
  selectedTab?: CuiTab | null
  tabs: CuiTab[]
}

interface State {
  selectedTab: CuiTab | null
}

export class CuiTabbedContent extends Component<Props, State> {
  static defaultProps = {
    onTabClick: noop,
  }

  state: State = {
    selectedTab: null,
  }

  render() {
    const { tabs } = this.props
    const selectedTab = this.props.selectedTab || this.state.selectedTab || tabs[0]
    const selectedTabContent = selectedTab && selectedTab.content

    return (
      <div>
        <EuiTabs>
          {tabs.map((tab, index) => (
            <EuiTab
              key={tab.id || index}
              disabled={tab.disabled}
              isSelected={tab === selectedTab}
              onClick={() => this.onTabClick(tab)}
            >
              {tab.title}
            </EuiTab>
          ))}
        </EuiTabs>

        {selectedTabContent && (
          <Fragment>
            <EuiSpacer size='m' />
            {selectedTabContent}
          </Fragment>
        )}
      </div>
    )
  }

  onTabClick(tab) {
    this.props.onTabClick(tab)

    this.setSelectedTab(tab)
  }

  setSelectedTab(selectedTab) {
    this.setState({ selectedTab })
  }
}
