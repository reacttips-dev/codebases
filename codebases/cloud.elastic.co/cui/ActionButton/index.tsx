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

import { isEmpty } from 'lodash'

import React, { Component, ReactElement, ReactNode } from 'react'

import {
  EuiButtonEmpty,
  EuiButtonEmptyProps,
  EuiContextMenuItem,
  EuiContextMenuPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiPopover,
  IconType,
} from '@elastic/eui'

import { CuiLink } from '../Link'

export type CuiActionButtonActionProps = {
  name?: ReactNode
  iconType?: IconType
  href?: string
  onClick?: () => void
  wrapper?: (props: { children: ReactNode }) => ReactNode
}

type Props = {
  primaryAction: ReactNode
  actions: CuiActionButtonActionProps[]
  size?: EuiButtonEmptyProps['size']
  color?: EuiButtonEmptyProps['color']
  hideEmptyMenu?: boolean
}

type State = {
  isSecondaryMenuOpen: boolean
}

export class CuiActionButton extends Component<Props, State> {
  state: State = {
    isSecondaryMenuOpen: false,
  }

  static defaultProps = {
    hideEmptyMenu: true,
  }

  render() {
    const { hideEmptyMenu } = this.props
    const panelItems = this.getSecondaryActionPanelItems()
    const emptyMenu = isEmpty(panelItems)
    const shouldRenderMenu = !emptyMenu || !hideEmptyMenu

    return (
      <EuiFlexGroup gutterSize='none'>
        <EuiFlexItem grow={false}>{this.renderPrimaryAction()}</EuiFlexItem>

        {shouldRenderMenu && (
          <EuiFlexItem grow={false}>
            {this.renderSecondaryActionsMenu({ panelItems, disabled: emptyMenu })}
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    )
  }

  renderPrimaryAction() {
    const { primaryAction } = this.props

    return primaryAction
  }

  renderSecondaryActionsMenu({
    panelItems,
    disabled,
  }: {
    panelItems: ReactElement[]
    disabled: boolean
  }) {
    const { size, color } = this.props
    const { isSecondaryMenuOpen } = this.state

    const menuButton = (
      <EuiButtonEmpty
        size={size}
        color={color}
        iconType='arrowDown'
        onClick={this.toggleSecondaryActionsMenu}
        disabled={disabled}
      />
    )

    return (
      <EuiPopover
        button={menuButton}
        isOpen={isSecondaryMenuOpen}
        closePopover={this.closeSecondaryMenu}
        panelPaddingSize='none'
      >
        <EuiContextMenuPanel items={panelItems} />
      </EuiPopover>
    )
  }

  getSecondaryActionPanelItems(): ReactElement[] {
    const { actions } = this.props

    return actions.map(this.getSecondaryActionPanelItem)
  }

  getSecondaryActionPanelItem = (
    action: CuiActionButtonActionProps,
    index: number,
  ): ReactElement => {
    const { wrapper, name, iconType, href, onClick } = action

    const panelContent = (
      <EuiFlexGroup gutterSize='m' responsive={false}>
        {iconType && (
          <EuiFlexItem grow={false}>
            <EuiIcon type={iconType} />
          </EuiFlexItem>
        )}

        <EuiFlexItem grow={false}>{name}</EuiFlexItem>
      </EuiFlexGroup>
    )

    const linkedContent = href ? (
      <CuiLink to={href} onClick={onClick}>
        {panelContent}
      </CuiLink>
    ) : (
      <a onClick={onClick}>{panelContent}</a>
    )

    const wrappedPanel = wrapper ? wrapper({ children: linkedContent }) : linkedContent

    return (
      <EuiContextMenuItem key={index} onClick={this.closeSecondaryMenu}>
        {wrappedPanel}
      </EuiContextMenuItem>
    )
  }

  closeSecondaryMenu = () => {
    this.setState({ isSecondaryMenuOpen: false })
  }

  openSecondaryMenu = () => {
    this.setState({ isSecondaryMenuOpen: true })
  }

  toggleSecondaryActionsMenu = () => {
    const { isSecondaryMenuOpen } = this.state

    if (isSecondaryMenuOpen) {
      this.closeSecondaryMenu()
    } else {
      this.openSecondaryMenu()
    }
  }
}
