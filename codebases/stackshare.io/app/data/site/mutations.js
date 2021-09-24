import gql from 'graphql-tag';

export const createPrivateStackEmail = gql`
  mutation createPrivateStackEmail($email: String!, $content: String!) {
    createPrivateStackEmail(email: $email, content: $content)
  }
`;

export const dismissSelfServeChecklist = gql`
  mutation dismissSelfServeChecklist {
    dismissSelfServeChecklist
  }
`;

export const acceptTermsOfService = gql`
  mutation acceptTermsOfService {
    acceptTermsOfService
  }
`;

export const skipForceVcsConnection = gql`
  mutation skipForceVcsConnection {
    skipForceVcsConnection
  }
`;
