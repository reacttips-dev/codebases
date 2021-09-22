import PropTypes from 'prop-types';
import React from 'react';

import _ from 'lodash';
import Retracked from 'js/app/retracked';
import { TrackingData } from 'js/lib/retracked';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  // when this button is clicked, it will fire an event key made of
  // {group}.{page}.click.{trackingName} (this sets the last part)
  trackingName?: string;
  data?: TrackingData;
  onSetRef?: (x0: HTMLButtonElement | null) => void;
  'data-e2e'?: string;
  withVisibilityTracking?: boolean;
  requireFullyVisible?: boolean;
  dataE2e?: string;
};

class TrackedButtonImpl extends React.Component<Props> {
  static contextTypes = {
    _eventData: PropTypes.object,
    _withTrackingData: PropTypes.func,
  };

  static defaultProps = {
    disabled: false,
    type: 'button' as const,
  };

  trackClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const { data, trackingName, onClick } = this.props;
    const { _eventData, _withTrackingData } = this.context;

    Retracked.trackComponent(_eventData, data, trackingName, 'click', _withTrackingData);

    if (onClick) {
      onClick(e);
    }
  };

  render() {
    const { trackingName, onSetRef, children } = this.props;
    const { _eventData } = this.context;
    const { app, page } = (_eventData && _eventData.namespace) || {};
    const action = 'click';
    const component = trackingName;
    const buttonProps: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'> = _.omit(
      this.props,
      'trackingName',
      'data',
      'onClick',
      'data-e2e',
      'children',
      'withVisibilityTracking',
      'requireFullyVisible',
      'trackClicks',
      'onSetRef',
      'dataE2e'
    );

    return (
      // eslint can't parse type being passed into a button as a prop https://github.com/yannickcr/eslint-plugin-react/issues/1846
      // Note that in this case, `type` will be part of `buttonProps`.
      // eslint-disable-next-line react/button-has-type
      <button
        onClick={this.trackClick}
        data-track={true}
        data-track-app={app}
        data-track-page={page}
        data-track-action={action}
        data-track-component={component}
        data-e2e={this.props['data-e2e'] ?? this.props.dataE2e}
        ref={(buttonRef) => {
          if (onSetRef) {
            onSetRef(buttonRef);
          }
        }}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
}

const TrackedButtonImplWithVisibility = Retracked.withVisibilityTracking(TrackedButtonImpl);

export type TrackedButtonProps = Props & {
  withVisibilityTracking: boolean;
  requireFullyVisible: boolean;
};

class TrackedButton extends React.Component<TrackedButtonProps> {
  static defaultProps = {
    withVisibilityTracking: false,
    requireFullyVisible: true,
  };

  render() {
    const { withVisibilityTracking } = this.props;
    const TrackedButtonComponent = withVisibilityTracking ? TrackedButtonImplWithVisibility : TrackedButtonImpl;
    return <TrackedButtonComponent {...this.props} />;
  }
}

export default TrackedButton;
