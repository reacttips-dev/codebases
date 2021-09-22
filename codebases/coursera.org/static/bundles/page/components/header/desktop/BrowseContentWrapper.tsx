import React from 'react';

import LazyLoadingHandler from 'bundles/page/components/shared/LazyLoadingHandler';
import createLoadableComponent from 'js/lib/createLoadableComponent';
import SearchBar from 'bundles/search/components/SearchBar';
import classNames from 'classnames';
import 'css!bundles/page/components/header/desktop/__styles__/BrowseContentWrapper';

declare const COURSERA_APP_NAME: string;

let LoadableMegaMenu: React.ComponentType<$TSFixMe> | undefined;
let MegaMenuWrapper: React.ComponentType<$TSFixMe>;
if (COURSERA_APP_NAME === 'front-page') {
  import('bundles/page/components/header/desktop/mega-menu/MegaMenuWrapper').then((component) => {
    MegaMenuWrapper = component.default;
  });
} else {
  import('bundles/page/components/header/desktop/mega-menu/MegaMenuWrapperLite').then((component) => {
    MegaMenuWrapper = component.default;
  });
  LoadableMegaMenu = createLoadableComponent(() => import('bundles/megamenu/components/MegaMenu'), LazyLoadingHandler);
}

type Props = {
  className?: string;
};

type State = {
  searchInputIsFocused: boolean;
};

class BrowseContentWrapper extends React.Component<Props, State> {
  state = { searchInputIsFocused: false };

  onFocus = () => {
    this.setState({ searchInputIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchInputIsFocused: false });
  };

  render() {
    const { className: customClassName } = this.props;
    const { searchInputIsFocused } = this.state;

    return (
      <div
        className={classNames('browse-content-wrapper horizontal-box', {
          [`${customClassName}`]: customClassName !== undefined,
        })}
      >
        <div className="MegamenuWrapperDiv" key="MegamenuWrapperDiv" id="MegamenuWrapperDiv">
          {/* adding wrapper to fix GR-24338 */}
          {MegaMenuWrapper && (
            <MegaMenuWrapper key="MegamenuWrapper" id="MegamenuWrapper" LoadableMegaMenu={LoadableMegaMenu} />
          )}
        </div>
        <SearchBar
          key="SearchBar"
          isSearchPage={false}
          searchInputIsFocused={searchInputIsFocused}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          {...this.props}
        />
      </div>
    );
  }
}
export default BrowseContentWrapper;
