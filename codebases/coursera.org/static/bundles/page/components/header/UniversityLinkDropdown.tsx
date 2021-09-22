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
};

function preventDefault(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  event?.preventDefault();
}

export class UniversityLinkDropdown extends React.Component<Handlers, State> {
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

  _generateUTM = (
    href: string,
    utmCampaign: string,
    utmContent: string,
    utmMedium: string,
    utmSource: string,
    utmTerm?: string
  ) => {
    const uri = new URI(href)
      .addQueryParam('utm_campaign', utmCampaign)
      .addQueryParam('utm_content', utmContent)
      .addQueryParam('utm_medium', utmMedium)
      .addQueryParam('utm_source', utmSource);

    if (utmTerm !== undefined) {
      uri.addQueryParam('utm_term', utmTerm);
    }

    return uri.toString();
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
                  <span className="c-ph-enterprise__dropdown">{_t('Universities')}</span>
                ) : (
                  <span className="c-ph-enterprise__dropdown">{_t('For Universities')}</span>
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
                      href: this._generateUTM(
                        'https://www.coursera.org/for-university-and-college-students',
                        'header-for-students',
                        'corp-to-landing-for-students',
                        'coursera',
                        'header-for-students-link'
                      ),
                      trackingName: 'header_right_nav_dropdown_students_click',
                      trackingData: {},
                    })}
                    key="coursera-for-students"
                    htmlAttributes={{
                      'data-e2e': `item-coursera-for-students`,
                    }}
                  >
                    <a
                      href={this._generateUTM(
                        'https://www.coursera.org/for-university-and-college-students',
                        'header-for-students',
                        'corp-to-landing-for-students',
                        'coursera',
                        'header-for-students-link'
                      )}
                      onClick={preventDefault}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {_t('Students')}
                    </a>
                  </DropDown.Item>
                  <DropDown.Item
                    rootClassName="c-ph-enterprise-dropdown-item"
                    onClick={createHandleItemClick({
                      href: this._generateUTM(
                        'https://www.coursera.org/campus/basic',
                        'header-for-c4cb',
                        'corp-to-landing-for-universities',
                        'website',
                        'header-for-universities-link',
                        'university-staff'
                      ),
                      trackingName: 'header_right_nav_dropdown_campus_basic_click',
                      trackingData: {},
                    })}
                    key="coursera-for-campus-basic"
                    htmlAttributes={{
                      'data-e2e': `item-coursera-for-campus-basic`,
                    }}
                  >
                    <a
                      href={this._generateUTM(
                        'https://www.coursera.org/campus/basic',
                        'header-for-c4cb',
                        'corp-to-landing-for-universities',
                        'website',
                        'header-for-universities-link',
                        'university-staff'
                      )}
                      onClick={preventDefault}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {_t('University Staff')}
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
  })
)(UniversityLinkDropdown);
