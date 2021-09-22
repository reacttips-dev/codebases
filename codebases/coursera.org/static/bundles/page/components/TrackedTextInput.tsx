import PropTypes from 'prop-types';
import React from 'react';
import Retracked from 'js/app/retracked';
import classNames from 'classnames';
import 'css!bundles/page/components/__styles__/TrackedTextInput';

// Admittedly, the impl is quite similar with TrackedButton, however,
// I don't think this is a good time to be smart to abstract the impl to reduce the code yet.
class TrackedTextInput extends React.Component {
  static propTypes = {
    // when this div is clicked, it will fire an event key made of
    // {group}.{page}.click.{trackingName} (this sets the last part)
    trackingName: PropTypes.string.isRequired,
    className: PropTypes.string,
    data: PropTypes.object,
    onClick: PropTypes.func,
    onKeyPress: PropTypes.func,
    children: PropTypes.node,
  };

  static contextTypes = {
    _eventData: PropTypes.object,
    _withTrackingData: PropTypes.func,
  };

  trackClick = (e: $TSFixMe) => {
    const { _eventData, _withTrackingData } = this.context;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    Retracked.trackComponent(_eventData, this.props.data, this.props.trackingName, 'click', _withTrackingData);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onClick' does not exist on type 'Readonl... Remove this comment to see the full error message
    if (this.props.onClick) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onClick' does not exist on type 'Readonl... Remove this comment to see the full error message
      this.props.onClick(e);
    }
  };

  trackKeyPress = (e: $TSFixMe) => {
    const { _eventData, _withTrackingData } = this.context;
    if (e.key === 'Enter') {
      Retracked.trackComponent(
        _eventData,
        // also record the value in the input.
        {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Readonly<{... Remove this comment to see the full error message
          ...this.props.data,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'input' does not exist on type 'TrackedTe... Remove this comment to see the full error message
          inputValue: this.input.value,
          pressedKey: e.key,
        },
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'trackingName' does not exist on type 'Re... Remove this comment to see the full error message
        this.props.trackingName,
        'key_press',
        _withTrackingData
      );
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onKeyPress' does not exist on type 'Read... Remove this comment to see the full error message
    if (this.props.onKeyPress) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onKeyPress' does not exist on type 'Read... Remove this comment to see the full error message
      this.props.onKeyPress(e);
    }
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'trackingName' does not exist on type 'Re... Remove this comment to see the full error message
    const { trackingName, className, onKeyPress, ...props } = this.props;
    const namespace = (this.context._eventData && this.context._eventData.namespace) || {};
    const { app, page } = namespace;
    let action;
    const component = trackingName;

    // TODO(zhaojun): figure out how to use plugin to display a component contains multiple actions
    if (onKeyPress) {
      action = 'key_press';
    } else {
      action = 'click';
    }

    return (
      <input
        ref={(input) => {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'input' does not exist on type 'TrackedTe... Remove this comment to see the full error message
          this.input = input;
        }}
        onClick={this.trackClick}
        onKeyPress={this.trackKeyPress}
        data-track={true}
        data-track-app={app}
        data-track-page={page}
        data-track-action={action}
        data-track-component={component}
        className={classNames('rc-TrackedTextInput', className)}
        {...props}
      />
    );
  }
}

export default TrackedTextInput;
