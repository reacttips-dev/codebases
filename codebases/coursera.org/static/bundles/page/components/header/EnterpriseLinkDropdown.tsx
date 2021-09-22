import React from 'react';
import classNames from 'classnames';
import URI from 'jsuri';
import PropTypes from 'prop-types';
import Media from 'react-media';
import { compose, withHandlers, getContext } from 'recompose';
import { Button, DropDown } from '@coursera/coursera-ui';
import { SvgChevronDown, SvgChevronUp } from '@coursera/coursera-ui/svg';
import Retracked, { TrackingData } from 'js/lib/retracked';

import _t from 'i18n!nls/page';

import 'css!bundles/page/components/header/__styles__/EnterpriseLinkDropdown';

type State = {
  showDropdown: boolean;
  anchorElement: HTMLElement | null;
  dropdownHover: boolean;
  dropdownContentsHover: boolean;
};

type EventData = Parameters<typeof Retracked.trackComponent>[0];

type WithTrackingData = Parameters<typeof Retracked.trackComponent>[4];

type PropsFromGetContext = {
  _eventData: EventData;
  _withTrackingData: WithTrackingData;
};

type Handlers = {
  createHandleItemClick: (arg: { href: string; trackingName: string; trackingData: TrackingData }) => () => void;
  handleDropdownEnter: (arg: { trackingName: string; trackingData: TrackingData }) => void;
  handleDropdownExit: (arg: { trackingName: string; trackingData: TrackingData }) => void;
};

function preventDefault(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  event?.preventDefault();
}

export class EnterpriseLinkDropdown extends React.Component<Handlers, State> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state: State = {
    showDropdown: false,
    anchorElement: null,
    dropdownHover: false,
    dropdownContentsHover: false,
  };

  handleShowDropdown = (ev: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      showDropdown: true,
    });

    ev.preventDefault();
    return false;
  };

  showHoverDropdown = () => {
    this.setState({
      showDropdown: true,
    });
  };

  handleEnterDropdown = () => {
    this.props.handleDropdownEnter({
      trackingName: 'header_right_nav_dropdown',
      trackingData: {},
    });
    this.setState(
      {
        dropdownHover: true,
      },
      () => {
        this.determineDropdownState();
      }
    );
  };

  handleEnterContents = () => {
    this.setState(
      {
        dropdownContentsHover: true,
      },
      () => {
        this.determineDropdownState();
      }
    );
  };

  handleExitDropdown = () => {
    this.props.handleDropdownExit({
      trackingName: 'header_right_nav_dropdown',
      trackingData: {},
    });
    this.setState(
      {
        dropdownHover: false,
      },
      () => {
        this.determineDropdownState();
      }
    );
  };

  handleExitContents = () => {
    this.setState(
      {
        dropdownContentsHover: false,
      },
      () => {
        this.determineDropdownState();
      }
    );
  };

  determineDropdownState = () => {
    const { dropdownHover, dropdownContentsHover } = this.state;
    if (!dropdownHover && !dropdownContentsHover) {
      this.handleHideDropDown();
    } else {
      this.setState({ showDropdown: true });
    }
  };

  handleHideDropDown = () => {
    this.setState({ showDropdown: false });
  };

  _generateUTM = (href: string, utmSource: string) => {
    return new URI(href)
      .addQueryParam('utm_campaign', 'header-dropdown-expanded')
      .addQueryParam('utm_content', 'corp-to-marketing')
      .addQueryParam('utm_medium', 'coursera')
      .addQueryParam('utm_source', utmSource)
      .toString();
  };

  render() {
    const { createHandleItemClick } = this.props;
    const { anchorElement, showDropdown } = this.state;
    const rebrandPrimaryText = '#1F1F1F';

    return (
      <Media query={{ maxWidth: 1080, minWidth: 925 }} defaultMatches={false}>
        {(matches) => {
          return (
            <div
              className="c-ph-enterprise c-ph-enterprise--dropdown-experiment"
              onMouseEnter={this.handleEnterDropdown}
              onMouseLeave={this.handleExitDropdown}
            >
              <Button
                size="zero"
                rootClassName={classNames('d-block horizontal-box', 'c-ph-enterprise__button', {
                  'c-ph-enterprise__button--shadow': showDropdown,
                })}
                type="link"
                onClick={this.handleShowDropdown}
              >
                {matches ? (
                  <span className="c-ph-enterprise__dropdown">{_t('Enterprise')}</span>
                ) : (
                  <span className="c-ph-enterprise__dropdown">{_t('For Enterprise')}</span>
                )}
                <span className="c-ph-enterprise__svg">
                  {showDropdown ? (
                    <SvgChevronUp color={rebrandPrimaryText} />
                  ) : (
                    <SvgChevronDown color={rebrandPrimaryText} />
                  )}
                </span>
                {showDropdown ? <span className="c-ph-enterprise__dropdown__cover" /> : null}
              </Button>
              <div
                className="c-ph-enterprise__dropdown-anchor"
                onMouseLeave={this.handleExitContents}
                onMouseEnter={this.handleEnterContents}
              >
                <DropDown.MenuV2
                  isOpen={showDropdown}
                  anchorElement={anchorElement}
                  onRequestClose={this.handleHideDropDown}
                >
                  <DropDown.Item
                    rootClassName="c-ph-enterprise-dropdown-item"
                    onClick={createHandleItemClick({
                      href: this._generateUTM('https://coursera.org/business', 'dropdown_business_click'),
                      trackingName: 'header_right_nav_dropdown_business_click',
                      trackingData: {},
                    })}
                    key="coursera-for-business"
                    htmlAttributes={{
                      'data-e2e': `item-coursera-for-business`,
                    }}
                  >
                    <a
                      href={this._generateUTM('https://coursera.org/business', 'dropdown_business_click')}
                      onClick={preventDefault}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {_t('Coursera for Business')}
                    </a>
                  </DropDown.Item>
                  <DropDown.Item
                    rootClassName="c-ph-enterprise-dropdown-item"
                    onClick={createHandleItemClick({
                      href: this._generateUTM('https://coursera.org/business/teams', 'dropdown_teams_click'),
                      trackingName: 'header_right_nav_dropdown_teams_click',
                      trackingData: {},
                    })}
                    key="coursera-for-teams"
                    htmlAttributes={{
                      'data-e2e': `item-coursera-for-teams`,
                    }}
                  >
                    <a
                      href={this._generateUTM('https://coursera.org/business/teams', 'dropdown_teams_click')}
                      onClick={preventDefault}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {_t('Coursera for Teams')}
                    </a>
                  </DropDown.Item>
                  <DropDown.Item
                    rootClassName="c-ph-enterprise-dropdown-item"
                    onClick={createHandleItemClick({
                      href: this._generateUTM('https://coursera.org/campus', 'dropdown_campus_click'),
                      trackingName: 'header_right_nav_dropdown_campus_click',
                      trackingData: {},
                    })}
                    key="coursera-for-campus"
                    htmlAttributes={{
                      'data-e2e': `item-coursera-for-campus`,
                    }}
                  >
                    <a
                      href={this._generateUTM('https://coursera.org/campus', 'dropdown_campus_click')}
                      onClick={preventDefault}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {_t('Coursera for Campus')}
                    </a>
                  </DropDown.Item>
                  <DropDown.Item
                    rootClassName="c-ph-enterprise-dropdown-item"
                    onClick={createHandleItemClick({
                      href: this._generateUTM('https://coursera.org/government', 'dropdown_government_click'),
                      trackingName: 'header_right_nav_dropdown_government_click',
                      trackingData: {},
                    })}
                    key="coursera-for-government"
                    htmlAttributes={{
                      'data-e2e': `item-coursera-for-government`,
                    }}
                  >
                    <a
                      href={this._generateUTM('https://coursera.org/government', 'dropdown_government_click')}
                      onClick={preventDefault}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {_t('Coursera for Government')}
                    </a>
                  </DropDown.Item>
                  );
                </DropDown.MenuV2>
              </div>
            </div>
          );
        }}
      </Media>
    );
  }
}

export default compose<Handlers, {}>(
  getContext({
    _eventData: PropTypes.object,
    _withTrackingData: PropTypes.func,
  }),
  withHandlers<PropsFromGetContext, Handlers>({
    createHandleItemClick: ({ _eventData, _withTrackingData }) => ({ href, trackingName, trackingData }) => () => {
      // Can't easily cancel this when the link itself is clicked while maintaining bubbling for the Dropdown, so do
      // we track and navigate imperatively instead.
      Retracked.trackComponent(_eventData, { href, ...trackingData }, trackingName, 'click', _withTrackingData);
      const win = window.open(href, '_blank');
      win?.focus();
    },
    // TODO(ppaskaris): Hook into DropDown.ButtonMenu for onOpen onClose events, use that to override the nonsense
    // overflow style on body causing the layout to shift.
    handleDropdownEnter: ({ _eventData, _withTrackingData }) => ({ trackingName, trackingData }) => {
      Retracked.trackComponent(_eventData, { ...trackingData }, trackingName, 'enter', _withTrackingData);
    },
    handleDropdownExit: ({ _eventData, _withTrackingData }) => ({ trackingName, trackingData }) => {
      Retracked.trackComponent(_eventData, { ...trackingData }, trackingName, 'exit', _withTrackingData);
    },
  })
)(EnterpriseLinkDropdown);
