import _ from 'underscore';

import {
  SubmissionSchema as LegacySubmissionSchema,
  Submission as LegacySubmission,
  MultipartSchemaPart as LegacySubmissionSchemaPart,
} from 'bundles/peer/types/Submission';

import { Submission } from 'bundles/assess-common/types/NaptimeSubmission';
import { SubmissionSchema, SubmissionPartSchema } from 'bundles/assess-common/types/NaptimeSubmissionSchema';

export const convertSubmission = (submission?: LegacySubmission): Submission | undefined => {
  if (!submission) {
    return undefined;
  }

  // @ts-expect-error TSMIGRATION
  return submission.definition;
};

export const convertSubmissionSchemaPart = (part: LegacySubmissionSchemaPart, partId: string): SubmissionPartSchema => {
  // @ts-expect-error TSMIGRATION
  return {
    id: partId,
    prompt: part.definition.prompt,
    details: {
      typeName: part.typeName,
      definition: _(part.definition).omit('prompt'),
    },
    ...('plagiarismConfig' in part ? { plagiarismConfig: part.plagiarismConfig } : {}),
  };
};

export const convertSubmissionSchema = (submissionSchema?: LegacySubmissionSchema): SubmissionSchema | undefined => {
  if (!submissionSchema) {
    return undefined;
  }

  const parts = _(submissionSchema.definition.parts)
    .chain()
    .map((submissionSchemaPart, partId) => ({ submissionSchemaPart, partId }))
    // @ts-expect-error UNDERSCORE-MIGRATION
    .sortBy(({ submissionSchemaPart }) => submissionSchemaPart.order)
    .map(
      // @ts-expect-error TSMIGRATION-3.9
      (part: { submissionSchemaPart: LegacySubmissionSchemaPart; partId: string }): SubmissionPartSchema => {
        return convertSubmissionSchemaPart(part.submissionSchemaPart, part.partId);
      }
    )
    .value();

  return {
    parts,
  };
};
