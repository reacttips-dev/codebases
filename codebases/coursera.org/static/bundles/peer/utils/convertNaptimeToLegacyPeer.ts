import _ from 'underscore';

import {
  MultipartSchemaPart as LegacySubmissionSchemaPart,
  SubmissionSchema as LegacySubmissionSchema,
} from 'bundles/peer/types/Submission';
import { SubmissionPartSchema, SubmissionSchema } from 'bundles/assess-common/types/NaptimeSubmissionSchema';
import { ReviewSchema as LegacyReviewSchema } from 'bundles/peer/types/Reviews';
import { ReviewSchema, ReviewPartSchema } from 'bundles/assess-common/types/NaptimeReviewSchema';

export const convertSubmissionSchemaPart = (part: SubmissionPartSchema, index: number): LegacySubmissionSchemaPart => {
  return {
    // @ts-expect-error TSMIGRATION
    typeName: part.details.typeName,
    order: index,
    definition: Object.assign({}, part.details.definition, {
      prompt: part.prompt,
    }),
    ...('plagiarismConfig' in part ? { plagiarismConfig: part.plagiarismConfig } : {}),
  };
};

export const naptimeReviewSchemaToLegacy = (schema: ReviewSchema): LegacyReviewSchema => {
  return {
    typeName: 'structured',
    definition: {
      // @ts-expect-error UNDERSCORE-MIGRATION
      parts: _.object(
        schema.parts.map((part) => part.id),
        schema.parts.map((part: ReviewPartSchema, index) => {
          let extraDefintion = {};
          if (part.details.typeName === 'yesNo') {
            // @ts-expect-error TSMIGRATION
            extraDefintion.points = part.details.definition.points;
          } else if (part.details.typeName === 'options') {
            const { options } = part.details.definition;
            extraDefintion = {
              isScored: part.details.definition.isScored,
              options: _.object(
                options.map((option) => option.id),
                options.map((option, optionIndex) => ({
                  points: option.points,
                  display: option.display,
                  order: optionIndex,
                }))
              ),
            };
          } else if (part.details.typeName === 'multiLineInput' && part.details.definition.points != null) {
            extraDefintion = {
              points: part.details.definition.points,
            };
          }

          const legacyReviewPart = {
            typeName: part.details.typeName,
            order: index,
            submissionSchemaPartId: part.submissionPartId,
            definition: {
              prompt: part.prompt,
              ...extraDefintion,
            },
          };

          if (!legacyReviewPart.submissionSchemaPartId) {
            delete legacyReviewPart.submissionSchemaPartId;
          }

          return legacyReviewPart;
        })
      ),
    },
  };
};

export const naptimeSubmissionSchemaToLegacy = (
  schema: SubmissionSchema,
  versionNumber: number
): LegacySubmissionSchema => {
  return {
    typeName: 'multipart',
    definition: {
      // @ts-expect-error UNDERSCORE-MIGRATION
      parts: _.object(
        schema.parts.map((part) => part.id),
        schema.parts.map(convertSubmissionSchemaPart)
      ),
    },
    assignmentVersion: versionNumber,
  };
};
