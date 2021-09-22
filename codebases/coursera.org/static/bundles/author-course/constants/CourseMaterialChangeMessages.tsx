import React from 'react';
import _t from 'i18n!nls/author-course';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import PartnerHelpLink from 'bundles/authoring/common/components/PartnerHelpLink';
import {
  LEARNING_OBJECTIVE_TO_ITEM,
  LEARNING_OBJECTIVE_TO_MODULE,
  LEARNING_OBJECTIVE_SLIDE_OUT_TYPES,
} from 'bundles/author-learning-objectives/constants';
import type {
  LearningObjectiveToItem,
  LearningObjectiveToModule,
} from 'bundles/author-learning-objectives/components/api/WithLearningObjectivesMutations';

type actionObjectType = { modulesCount: number; itemsCount: number; learningObjectiveCount: number } | undefined;
type actionItemType =
  | typeof LEARNING_OBJECTIVE_SLIDE_OUT_TYPES.learningObjective
  | typeof LEARNING_OBJECTIVE_SLIDE_OUT_TYPES.module
  | typeof LEARNING_OBJECTIVE_SLIDE_OUT_TYPES.item;

function getLearningObjectiveActionObject(
  edges: Array<LearningObjectiveToModule | LearningObjectiveToItem>,
  actionItemType: actionItemType
): actionObjectType {
  let actionObject = { modulesCount: 0, itemsCount: 0, learningObjectiveCount: 0 };
  if (!edges.length) {
    return undefined;
  }

  actionObject = edges.reduce((actionObjectAccu, edge) => {
    const newActionObjectAccu = { ...actionObjectAccu };
    if (actionItemType === LEARNING_OBJECTIVE_SLIDE_OUT_TYPES.learningObjective) {
      newActionObjectAccu.modulesCount += edge?.typeName === LEARNING_OBJECTIVE_TO_MODULE ? 1 : 0;
      newActionObjectAccu.itemsCount += edge?.typeName === LEARNING_OBJECTIVE_TO_ITEM ? 1 : 0;
    } else {
      newActionObjectAccu.learningObjectiveCount += 1;
    }
    return newActionObjectAccu;
  }, actionObject);

  return actionObject;
}

function getMessageForLearningObjectiveAction(
  actionItemType: actionItemType,
  action: string,
  actionObject: actionObjectType
): React.ReactNode {
  if (actionObject !== undefined && actionItemType) {
    switch (actionItemType) {
      case LEARNING_OBJECTIVE_SLIDE_OUT_TYPES.item:
      case LEARNING_OBJECTIVE_SLIDE_OUT_TYPES.module: {
        return (
          <FormattedMessage
            message={_t(
              '{learningObjectiveCount} Learning {learningObjectiveCount, plural, =1 {Objective} other {Objectives}} {actionType} {itemType}'
            )}
            learningObjectiveCount={actionObject.learningObjectiveCount}
            itemType={actionItemType === LEARNING_OBJECTIVE_SLIDE_OUT_TYPES.module ? 'Module' : 'Item'}
            actionType={action === 'assigned' ? 'assigned to' : 'unassigned from'}
          />
        );
      }
      case LEARNING_OBJECTIVE_SLIDE_OUT_TYPES.learningObjective: {
        if (actionObject.modulesCount && actionObject.itemsCount) {
          return (
            <FormattedMessage
              message={_t(
                'Learning Objective {actionType} {modulesCount} {modulesCount, plural, =1 {Module} other {Modules}} and {itemsCount} {itemsCount, plural, =1 {Item} other {Items}}'
              )}
              modulesCount={actionObject.modulesCount}
              itemsCount={actionObject.itemsCount}
              actionType={action === 'assigned' ? 'assigned to' : 'unassigned from'}
            />
          );
        } else if (actionObject.modulesCount) {
          return (
            <FormattedMessage
              message={_t(
                'Learning Objective {actionType} {modulesCount} {modulesCount, plural, =1 {Module} other {Modules}}'
              )}
              modulesCount={actionObject.modulesCount}
              actionType={action === 'assigned' ? 'assigned to' : 'unassigned from'}
            />
          );
        } else if (actionObject.itemsCount) {
          return (
            <FormattedMessage
              message={_t('Learning Objective {actionType} {itemsCount} {itemsCount, plural, =1 {Item} other {Items}}')}
              itemsCount={actionObject.itemsCount}
              actionType={action === 'assigned' ? 'assigned to' : 'unassigned from'}
            />
          );
        }
        return null;
      }
      default: {
        return null;
      }
    }
  }

  return null;
}

function getCourseMaterialChangeMessages() {
  return {
    Module: {
      Add: (
        <FormattedMessage
          message={_t(
            `Module added successfully. Adding modules also resets the module to week mapping,
            so please make updates to the {courseScheduleLink} as needed.`
          )}
          courseScheduleLink={<PartnerHelpLink articleId="115000173323" linkText={_t('Content Schedule')} />}
        />
      ),
      Delete: _t('Module deleted successfully.'),
      Move: (
        <FormattedMessage
          message={_t(
            `Module moved successfully. Moving modules also resets the module to week mapping,
            so please make updates to the {courseScheduleLink} as needed.`
          )}
          courseScheduleLink={<PartnerHelpLink articleId="115000173323" linkText={_t('Content Schedule')} />}
        />
      ),
      ChangeName: _t('Module title changed successfully.'),
      ChangeDescription: _t('Module description changed successfully.'),
    },

    Lesson: {
      Add: _t('Lesson added successfully.'),
      Delete: _t('Lesson deleted successfully.'),
      Move: _t('Lesson moved successfully.'),
      ChangeName: _t('Lesson title changed successfully.'),
    },

    Item: {
      Add: _t('Item added successfully.'),
      Delete: _t('Item deleted successfully.'),
      EditName: _t('Item title edited successfully.'),
      Move: _t('Item moved successfully.'),
      LockItem: _t('Item locked successfully.'),
      UnlockItem: _t('Item unlocked successfully.'),
      LockSettingsApplied: _t('Lock settings applied.'),
    },

    LearningObjectives: {
      changeLearningObjectiveEdges: (
        edgesToAdd: Array<LearningObjectiveToModule | LearningObjectiveToItem>,
        edgesToRemove: Array<LearningObjectiveToModule | LearningObjectiveToItem>,
        actionItemType: actionItemType
      ) => {
        const addingActionObject = getLearningObjectiveActionObject(edgesToAdd, actionItemType);
        const AssignedMessage = getMessageForLearningObjectiveAction(actionItemType, 'assigned', addingActionObject);
        const removingActionObject = getLearningObjectiveActionObject(edgesToRemove, actionItemType);
        const UnAssignedMessage = getMessageForLearningObjectiveAction(
          actionItemType,
          'unassigned',
          removingActionObject
        );
        return (
          <div>
            {AssignedMessage}
            {/* If there is just one sentence, we don't need a period(.),
             but if there are two, we need a period(.) after each sentence */}
            {AssignedMessage && UnAssignedMessage && `. `}
            {UnAssignedMessage}
            {AssignedMessage && UnAssignedMessage && `.`}
          </div>
        );
      },
      addLearningObjectives: (learningObjectivesCount: $TSFixMe) => {
        if (learningObjectivesCount === 1) {
          return _t('New Learning Objective added');
        }
        return _t('#{learningObjectivesCount} new Learning Objectives added', {
          learningObjectivesCount,
        });
      },
      updateLearningObjective: _t('Learning Objective updated successfully'),
      deleteLearningObjectives: (learningObjectivesCount: $TSFixMe) => {
        if (learningObjectivesCount === 1) {
          return _t('Learning objective deleted successfully.');
        }
        return _t('Learning objectives deleted successfully.');
      },
      Move: _t('Learning Objective moved successfully.'),
    },
  };
}

function getCourseMaterialImportMessage() {
  return {
    ulba: {
      success: _t('Content imported.'),
    },
  };
}

function invalidItemPositionMessage() {
  return _t('Oops, someone else might have already moved this item, please refresh the page.');
}

function invalidLessonPositionMessage() {
  return _t('Oops, someone else might have already moved this lesson, please refresh the page.');
}

function invalidModulePositionMessage() {
  return _t('Oops, someone else might have already moved this module, please refresh the page.');
}

function conflictMessage() {
  return _t(`Oops! Someone else is editing this page at the same time. Only one person 
    can make changes at a time. To continue making changes, refresh this page. Any changes you made since 
    you last saved will be lost.`);
}

function defaultErrorMessage() {
  return _t(`Oops! Due to errors we couldn't save your last change. To continue making 
    changes, please refresh this page.`);
}

export default getCourseMaterialChangeMessages;

export {
  getCourseMaterialChangeMessages,
  invalidItemPositionMessage,
  invalidLessonPositionMessage,
  invalidModulePositionMessage,
  defaultErrorMessage,
  conflictMessage,
  getCourseMaterialImportMessage,
};
