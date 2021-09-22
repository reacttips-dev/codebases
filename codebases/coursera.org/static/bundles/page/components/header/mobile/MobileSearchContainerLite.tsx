import React from 'react';
import classNames from 'classnames';

import createLoadableComponent from 'js/lib/createLoadableComponent';

import LazyLoadingHandler from 'bundles/page/components/shared/LazyLoadingHandler';

import { isNextJSApp } from 'bundles/next/utils/envUtils';

import { TRANSITION_DELAY } from 'bundles/page/components/header/mobile/constants';

import 'css!bundles/page/components/header/mobile/__styles__/MobileSearchPage';

const MobileSearchContents = createLoadableComponent(
  () => import('bundles/page/components/header/mobile/MobileSearchContents'),
  LazyLoadingHandler
);

type Props = {
  searchIsOpen: boolean;
  searchIsFocused: boolean;
  isSearchPage?: boolean;
  onFocus: () => void;
  onBlur: () => void;
  hideMobileSearchPage: () => void;
};

type State = {
  firstMount: boolean;
  searchHasBeenOpen: boolean;
};

class MobileSearchContainerLite extends React.Component<Props, State> {
  state = {
    firstMount: true,
    searchHasBeenOpen: false,
  };

  componentDidMount() {
    this.setState({ firstMount: false });
  }

  // stop body scrolling workaround for iOS
  componentDidUpdate(prevProps: Props) {
    const { searchHasBeenOpen } = this.state;
    const searchWasFocused = prevProps.searchIsFocused;
    const { searchIsFocused, searchIsOpen } = this.props;
    const focusDidNotUpdate = searchWasFocused === searchIsFocused;
    const searchWasOpen = !searchIsOpen && prevProps.searchIsOpen;
    if (document.body && focusDidNotUpdate) {
      if (searchIsOpen) {
        // On next app due to soft transitions between pages, make timeout much shorter so we can remove this action when navigating.
        // TODO (Connor): Update here when rolling out soft navigations.
        const delay = isNextJSApp ? 1 : TRANSITION_DELAY * 2;
        setTimeout(() => {
          const searchIsStillOpen = this.props.searchIsOpen;
          if (document.body && searchIsStillOpen) document.body.style.position = 'fixed';
        }, delay); // wait for search page to cover background
        this.scrollY = window.scrollY;
      } else if (searchWasOpen) {
        const { scrollY } = this;
        document.body.style.position = '';
        window.scrollTo(0, scrollY);
      }
    }

    // Record if search has been open ie: JS for content has been loaded
    if (searchIsOpen && !searchHasBeenOpen) {
      this.setState(() => ({
        searchHasBeenOpen: true,
      }));
    }
  }

  scrollY = 0;

  render() {
    const { firstMount, searchHasBeenOpen } = this.state;
    const { searchIsOpen, onFocus, onBlur, hideMobileSearchPage } = this.props;

    return (
      <div
        className={classNames('rc-MobileSearchPage', { 'open-mobile-search': searchIsOpen && !firstMount })}
        style={{ zIndex: 3001 }}
      >
        <div className="mobile-search-body-wrapper">
          {/* Keep contents in DOM if search has been loaded to support client-side routing links */}
          {(searchIsOpen || searchHasBeenOpen) && (
            <MobileSearchContents
              searchIsOpen={searchIsOpen}
              onBlur={onBlur}
              onFocus={onFocus}
              hideMobileSearchPage={hideMobileSearchPage}
            />
          )}
        </div>
      </div>
    );
  }
}

export default MobileSearchContainerLite;
