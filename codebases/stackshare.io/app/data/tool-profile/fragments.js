import gql from 'graphql-tag';

export const reasonFields = gql`
  fragment reasonFields on Reason {
    id
    upvoted
    upvotesCount
    text
  }
`;
