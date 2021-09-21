import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Box from '../../shared/Box/index.tsx';
import Pressable from '../../shared/Pressable/index.tsx';
import Hoverable from '../../shared/Hoverable/index.tsx';
import { OutsideClickContainer } from '../OutsideClickContainer/index.tsx';
import { FlyoutMenu } from '../FlyoutMenu';

import styles from './styles.sass';

const cx = classnames.bind(styles);

// having some weird race conditions on iOS when toggling
// the menu open and closed. It will basically quickly open
// the menu, then close it right away. Adding a slight delay
// fixes this. It's quick enough so the user won't notice the delay
const delayFunctionCall = func => setTimeout(() => func, 200);

const DropdownMenu = ({
  shouldShowDistributionItem,
  isMenuVisible,
  renderPressableContent,
  menuItems,
  renderMenuHeader,
  renderMenuFooter,
  flyoutWidth,
  alignFlyout,
  onHideMenu,
  onShowMenu,
  onClickMenuFooter,
}) => (
  <Box
    display="flex"
    alignItems="center"
    dangerouslySetInlineStyle={{ flex: 1 }}
  >
    <Pressable
      onPress={() => {
        delayFunctionCall(isMenuVisible ? onHideMenu() : onShowMenu());
      }}
      fullWidth
    >
      {({ isPressed }) => (
        <Hoverable fullWidth>
          {({ isHovering }) => renderPressableContent(isPressed, isHovering)}
        </Hoverable>
      )}
    </Pressable>
    {isMenuVisible && (
      <OutsideClickContainer
        onClickOutside={() => {
          delayFunctionCall(onHideMenu());
        }}
        className={`outsideclickcontainer ${cx({
          alignFlyoutTop: alignFlyout === 'top',
          alignFlyoutBottom: alignFlyout === 'bottom',
        })}`}
      >
        <FlyoutMenu
          shouldShowDistributionItem={shouldShowDistributionItem}
          width={flyoutWidth}
          renderHeader={renderMenuHeader}
          renderFooter={renderMenuFooter}
          onClickFooter={onClickMenuFooter}
          menuItems={menuItems}
          onClickMenuItem={onHideMenu}
        />
      </OutsideClickContainer>
    )}
  </Box>
);

DropdownMenu.defaultProps = {
  shouldShowDistributionItem: false,
  renderMenuHeader: null,
  renderMenuFooter: null,
  flyoutWidth: null,
  alignFlyout: 'top',
  onClickMenuFooter: () => {},
};

DropdownMenu.propTypes = {
  shouldShowDistributionItem: PropTypes.bool,
  isMenuVisible: PropTypes.bool.isRequired,
  renderPressableContent: PropTypes.func.isRequired,
  renderMenuHeader: PropTypes.element,
  renderMenuFooter: PropTypes.element,
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
  alignFlyout: PropTypes.oneOf(['top', 'bottom']),
  onHideMenu: PropTypes.func.isRequired,
  onShowMenu: PropTypes.func.isRequired,
  onClickMenuFooter: PropTypes.func,
};

export { DropdownMenu };
