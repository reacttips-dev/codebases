import { SubmissionSchema, Submission } from 'bundles/peer/types/Submission';

import { getBlankSubmissionPart } from 'bundles/assess-common/utils/defaultSubmissionParts';

import _ from 'underscore';

const initializeSubmissionFromSchema = (
  submissionSchema: SubmissionSchema,
  userId: number,
  defaultText?: string
): Submission => {
  const parts = _(submissionSchema.definition.parts)
    .chain()
    // @ts-expect-error UNDERSCORE-MIGRATION
    .map(({ typeName }, partId) => [partId, getBlankSubmissionPart(typeName, defaultText)])
    .object()
    .value();

  return {
    id: '',
    definition: {
      // @ts-expect-error TSMIGRATION
      parts,
      title: '',
    },
    typeName: submissionSchema.typeName,
    isSaved: false,
    isSubmitted: false,
    isDraft: true,
    isLate: false,
    creatorId: userId,
  };
};

export default initializeSubmissionFromSchema;
