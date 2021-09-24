import gql from 'graphql-tag';
export const updateStageMutation = gql`
  mutation updateAdoptionStages($companyAdoptionStages: [AdoptionStageInput!]) {
    updateAdoptionStages(companyAdoptionStages: $companyAdoptionStages) {
      id
      name
    }
  }
`;

export const linkStageMutation = gql`
  mutation linkStageMutation(
    $companyAdoptionStages: [AdoptionStageInput!]
    $toolAdoptionStageLink: CurrentAdoptionStageInput
  ) {
    updateAdoptionStages(
      companyAdoptionStages: $companyAdoptionStages
      toolAdoptionStageLink: $toolAdoptionStageLink
    ) {
      id
      name
    }
  }
`;
