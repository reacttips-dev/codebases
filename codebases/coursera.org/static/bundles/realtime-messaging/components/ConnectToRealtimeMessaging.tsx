// Connects to the realtime messaging server by creating an instance of bundles/realtime-messaging/models/RealtimeMessaging.js
// Wrap your application with a single instance of this component to enable a realtime connection for the app
//
// <ConnectToRealtimeMessaging>
//   <AppUI />
// </ConnectToRealtimeMessaging>
import React from 'react';
import ApolloClient from 'apollo-client';
import PropTypes from 'prop-types';

import { compose } from 'recompose';
import { Query, graphql } from 'react-apollo';

import LocalRealtimeMessageStateConsumer from 'bundles/realtime-messaging/components/LocalRealtimeMessageStateConsumer';

import { FormattedRealtimeMessage, UnformattedRealtimeMessage } from 'bundles/realtime-messaging/types';

import {
  LocalRealtimeMessageChannelQuery,
  AddLocalRealtimeMessageMutation,
  RemoveLocalRealtimeMessageMutation,
} from 'bundles/realtime-messaging/graphql';

import RealtimeMessagingManager from 'bundles/realtime-messaging/RealtimeMessagingManager';

type InputProps = {
  channelName: string;
  children: (arg: {
    channelSubscriptionComplete: boolean;
    messages: FormattedRealtimeMessage[];
    removeMessage: (message: FormattedRealtimeMessage) => void;
    resetChannelSubscriptions: () => void;
  }) => React.ReactNode;
};

type Props = InputProps & {
  client: ApolloClient<{}>;
  // @ts-ignore ts-migrate(7031) FIXME: Binding element 'any' implicitly has an 'any' type... Remove this comment to see the full error message
  addLocalRealtimeMessage: ({ variables: { message: any } }) => Promise<UnformattedRealtimeMessage>;
  // @ts-ignore ts-migrate(7031) FIXME: Binding element 'any' implicitly has an 'any' type... Remove this comment to see the full error message
  removeLocalRealtimeMessage: ({ variables: { message: any } }) => Promise<UnformattedRealtimeMessage>;
};

type State = {
  channelSubscriptionComplete: boolean;
  componentDidMount: boolean;
};

class ConnectToRealtimeMessaging extends React.Component<Props, State> {
  static contextTypes = {
    realtimeMessaging: PropTypes.instanceOf(RealtimeMessagingManager),
  };

  constructor(props: $TSFixMe, context: $TSFixMe) {
    super(props, context);

    const { realtimeMessaging } = context;

    this.state = {
      channelSubscriptionComplete: realtimeMessaging.isConnected,
      componentDidMount: false,
    };
  }

  componentDidMount() {
    const { realtimeMessaging } = this.context;
    const { addLocalRealtimeMessage, channelName } = this.props;

    this.setState({
      componentDidMount: true,
    });

    realtimeMessaging
      .init()
      .then(() =>
        realtimeMessaging.subscribeToChannel(channelName, (message: $TSFixMe) => {
          addLocalRealtimeMessage({
            variables: { message },
          });
        })
      )
      .then(() => {
        // Don't mark connection as complete until
        // we are both connected + subscribed
        this.setState({
          channelSubscriptionComplete: true,
        });
      });
  }

  renderChildren(data?: { localRealtimeMessageChannel: { messages: FormattedRealtimeMessage[] } }) {
    const { realtimeMessaging } = this.context;
    const { children, removeLocalRealtimeMessage } = this.props;
    const { channelSubscriptionComplete, componentDidMount } = this.state;

    return children({
      channelSubscriptionComplete: componentDidMount && channelSubscriptionComplete,
      messages: data?.localRealtimeMessageChannel?.messages ?? [],
      removeMessage: (message) => componentDidMount && removeLocalRealtimeMessage({ variables: { message } }),
      resetChannelSubscriptions: () => componentDidMount && realtimeMessaging.resetSubscriptionChannels(),
    });
  }

  render() {
    const { channelName } = this.props;
    const { componentDidMount } = this.state;

    if (!componentDidMount) {
      return this.renderChildren();
    }

    return (
      <LocalRealtimeMessageStateConsumer>
        <Query query={LocalRealtimeMessageChannelQuery} variables={{ channelName }}>
          {({ data }: $TSFixMe) => this.renderChildren(data)}
        </Query>
      </LocalRealtimeMessageStateConsumer>
    );
  }
}

export default compose<Props, InputProps>(
  graphql(AddLocalRealtimeMessageMutation, { name: 'addLocalRealtimeMessage' }),
  graphql(RemoveLocalRealtimeMessageMutation, { name: 'removeLocalRealtimeMessage' })
)(ConnectToRealtimeMessaging);
