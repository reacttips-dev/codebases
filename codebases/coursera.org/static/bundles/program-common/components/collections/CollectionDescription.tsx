import React from 'react';
import gql from 'graphql-tag';
import withFragments from 'bundles/graphql/components/withFragments';
import CML from 'bundles/cml/components/CML';
import CMLUtils from 'bundles/cml/utils/CMLUtils';

export type Description = {
  cml?: {
    value: string;
    dtdId: string;
  };
};

type Props = {
  collection: {
    description: Description;
  };
};

export function CollectionDescription({ collection: { description } }: Props) {
  if (description?.cml) {
    return <CML className="max-text-width" cml={CMLUtils.create(description.cml.value, description.cml.dtdId)} />;
  }
  return null;
}

export const CollectionDescriptionFragment = gql`
  fragment CollectionDescriptionFragment on ProgramCurriculumCollectionsV1 {
    description {
      ... on ProgramCurriculumCollectionsV1_cmlMember {
        cml {
          value
          dtdId
        }
      }
    }
  }
`;

export default withFragments({
  collection: CollectionDescriptionFragment,
})(CollectionDescription);
