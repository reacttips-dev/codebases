import gql from 'graphql-tag';

export const createPrivateStackshareLead = gql`
  mutation createPrivateStackshareLead(
    $firstName: String
    $lastName: String
    $position: String
    $email: String!
    $companyName: String!
    $companyUrl: String
    $location: String
    $numberOfEngineers: String
    $repositoryHosts: String
    $helpMessage: String
  ) {
    createPrivateStackshareLead(
      firstName: $firstName
      lastName: $lastName
      position: $position
      email: $email
      companyName: $companyName
      companyUrl: $companyUrl
      location: $location
      numberOfEngineers: $numberOfEngineers
      repositoryHosts: $repositoryHosts
      helpMessage: $helpMessage
    )
  }
`;
