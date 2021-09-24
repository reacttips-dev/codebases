import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ASH, CHARCOAL, FOCUS_BLUE, WHITE} from '../../../style/colors';
import SSLogo from '../../icons/ss-logo.svg';
import Hamburger from '../../icons/hamburger.svg';
import CloseMenu from '../../icons/close-menu.svg';
import {BASE_TEXT, WEIGHT} from '../../../style/typography';
import {ALPHA} from '../../../style/color-utils';
import SearchResults from './search-results';
import SearchInput from '../shared/search-input';
import animate, {opacity, translateY} from '../../animation/animate';

const stopEvent = e => {
  e.preventDefault();
  e.stopPropagation();
};

const TWEEN_DURATION = 300;

export const MOBILE_HEADER_ZINDEX = 101;

// Menu states
export const OPENING = 'opening';
export const OPEN = 'open';
export const CLOSING = 'closing';
export const CLOSED = 'closed';

const Container = glamorous.div(
  {
    background: WHITE,
    display: 'flex',
    flexDirection: 'column',
    borderBottom: `1px solid ${ASH}`,
    boxSizing: 'border-box'
  },
  // This keeps the menu hidden when closed & rubber-banding
  ({menuState}) => ({overflow: menuState === CLOSED ? 'hidden' : 'visible'}),
  ({stickyNavbar = false}) =>
    stickyNavbar ? {position: 'fixed', top: 0, width: '100%', zIndex: 100} : {}
);

const Header = glamorous.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: MOBILE_HEADER_ZINDEX,
  background: WHITE
});

const Button = glamorous.a(({width = 70, padding = 0}) => ({
  width: width,
  height: 70,
  padding: padding,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

const Menu = glamorous.nav(
  {
    transform: 'translateY(-100vh)', // start offscreen initially
    width: '100%',
    background: WHITE,
    position: 'absolute',
    top: 0,
    zIndex: MOBILE_HEADER_ZINDEX - 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    boxSizing: 'border-box',
    borderBottom: `1px solid ${ASH}`,
    '> ol': {
      width: '100%',
      background: WHITE,
      margin: 0,
      padding: '5px 0 5px 0',
      display: 'flex',
      flexDirection: 'column',
      '> li': {
        listStyle: 'none',
        margin: 0,
        padding: '0 10px',
        '> a': {
          ...BASE_TEXT,
          fontSize: 16,
          fontWeight: WEIGHT.BOLD,
          padding: '12px 12px',
          display: 'block',
          color: CHARCOAL,
          textDecoration: 'none',
          borderRadius: 2,
          WebkitTapHighlightColor: ALPHA(FOCUS_BLUE, 0.05)
        }
      },
      '> li.sep > div': {
        borderTop: `2px solid ${ASH}`,
        margin: '5px 12px'
      }
    }
  },
  ({transform, top}) => ({
    transform,
    top
  })
);

class MobileHeader extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    contentRef: PropTypes.any,
    headerOffset: PropTypes.number,
    stickyNavbar: PropTypes.bool
  };

  state = {
    menuState: CLOSED,
    searchValue: '',
    searchActive: false,
    searchResults: null,
    headerOffset: 0
  };

  menu = createRef();
  header = createRef();

  getHeights = () => {
    const menuRect = this.menu.current.getBoundingClientRect();
    const headerRect = this.header.current.getBoundingClientRect();
    return {
      menuHeight: menuRect.height,
      headerHeight: headerRect.height,
      headerOffset: headerRect.top
    };
  };

  closeMenu = () => {
    if (this.state.menuState !== OPEN) {
      return;
    }

    const {menuHeight, headerHeight} = this.getHeights();
    if (this.props.contentRef.current) {
      this.props.contentRef.current.removeEventListener('touchstart', this.closeMenu, {
        passive: false
      });
      animate(
        [{element: this.props.contentRef.current, from: 0.3, to: 1}],
        TWEEN_DURATION,
        opacity,
        () =>
          // unbind this only after anim is done otherwise it will be removed in the same
          // call stack as the touchstart that closed the menu, and actually allow the click to proceed
          this.props.contentRef.current.removeEventListener('click', stopEvent, {
            passive: false,
            capture: true
          })
      );
    }
    this.setState({menuState: CLOSING});
    animate(
      [{element: this.menu.current, from: headerHeight, to: -menuHeight + headerHeight}],
      TWEEN_DURATION,
      translateY,
      () => this.setState({menuState: CLOSED})
    );
  };

  openMenu = () => {
    if (this.state.menuState !== CLOSED) {
      return;
    }
    const {menuHeight, headerHeight, headerOffset} = this.getHeights();
    if (this.props.contentRef.current) {
      this.props.contentRef.current.addEventListener('touchstart', this.closeMenu, {
        passive: false
      });
      this.props.contentRef.current.addEventListener('click', stopEvent, {
        passive: false,
        capture: true
      });
      animate(
        [{element: this.props.contentRef.current, from: 1, to: 0.3}],
        TWEEN_DURATION,
        opacity
      );
    }

    this.setState(
      {
        menuState: OPENING,
        searchValue: '',
        searchActive: false,
        headerOffset
      },
      () =>
        animate(
          [
            {
              element: this.menu.current,
              from: -menuHeight + headerHeight,
              to: headerHeight
            }
          ],
          TWEEN_DURATION,
          translateY,
          () => this.setState({menuState: OPEN})
        )
    );
  };

  toggleMenu = () => {
    const {menuState} = this.state;
    if (menuState === CLOSED) {
      this.deactivateSearch();
      this.openMenu();
    } else if (menuState === OPEN) {
      this.closeMenu();
    }
  };

  activateSearch = () => {
    const {stickyNavbar} = this.props;

    if (!this.state.searchActive) {
      this.closeMenu();
      this.setState({searchActive: true});

      if (this.props.contentRef.current && !stickyNavbar) {
        this.props.contentRef.current.style.display = 'none';
      }
    }
  };

  deactivateSearch = () => {
    const {stickyNavbar} = this.props;

    if (stickyNavbar) {
      const bodyElm = document.getElementsByTagName('body')[0];
      bodyElm.style.overflow = 'initial';
    }

    if (this.state.searchActive) {
      this.setState({searchValue: '', searchActive: false, searchResults: null});
      if (this.props.contentRef.current && !stickyNavbar) {
        this.props.contentRef.current.style.display = 'block';
      }
    }
  };

  handleSearch = value => {
    const {stickyNavbar} = this.props;

    if (stickyNavbar) {
      const bodyElm = document.getElementsByTagName('body')[0];
      bodyElm.style.overflow = 'hidden';
    }

    if (value.length > 0 && !this.state.searchActive) {
      this.activateSearch();
    }

    this.setState({searchValue: value});
  };

  handleSearchResults = searchResults => this.setState({searchResults});

  componentDidUpdate(prevProps) {
    const {headerOffset} = this.props;
    if (prevProps.headerOffset !== headerOffset) {
      this.handleHeaderOffset(headerOffset);
    }
  }

  handleHeaderOffset = headerOffset => this.setState({headerOffset});

  render() {
    const {menuState, searchValue, searchActive, searchResults, headerOffset} = this.state;
    const {stickyNavbar} = this.props;

    return (
      <Container menuState={menuState} stickyNavbar={stickyNavbar}>
        <Header innerRef={this.header}>
          <Button href="/" width={140} padding={'0 20px'}>
            <SSLogo />
          </Button>
          <SearchInput
            inputWidth={'40%'}
            value={searchValue}
            active={searchActive}
            onChange={this.handleSearch}
            onFocus={this.closeMenu}
            onResults={this.handleSearchResults}
            onDeactivate={this.deactivateSearch}
          />
          <Button onTouchStart={this.toggleMenu}>
            {menuState === OPEN || menuState === OPENING ? <CloseMenu /> : <Hamburger />}
          </Button>
        </Header>
        <SearchResults active={searchActive} value={searchValue} results={searchResults} />
        <Menu innerRef={this.menu} top={headerOffset}>
          <ol onClick={this.closeMenu}>{this.props.children}</ol>
        </Menu>
      </Container>
    );
  }
}

const Separator = () => (
  <li className="sep">
    <div />
  </li>
);
Separator.displayName = 'MobileHeaderSeparator';

export {MobileHeader as default, Separator};
