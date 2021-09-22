import gql from 'graphql-tag';

/* eslint-disable graphql/template-strings */
const LocalRealtimeMessageFragment = gql`
  fragment LocalRealtimeMessageFragment on LocalRealtimeMessage {
    id
    messageType
    messageBody
    channelName
  }
`;

export const LocalRealtimeMessageChannelFragment = gql`
  fragment LocalRealtimeMessageChannelFragment on LocalRealtimeMessageChannel {
    id
    messages {
      ...LocalRealtimeMessageFragment
    }
  }
  ${LocalRealtimeMessageFragment}
`;

export const LocalRealtimeMessageChannelQuery = gql`
  query LocalRealtimeMessageChannelQuery($channelName: String!) {
    localRealtimeMessageChannel(channelName: $channelName) @client {
      ...LocalRealtimeMessageChannelFragment
    }
  }
  ${LocalRealtimeMessageChannelFragment}
`;

export const RemoveLocalRealtimeMessageMutation = gql`
  mutation RemoveLocalRealtimeMessageMutation($message: LocalRealtimeMessage!) {
    removeLocalRealtimeMessage(message: $message) @client
  }
  ${LocalRealtimeMessageChannelFragment}
`;

export const AddLocalRealtimeMessageMutation = gql`
  mutation AddLocalRealtimeMessageMutation($message: LocalRealtimeMessage!) {
    addLocalRealtimeMessage(message: $message) @client
  }
  ${LocalRealtimeMessageChannelFragment}
`;
/* eslint-enable graphql/template-strings */

export const resolvers = {
  Query: {
    localRealtimeMessageChannel(_: $TSFixMe, { channelName }: $TSFixMe, { cache, getCacheKey }: $TSFixMe) {
      const cacheKey = getCacheKey({
        id: channelName,
        __typename: 'LocalRealtimeMessageChannel',
      });

      const data = cache.readFragment({
        id: cacheKey,
        fragment: LocalRealtimeMessageChannelFragment,
        fragmentName: 'LocalRealtimeMessageChannelFragment',
      });

      return (
        data || {
          id: channelName,
          messages: [],
          __typename: 'LocalRealtimeMessageChannel',
        }
      );
    },
  },
  Mutation: {
    addLocalRealtimeMessage: (_: $TSFixMe, { message }: $TSFixMe, { cache, getCacheKey }: $TSFixMe) => {
      const cacheKey = getCacheKey({
        id: message.channelName,
        __typename: 'LocalRealtimeMessageChannel',
      });

      const previous = cache.readFragment({
        id: cacheKey,
        fragment: LocalRealtimeMessageChannelFragment,
        fragmentName: 'LocalRealtimeMessageChannelFragment',
      });

      const newMessage = {
        ...previous,
        messages: [
          ...(previous?.messages ?? []),
          {
            ...message,
            __typename: 'LocalRealtimeMessage',
          },
        ],
        __typename: 'LocalRealtimeMessageChannel',
      };

      cache.writeFragment({
        id: cacheKey,
        fragment: LocalRealtimeMessageChannelFragment,
        fragmentName: 'LocalRealtimeMessageChannelFragment',
        data: newMessage,
      });

      return newMessage;
    },
    removeLocalRealtimeMessage: (_: $TSFixMe, { message }: $TSFixMe, { cache, getCacheKey }: $TSFixMe) => {
      const cacheKey = getCacheKey({
        id: message.channelName,
        __typename: 'LocalRealtimeMessageChannel',
      });

      const previous = cache.readFragment({
        id: cacheKey,
        fragment: LocalRealtimeMessageChannelFragment,
        fragmentName: 'LocalRealtimeMessageChannelFragment',
      });

      cache.writeFragment({
        id: cacheKey,
        fragment: LocalRealtimeMessageChannelFragment,
        fragmentName: 'LocalRealtimeMessageChannelFragment',
        data: {
          ...previous,
          messages: previous?.messages?.filter((m: $TSFixMe) => m.id !== message.id) ?? [],
          __typename: 'LocalRealtimeMessageChannel',
        },
      });

      return message;
    },
  },
};
