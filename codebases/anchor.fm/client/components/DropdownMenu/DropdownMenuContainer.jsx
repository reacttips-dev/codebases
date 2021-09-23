import React from 'react';
import PropTypes from 'prop-types';

import { DropdownMenu } from './DropdownMenu';

class DropdownMenuContainer extends React.Component {
  state = { isMenuVisible: false };

  handleShowMenu = () => {
    this.handleUpdateMenuVisibilityState(true);
  };

  handleHideMenu = () => {
    this.handleUpdateMenuVisibilityState(false);
  };

  handleUpdateMenuVisibilityState = isMenuVisible => {
    const { onToggleMenu } = this.props;
    this.setState({ isMenuVisible }, () => {
      // onToggleMenu is an optional callback after the
      // menu has been shown or hidden.
      if (onToggleMenu) {
        onToggleMenu({ isMenuVisible });
      }
    });
  };

  render() {
    const { isMenuVisible } = this.state;
    const {
      shouldShowDistributionItem,
      renderPressableContent,
      renderMenuHeader,
      renderMenuFooter,
      onClickMenuFooter,
      menuItems,
      flyoutWidth,
      alignFlyout,
    } = this.props;
    return (
      <DropdownMenu
        shouldShowDistributionItem={shouldShowDistributionItem}
        flyoutWidth={flyoutWidth}
        alignFlyout={alignFlyout}
        onShowMenu={this.handleShowMenu}
        onHideMenu={this.handleHideMenu}
        isMenuVisible={isMenuVisible}
        renderPressableContent={renderPressableContent}
        menuItems={menuItems}
        renderMenuHeader={renderMenuHeader}
        renderMenuFooter={renderMenuFooter}
        onClickMenuFooter={onClickMenuFooter}
      />
    );
  }
}

DropdownMenuContainer.defaultProps = {
  shouldShowDistributionItem: false,
  renderMenuHeader: null,
  renderMenuFooter: null,
  flyoutWidth: null,
  alignFlyout: null,
  onToggleMenu: () => {},
  onClickMenuFooter: () => {},
};

DropdownMenuContainer.propTypes = {
  shouldShowDistributionItem: PropTypes.bool,
  renderPressableContent: PropTypes.func.isRequired,
  renderMenuHeader: PropTypes.element,
  renderMenuFooter: PropTypes.element,
  onToggleMenu: PropTypes.func,
  onClickMenuFooter: PropTypes.func,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      iconType: PropTypes.string,
      href: PropTypes.string,
      to: PropTypes.string,
      onClick: PropTypes.func,
      icon: PropTypes.shape({
        backgroundColor: PropTypes.string,
        iconColor: PropTypes.string,
        padding: PropTypes.number,
        type: PropTypes.string,
        width: PropTypes.number,
      }),
      target: PropTypes.string,
      isDownloadLink: PropTypes.bool,
    })
  ).isRequired,
  flyoutWidth: PropTypes.number,
  alignFlyout: PropTypes.string,
};

export { DropdownMenuContainer };
