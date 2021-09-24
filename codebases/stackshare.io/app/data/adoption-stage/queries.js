import gql from 'graphql-tag';

export const adoptionStagesQuery = gql`
  query adoptionStages {
    currentPrivateCompany {
      adoptionStages {
        id
        name
      }
      id
    }
  }
`;

export const toolAdoptionStageQuery = gql`
  query tool($id: ID!) {
    tool(id: $id) {
      adoptionStage {
        id
        name
      }
      id
    }
  }
`;
