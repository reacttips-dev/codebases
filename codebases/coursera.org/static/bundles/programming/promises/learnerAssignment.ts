/**
 * Gets the LearnerAssignment resource from the server, instantiates all the objects that it represents, and returns
 * those objects. The returned objects are
 * {
 *   submissionLearnerSchema: MultipartSubmissionLearnerSchema,
 *   versionId: Opaque Version Id
 * }
 */

import _ from 'underscore';

import { CmlContent } from 'bundles/cml/types/Content';
import learnerAssignmentDataPromiseFactory from 'bundles/programming/data/learnerAssignment';
import FilesSubmissionBuilderSchema from 'bundles/programming/models/filesSubmissionBuilderSchema';
import Instructions from 'bundles/programming/models/instructions';
import MultipartSubmissionLearnerSchema from 'bundles/programming/models/multipartSubmissionLearnerSchema';
import ScriptSubmissionBuilderSchema from 'bundles/programming/models/scriptSubmissionBuilderSchema';
import WorkspaceSubmissionBuilderSchema from 'bundles/programming/models/workspaceSubmissionBuilderSchema';

// Backbone models
export type SubmissionBuilderSchemaModel =
  | typeof FilesSubmissionBuilderSchema
  | typeof ScriptSubmissionBuilderSchema
  | typeof WorkspaceSubmissionBuilderSchema;

export type SubmissionLearnerSchemaModel = typeof MultipartSubmissionLearnerSchema;

// Response before switching schemas to models
export type LearnerAssignmentData = {
  courseId: string;
  id: string;
  itemId: string;
  maxScore: number;
  passingFraction: number;
  passingScore: number;
  submissionBuilderSchema: {
    // TODO: This might be consolidated somewhere else
    typeName: 'files' | 'script' | 'workspace';
    definition: {
      suggestedFilenames: {
        [partId: string]: string;
      };
    };
  };
  submissionLearnerSchema: {
    // TODO: This might be consolidated somewhere else
    typeName: 'multipart';
    definition: {
      assignmentInstructions: CmlContent;
      parts: {
        [partId: string]: {
          maxScore: number;
          order: number;
          title: string;
        };
      };
    };
  }; // TODO: Not Backbone
  versionId: string;
};

// Type for promise factory below - converts the two schemas into Backbone models with make*
export type LearnerAssignment = {
  maxScore: number;
  passingFraction: number;
  passingScore: number;
  submissionBuilderSchema: SubmissionBuilderSchemaModel;
  submissionLearnerSchema: SubmissionLearnerSchemaModel;
  versionId: string;
};

function makeSubmissionLearnerSchema(
  learnerAssignmentData: LearnerAssignmentData
): SubmissionLearnerSchemaModel | null {
  const submissionLearnerSchemaData = learnerAssignmentData.submissionLearnerSchema;

  if (submissionLearnerSchemaData.typeName === 'multipart') {
    const { definition } = submissionLearnerSchemaData;

    return new MultipartSubmissionLearnerSchema({
      instructions: new Instructions(_(definition).pick('assignmentInstructions')),
      parts: definition.parts,
    });
  } else {
    throw new Error('Cannot construct ' + submissionLearnerSchemaData.typeName + ' SubmissionLearnerSchema.');
  }
}

function makeSubmissionBuilderSchema(
  learnerAssignmentData: LearnerAssignmentData
): SubmissionBuilderSchemaModel | null {
  const submissionBuilderSchemaData = learnerAssignmentData.submissionBuilderSchema;
  const { definition } = submissionBuilderSchemaData;

  if (submissionBuilderSchemaData.typeName === 'files') {
    return new FilesSubmissionBuilderSchema({
      suggestedFilenames: definition.suggestedFilenames,
    });
  } else if (submissionBuilderSchemaData.typeName === 'script') {
    return new ScriptSubmissionBuilderSchema();
  } else if (submissionBuilderSchemaData.typeName === 'workspace') {
    return new WorkspaceSubmissionBuilderSchema();
  } else {
    throw new Error('Cannot construct ' + submissionBuilderSchemaData.typeName + ' SubmissionBuilderSchema.');
  }
}

function learnerAssignment({
  itemId,
  courseId,
  courseSlug,
}: {
  itemId: string;
  courseId: string;
  courseSlug: string;
}): Q.Promise<LearnerAssignment> {
  return learnerAssignmentDataPromiseFactory({ itemId, courseId, courseSlug }).then(
    (learnerAssignmentData: LearnerAssignmentData) => {
      return {
        maxScore: learnerAssignmentData.maxScore,
        passingFraction: learnerAssignmentData.passingFraction,
        passingScore: learnerAssignmentData.passingScore,
        submissionBuilderSchema: makeSubmissionBuilderSchema(learnerAssignmentData),
        submissionLearnerSchema: makeSubmissionLearnerSchema(learnerAssignmentData),
        versionId: learnerAssignmentData.versionId,
      };
    }
  );
}

export default learnerAssignment;
