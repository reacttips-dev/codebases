import PropTypes from 'prop-types';
import React from 'react';
import Retracked from 'js/app/retracked';
import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';
import { Button, SvgButton, ApiButton } from '@coursera/coursera-ui';

const CONFIG = {
  BUTTON: {
    action: 'click',
    eventName: 'onClick',
  },
  CHECKBOX: {
    action: 'change',
    eventName: 'onChange',
  },
  INPUT: {
    action: 'key_press',
    eventName: 'onKeyPress',
  },
} as const;

export type TrackingData = {
  [x: string]: number | string | boolean | undefined | null | TrackingData | TrackingData[];
};

export type TrackingProps = {
  trackingName: string;
  trackingData?: TrackingData;
  getTrackingDataFromChangeEvent?: (event: React.ChangeEvent<HTMLInputElement>) => TrackingData | undefined;
  // coursera-ui uses _refAlt to pass refs, but CDS uses forwardRef, which means we pass it normally.
  _refAltAsTrueRef?: React.Ref<HTMLElement>;
};

type EventsProps = {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLElement>) => void;
};

/**
 * Add tracking to basic Coursera-UI components and beyond
 * It's hard to manage and extend existing TrackedButton, TrackedDiv, etc.
 * With this HOC, we can add basic tracking to Button, Checkbox and more
 * It will also reduce the maintenance as we don't have different versions
 * of the tracked components
 *
 * Sample Usage:
 * import { Button } from 'coursera-ui'
 * const TrackedButton = withSingleTracked(Button);
 *
 * <TrackedButton
 *   trackingName="universal_enterprise_enroll_button"
 *   data={{programId: 'abc'}}
 *   type="primary"
 *   label={_t("Enroll")}
 * />
 */
// TODO(Audrey): For component that needs to track multiple events, use withMultipleTracked
function withSingleTracked({ type = 'BUTTON' }: { type: keyof typeof CONFIG }) {
  return <Props extends {}>(
    Component: React.ComponentType<Props>
  ): React.ComponentClass<Props & TrackingProps & Omit<EventsProps, keyof Props>> => {
    const componentName = Component.displayName || Component.name;

    class HOC extends React.Component<Props & TrackingProps & Omit<EventsProps, keyof Props>> {
      static displayName = `withSingleTracked(${componentName})`;

      static defaultProps = {
        trackingData: {},
      } as Partial<Props & TrackingProps & Omit<EventsProps, keyof Props>>;

      static contextTypes = {
        _eventData: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
        _withTrackingData: PropTypes.func,
      };

      handleEvent = (e: React.SyntheticEvent) => {
        const eventName = CONFIG[type].eventName;
        let trackingData: TrackingData | undefined = this.props.trackingData;

        // This happens before the caller can accept the change event, so let them track the change if they choose.
        // Useful for <select> and <input type="radio" /> elements.
        if (eventName === 'onChange' && this.props.getTrackingDataFromChangeEvent) {
          trackingData = {
            ...trackingData,
            ...this.props.getTrackingDataFromChangeEvent(e as React.ChangeEvent<HTMLInputElement>),
          };
        }

        Retracked.trackComponent(
          this.context._eventData,
          trackingData,
          this.props.trackingName,
          CONFIG[type].action,
          this.context._withTrackingData
        );

        // @ts-ignore TODO: refactor this to make it type-safe with noImplicitAny
        if (this.props[eventName]) {
          // @ts-ignore TODO: refactor this to make it type-safe with noImplicitAny
          this.props[eventName].call(null, e);
        }
      };

      render() {
        // Simply removing `trackingData` from `rest`, so it doesn't get added to the Component's props
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { trackingName, trackingData, _refAltAsTrueRef, ...rest } = this.props;
        const namespace = (this.context._eventData && this.context._eventData.namespace) || {};
        const { app, page } = namespace;
        const action = CONFIG[type];
        const eventObj: {
          onClick?: (e: React.MouseEvent<HTMLElement>) => void;
          onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
          onKeyPress?: (e: React.KeyboardEvent<HTMLElement>) => void;
        } = { [CONFIG[type].eventName]: this.handleEvent }; // e.g. {onClick: this.handleEvent}

        const UnknownComponent = Component as React.ComponentType<any>;
        return (
          <UnknownComponent
            ref={_refAltAsTrueRef}
            {...rest}
            data-track={true}
            data-track-app={app}
            data-track-page={page}
            data-track-action={action}
            data-track-component={trackingName}
            {...eventObj}
          />
        );
      }
    }

    hoistNonReactStatics(HOC, Component);
    return HOC;
  };
}

export default withSingleTracked;

export const TrackedButton = withSingleTracked({ type: 'BUTTON' })(Button);
export const TrackedSvgButton = withSingleTracked({ type: 'BUTTON' })(SvgButton);
export const TrackedApiButton = withSingleTracked({ type: 'BUTTON' })(ApiButton);
