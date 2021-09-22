/**
 * withAliceNotification
 *
 * Use withAliceNotification to trigger a message from the alice system.
 *
 * Example usage:
 *
 * class Component extends React.Component {
 *   ...
 * }
 *
 * withAliceNotification((props) => {
 *   // use props to determine event triggering
 *
 *   return new AliceEvent({courseBranchId});
 * })(Component)
 */
import React from 'react';
import PropTypes from 'prop-types';
import user from 'js/lib/user';
import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';

import epic from 'bundles/epic/client';

import AliceEvent from 'bundles/alice/models/AliceEvent';
import { clearAliceNotification, publishAliceNotification } from 'bundles/alice/actions/AliceActions';

export default function withAliceNotification<Props extends {} = {}>(
  eventFn: (props: Props) => AliceEvent,
  epicTagsFn: (props: Props) => { course_id?: string; specialization_id?: string } = () => ({})
): (component: React.ComponentType<Props>) => React.ComponentClass<Props> {
  return function (Component: React.ComponentType<Props>): React.ComponentClass<Props> {
    const componentName = Component.displayName || Component.name;

    class WithAliceNotificationWrapper extends React.Component<Props, { enabled: boolean }> {
      static defaultProps: {};

      static displayName = componentName + 'WithAliceNotificationConnector';

      static contextTypes = {
        executeAction: PropTypes.func,
      };

      constructor(props: Props, context: any) {
        super(props, context);

        const enabled = epic.get('alice', 'aliceEnabled', epicTagsFn(props)) || user.isSuperuser();
        this.state = { enabled };
      }

      componentDidMount() {
        const { enabled } = this.state;
        if (enabled) {
          this.publish();
        }
      }

      componentDidUpdate() {
        const { enabled } = this.state;
        if (enabled) {
          this.publish();
        }
      }

      componentWillUnmount() {
        const { enabled } = this.state;
        const { executeAction } = this.context;
        if (enabled) {
          executeAction(clearAliceNotification);
        }
      }

      publish = () => {
        const event = eventFn(this.props);
        const { executeAction } = this.context;

        if (event) {
          executeAction(publishAliceNotification, { event });
        } else {
          executeAction(clearAliceNotification);
        }
      };

      render() {
        return React.createElement(Component, Object.assign({}, this.props));
      }
    }

    hoistNonReactStatics(WithAliceNotificationWrapper, Component);
    return WithAliceNotificationWrapper;
  };
}
