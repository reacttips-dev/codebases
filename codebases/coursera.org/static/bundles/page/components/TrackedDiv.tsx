import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Retracked from 'js/app/retracked';
import a11yKeyPress from 'js/lib/a11yKeyPress';

type Data = {};

type Props = {
  // when this div is clicked, it will fire an event key made of
  // {group}.{page}.click.{trackingName} (this sets the last part)
  trackingName: string;
  className?: string;
  data?: Data;
  onClick?: (event: $TSFixMe) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<EventTarget>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement> | React.FormEvent<EventTarget>) => void;
  children?: React.ReactNode;
  role?: string;
  style?: React.CSSProperties;
  tabIndex?: number;
  trackMouseOver?: boolean;
  withVisibilityTracking?: boolean;
  requireFullyVisible?: boolean;
  trackClicks?: boolean;
  atMostOnce?: boolean;
  trackingData?: Data;
  trackMouseEnters?: boolean; // EXPERIMENTAL FEATURE
  trackMouseLeaves?: boolean; // EXPERIMENTAL FEATURE
};

// // NOTE: tracking mouse enter and leave events is currently *experimental*!
// // You should discuss with @zhaojun or @cliu before enabling these tracking events.
// interface TrackedDivProps extends Props {
//   withVisibilityTracking?: boolean,
//   requireFullyVisible?: boolean,
//   trackClicks?: boolean,
//   trackMouseEnters?: boolean, // EXPERIMENTAL FEATURE
//   trackMouseLeaves?: boolean, // EXPERIMENTAL FEATURE
// }

// Admittedly, the impl is quite similar with TrackedButton, however,
// I don't think this is a good time to be smart to abstract the impl to reduce the code yet.
class TrackedDivImpl extends React.Component<Props> {
  static contextTypes = {
    _eventData: PropTypes.object,
    _withTrackingData: PropTypes.func,
  };

  trackClick = (e: React.MouseEvent<HTMLElement>) => {
    const { _eventData, _withTrackingData } = this.context;
    if (this.props.trackClicks) {
      Retracked.trackComponent(_eventData, this.props.data, this.props.trackingName, 'click', _withTrackingData);
    }
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  };

  trackMouseEnter = (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<EventTarget>) => {
    const { _eventData, _withTrackingData } = this.context;
    if (this.props.trackMouseEnters) {
      Retracked.trackComponent(_eventData, this.props.data, this.props.trackingName, 'mouseenter', _withTrackingData);
    }
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(e);
    }
  };

  trackMouseLeave = (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<EventTarget>) => {
    const { _eventData, _withTrackingData } = this.context;
    if (this.props.trackMouseLeaves) {
      Retracked.trackComponent(_eventData, this.props.data, this.props.trackingName, 'mouseleave', _withTrackingData);
    }
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(e);
    }
  };

  trackKeyPress = (event: React.KeyboardEvent<HTMLElement>) => a11yKeyPress(event, this.trackClick);

  render() {
    const namespace = (this.context._eventData && this.context._eventData.namespace) || {};
    const { app, page } = namespace;
    const action = 'click';
    const component = this.props.trackingName;

    const divProps = _.omit(
      this.props,
      'atMostOnce',
      'className',
      'data',
      'elementType',
      'onClick',
      'onMouseEnter',
      'onMouseLeave',
      'requireFullyVisible',
      'trackClicks',
      'trackMouseEnters',
      'trackMouseLeaves',
      'trackingName',
      'withVisibilityTracking'
    );

    return (
      /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-tabindex */
      // A role is being added which should fix these errors, but jsx-a11y currently doesn't support dynamic roles
      // https://github.com/evcohen/eslint-plugin-jsx-a11y/issues/292
      <div
        onClick={this.trackClick}
        // Note: onKeyPress from caller bypasses this entirely if provided.
        onKeyPress={this.trackKeyPress}
        onMouseEnter={this.trackMouseEnter}
        onMouseLeave={this.trackMouseLeave}
        data-track={true}
        data-track-app={app}
        data-track-page={page}
        data-track-action={action}
        data-track-component={component}
        className={this.props.className}
        role={this.props.role === 'button' || this.props.onClick ? 'button' : 'presentation'}
        // Note: tabIndex from caller bypasses this entirely if provided.
        tabIndex={this.props.onClick && 0}
        {...divProps}
      >
        {this.props.children}
      </div>
      /* eslint-enable */
    );
  }
}
const TrackedDivImplWithVisibility = Retracked.withVisibilityTracking(TrackedDivImpl);

class TrackedDiv extends React.Component<Props> {
  static defaultProps = {
    withVisibilityTracking: false,
    requireFullyVisible: true,
    trackClicks: true,
    trackMouseEnters: false,
    trackMouseLeaves: false,
  };

  render() {
    const TrackedDivComponent = this.props.withVisibilityTracking ? TrackedDivImplWithVisibility : TrackedDivImpl;
    return <TrackedDivComponent {...this.props} />;
  }
}

export default TrackedDiv;
