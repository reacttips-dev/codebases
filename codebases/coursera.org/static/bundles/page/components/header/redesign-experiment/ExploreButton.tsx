import React from 'react';
import PropTypes from 'prop-types';
import { css, StyleSheet } from '@coursera/coursera-ui';
import Retracked from 'js/app/retracked';

import TrackedButton from 'bundles/page/components/TrackedButton';
import { sourceSansPro } from 'bundles/front-page/constants/rebrand';

import _t from 'i18n!nls/page-header';

type Props = {
  menuIsOpen: boolean;
  openMenu: () => void;
  openMenuUsingKeyboard: () => void;
  closeMenu: () => void;
  setAnchorElement: (anchorElement: HTMLElement) => void;
  setExploreButtonRef: (buttonRef: HTMLButtonElement | null) => void;
};

const styles = StyleSheet.create({
  exploreButtonRoot: {
    margin: 'auto 0',
    background: 'none',
    border: 'none',
    height: '36px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '3px',
    backgroundColor: '#0056D2',
    fontWeight: 'bold',
    cursor: 'default',
    padding: 0,
    position: 'relative',
    color: 'white',
  },
  normalBtnLabel: {
    fontFamily: sourceSansPro,
    top: 0,
    width: '100%',
    lineHeight: '36px',
    textAlign: 'center',
    position: 'relative',
    paddingLeft: '4px',
    '@media screen (max-width: 1400px)': {
      paddingLeft: '2px',
    },
  },
  whiteLabel: {
    color: 'white',
  },
  activeBtnLabel: {
    color: '#0056D2',
    fontWeight: 'bold',
  },
  menuIsOpen: {
    boxShadow: '#E4E4E4 0px 1px 6px, #E4E4E4 0px 1px 4px',
    backgroundColor: 'transparent',
    height: '100%',
    cursor: 'default',
    color: '#0056D2',
  },
  arrow: {
    marginLeft: 6,
  },
});

class ExploreButtonRedesign extends React.Component<Props> {
  static contextTypes = {
    _eventData: PropTypes.object,
  };

  toggleMenu = () => {
    const { openMenuUsingKeyboard, menuIsOpen, closeMenu } = this.props;
    if (!menuIsOpen) {
      // comment TBA
      openMenuUsingKeyboard();
    } else {
      closeMenu();
    }
  };

  onKeyUp = (evt: React.KeyboardEvent<unknown>) => {
    const { menuIsOpen } = this.props;
    switch (evt.key) {
      case ' ':
        // because space does not trigger retracked click event like enter
        Retracked.trackComponent(this.context?._eventData, { menuIsOpen }, 'explore_button', 'click');
        evt.preventDefault();
        this.toggleMenu();
        break;
      case 'Enter':
        evt.preventDefault();
        this.toggleMenu();
        break;
      default:
    }
  };

  onSetAnchorElement = (anchorElement?: HTMLElement | null) => {
    const { setAnchorElement } = this.props;
    if (anchorElement) {
      setAnchorElement(anchorElement);
    }
  };

  openMenuWithTracking = () => {
    const { openMenu } = this.props;
    openMenu();
    // adding hover action here because trackedButton doesn't support tracking hover
    Retracked.trackComponent(this.context?._eventData, {}, 'explore_button', 'hover');
  };

  closeMenu = () => {
    const { closeMenu } = this.props;
    closeMenu();
    Retracked.trackComponent(this.context?._eventData, {}, 'explore_button', 'leave');
  };

  renderSvgArrow = (menuIsOpen: boolean) => {
    const iconFill = menuIsOpen ? '#2073d4' : '#fff';

    return (
      <svg {...css('rc-ExploreButton__arrow', styles.arrow)} viewBox="0 0 32 32" width="9" height="9">
        <path
          fill={iconFill}
          d="M30.054 14.429l-13.25 13.232q-0.339 0.339-0.804 0.339t-0.804-0.339l-13.25-13.232q-0.339-0.339-0.339-0.813t0.339-0.813l2.964-2.946q0.339-0.339 0.804-0.339t0.804 0.339l9.482 9.482 9.482-9.482q0.339-0.339 0.804-0.339t0.804 0.339l2.964 2.946q0.339 0.339 0.339 0.813t-0.339 0.813z"
        />
      </svg>
    );
  };

  render() {
    const { menuIsOpen, openMenu, setExploreButtonRef } = this.props;

    return (
      <TrackedButton
        trackingName="explore_button"
        {...css(
          `rc-ExploreButtonRedesign${menuIsOpen ? ' menuIsOpen' : ''}`,
          styles.exploreButtonRoot,
          menuIsOpen && styles.menuIsOpen
        )}
        onMouseEnter={this.openMenuWithTracking}
        onMouseLeave={this.closeMenu}
        onKeyUp={this.onKeyUp}
        onMouseDown={openMenu}
        aria-expanded={menuIsOpen}
        aria-haspopup={true}
        aria-label="Explore our catalog"
        data-e2e="megamenu-explore-button"
        onSetRef={setExploreButtonRef}
        data={{ menuIsOpen }}
      >
        <span {...css(styles.normalBtnLabel)} ref={this.onSetAnchorElement}>
          {_t('Explore')}
          {this.renderSvgArrow(menuIsOpen)}
        </span>
      </TrackedButton>
    );
  }
}
export default ExploreButtonRedesign;
