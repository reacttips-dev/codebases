import { ApolloConsumer } from 'react-apollo';
import React from 'react';
import PropTypes from 'prop-types';
import { VoteControllerProps } from './__types__';
import likeQuery from './queries/like';
import unlikeQuery from './queries/unlike';

class VoteDataProvider extends React.Component<VoteControllerProps> {
  constructor(props: VoteControllerProps) {
    super(props);
    this.like.bind(this);
    this.unlike.bind(this);
  }

  static childContextTypes = {
    like: PropTypes.func,
    unlike: PropTypes.func,
  };

  getChildContext() {
    return {
      like: this.like.bind(this),
      unlike: this.unlike.bind(this),
    };
  }

  like() {
    return this.props.client.mutate({
      mutation: likeQuery,
      variables: { id: this.props.forumQuestionId, body: 'null' },
    });
  }

  unlike() {
    return this.props.client.mutate({
      mutation: unlikeQuery,
      variables: { id: this.props.forumQuestionId, body: 'null' },
    });
  }

  render() {
    return <span>{this.props.children}</span>;
  }
}

export const VoteDataProviderWithApollo = ({
  children,
  forumQuestionId,
}: {
  children: JSX.Element | JSX.Element[];
  forumQuestionId: string;
}) => {
  return (
    <ApolloConsumer>
      {(client) => (
        <VoteDataProvider forumQuestionId={forumQuestionId} client={client}>
          {children}
        </VoteDataProvider>
      )}
    </ApolloConsumer>
  );
};

export default VoteDataProviderWithApollo;
