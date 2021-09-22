import { ReviewSchema, ReviewDefinition } from 'bundles/peer/types/Reviews';

import _ from 'underscore';

const getBlankReviewPartDefinition = (typeName: string) => {
  switch (typeName) {
    case 'singleLineInput':
      return {
        input: '',
      };

    case 'options':
      return {
        choice: null,
      };

    case 'multiLineInput':
      return {
        input: '',
      };

    case 'yesNo':
      return {
        choice: null,
      };

    default:
      throw new Error(`Unknown review part type ${typeName}.`);
  }
};

const initializeReviewFromSchema = (reviewSchema: ReviewSchema): ReviewDefinition => {
  const parts = _(reviewSchema.definition.parts)
    .chain()
    .map(({ typeName }, partId) => [
      partId,
      {
        definition: getBlankReviewPartDefinition(typeName),
        typeName,
      },
    ])
    .object()
    .value();

  return {
    // @ts-expect-error TSMIGRATION
    parts,
  };
};

export default initializeReviewFromSchema;
