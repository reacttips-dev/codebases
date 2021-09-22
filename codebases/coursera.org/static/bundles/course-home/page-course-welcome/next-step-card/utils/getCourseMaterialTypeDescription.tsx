import React from 'react';
import moment from 'moment-timezone';

import { Item } from 'bundles/course-v2/types/Item';
import { CourseMaterialNextStepType } from 'bundles/course-home/page-course-welcome/next-step-card/types/NextStep';

import { getFormattedNameWithPrefix, getFormattedTimeCommitment } from 'bundles/course-v2/utils/Item';

import _t from 'i18n!nls/course-home';
import { FormattedMessage, FormattedHTMLMessage } from 'js/lib/coursera.react-intl';
import { ReplaceCustomContent } from 'bundles/custom-labels/types/CustomLabels';

type TypeDescription = {
  description: string | JSX.Element;
  overrideName: string | JSX.Element;
  overrideLabel: string;
  ariaLabel?: string | undefined;
};

export default (
  type: CourseMaterialNextStepType,
  item: Item,
  replaceCustomContent: ReplaceCustomContent
): TypeDescription => {
  const hasStartedItem = item.computedProgressState === 'Started';

  let description: string | JSX.Element = '';
  let overrideName: string | JSX.Element = '';
  let overrideLabel = '';
  let ariaLabel;

  switch (type) {
    case 'STUDY_MATERIAL_ONTRACK':
      if (hasStartedItem) {
        description = _t("You're doing great! Pick up where you left off and you'll be done in no time.");
      } else {
        description = (
          <FormattedMessage
            message={_t(
              `It'll take about {timeCommitment}. After you're done,
                  continue on and try finishing ahead of schedule.`
            )}
            timeCommitment={getFormattedTimeCommitment(item)}
          />
        );
      }

      break;

    case 'STUDY_MATERIAL_OVERDUE':
      description = replaceCustomContent(
        _t("It's not too late—finish up the {week} and then give your next assessment a try.")
      );
      break;

    case 'QUIZ_ONTRACK':
      overrideLabel = _t('Start');
      description = _t("Find out what to review by testing what you've learned so far.");
      ariaLabel = _t('Start quiz');
      break;

    case 'QUIZ_OVERDUE':
      description = replaceCustomContent(_t("It's not too late—finish up the {week} and you'll be right on schedule."));
      break;

    case 'PRACTICE_ASSIGNMENT_ONTRACK':
      if (hasStartedItem) {
        description = _t("You're doing great! Pick up where you left off and you'll be done in no time.");
      } else {
        description = _t("Find out what to review by applying what you've learned so far.");
      }

      break;

    case 'PRACTICE_ASSIGNMENT_OVERDUE':
      description = replaceCustomContent(_t("It's not too late—finish up the {week} and then give {name} a try."), {
        additionalVariables: {
          name: item.name,
        },
      });

      break;

    case 'EXAM_VERIFY':
      overrideLabel = _t('Try Again');
      ariaLabel = _t('Try assessment again');
      overrideName = <FormattedMessage message={_t('Verify: {name}')} name={getFormattedNameWithPrefix(item)} />;
      description = _t(
        "You passed, great work! To get credit, you'll need to verify your identity and give it another try"
      );
      break;

    case 'EXAM_FAILED_TRY_AGAIN':
      overrideLabel = _t('Try Again');
      ariaLabel = _t('Try assessment again');
      overrideName = <FormattedMessage message={_t('Retake: {name}')} name={getFormattedNameWithPrefix(item)} />;
      description = _t('You get another chance! Review what you missed and try again');
      break;

    case 'EXAM_FAILED_TRY_LATER':
      overrideLabel = _t('Resume');
      ariaLabel = _t('Resume assessment');
      description = replaceCustomContent(
        _t('Finish up the {week} and then try <b>{name}</b> again—you can still get full credit.'),
        {
          additionalVariables: {
            name: getFormattedNameWithPrefix(item),
          },
        }
      );
      break;

    case 'EXAM_ONTRACK':
      overrideLabel = _t('Start');
      ariaLabel = _t('Start assessment');
      description = _t("If you don't get it the first time, you can always try again.");
      break;

    case 'EXAM_OVERDUE':
      overrideLabel = _t('Start');
      ariaLabel = _t('Start assessment');
      description = _t("It's not too late! You can still get full credit, so give it a try.");
      break;

    case 'GRADED_ASSIGNMENT_VERIFY':
      overrideLabel = _t('Try Again');
      ariaLabel = _t('Try assessment again');
      overrideName = <FormattedMessage message={_t('Verify: {name}')} name={getFormattedNameWithPrefix(item)} />;
      description = _t(
        "You passed, great work! To get credit, you'll need to verify your identity and give it another try"
      );
      break;

    case 'GRADED_ASSIGNMENT_FAILED_TRY_AGAIN':
      overrideLabel = _t('Try Again');
      ariaLabel = _t('Try assessment again');
      overrideName = <FormattedMessage message={_t('Resubmit: {name}')} name={getFormattedNameWithPrefix(item)} />;
      description = _t('You get another chance! Review what you missed and resubmit as soon as you can.');
      break;

    case 'GRADED_ASSIGNMENT_FAILED_TRY_LATER':
      overrideLabel = _t('Resume');
      ariaLabel = _t('Resume assessment');
      description = replaceCustomContent(
        _t('Finish up the {week} and then try <b>{name}</b> again—you can still get full credit.'),
        {
          additionalVariables: {
            name: getFormattedNameWithPrefix(item),
          },
        }
      );
      break;

    case 'GRADED_ASSIGNMENT_ONTRACK':
      if (hasStartedItem) {
        description = _t("If you don't get it the first time, you can always try again.");
      } else {
        description = (
          <FormattedMessage
            message={_t("You're making great progress. Try finishing up by {deadline} to stay on track")}
            deadline={moment(item.deadline).format('LL')}
          />
        );
      }
      break;

    case 'GRADED_ASSIGNMENT_OVERDUE':
      overrideLabel = _t('Start');
      ariaLabel = _t('Start assessment');
      description = _t("It's not too late! You can still get full credit, so give it a try.");
      break;

    case 'GRADED_PEER_VERIFY':
      overrideName = <FormattedMessage message={_t('Verify {name}')} name={getFormattedNameWithPrefix(item)} />;
      overrideLabel = _t('Try Again');
      ariaLabel = _t('Try assessment again');

      description = _t(
        `You passed, great work! To get credit, give it another try and don't forget to verify
                your identity before you start.`
      );
      break;

    case 'GRADED_PEER_UNSUBMITTED_ONTRACK':
      if (hasStartedItem) {
        description = (
          <FormattedMessage
            message={_t(
              `You're making great progress. Try to finish up by {deadline} so your
                    classmates have enough time to review your work.`
            )}
            deadline={moment(item.deadline).format('LL')}
          />
        );
      } else {
        overrideName = _t('Peer Graded Assignment');
        description = (
          <FormattedMessage
            message={_t(
              `Get started early to make sure your classmates have enough time
                      to review your work—grading ends at {deadline}`
            )}
            deadline={moment(item.deadline).format('LL')}
          />
        );
      }
      break;

    case 'GRADED_PEER_UNSUBMITTED_OVERDUE':
      overrideName = _t('Peer Graded Assignment');

      if (hasStartedItem) {
        description = _t(
          `It's not too late! Try finishing today so that classmates have enough time to review
                  your work`
        );
      } else {
        description = _t(
          `It's not too late! Get started as soon as you can so classmates have enough time
                  to review your work`
        );
      }

      break;

    case 'GRADED_PEER_REVIEW_ONTRACK':
      overrideName = _t('Review Your Peers');
      description = (
        <FormattedMessage
          message="To get credit, you'll need to grade {requiredReviewCount} of your peer's assignment submissions."
          // @ts-expect-error TSMIGRATION
          requiredReviewCount={item.contentSummary.definition.requiredReviewCount}
        />
      );

      break;

    case 'GRADED_PEER_REVIEW_OVERDUE':
      overrideName = _t('Review Your Peers');

      if (hasStartedItem) {
        description = (
          <FormattedMessage
            message="It's not too late! As long as you grade at least {reviewCount} more assignments,
                    you'll get credit for your work."
            // @ts-expect-error TSMIGRATION
            reviewCount={item.contentSummary.definition.reviewCount}
          />
        );
      } else {
        description = (
          <FormattedMessage
            message="It's not too late! As long as you grade at least {requiredReviewCount} assignments,
                    you'll get credit for your work."
            // @ts-expect-error TSMIGRATION
            requiredReviewCount={item.contentSummary.definition.requiredReviewCount}
          />
        );
      }

      break;

    case 'GRADED_PEER_OVERDUE':
      overrideName = _t('Peer Graded Assignment');
      if (hasStartedItem) {
        description = _t(
          `It's not too late! Try finishing today so that classmates have enough time to review
                your work`
        );
      } else {
        description = _t(
          `It's not too late! Get started as soon as you can so classmates have enough time
                to review your work`
        );
      }

      break;

    case 'GRADED_PEER_ONTRACK':
      if (hasStartedItem) {
        description = (
          <FormattedMessage
            message={_t(
              `You're making great progress. Try to finish up by {deadline} so your
                  classmates have enough time to review your work.`
            )}
            deadline={moment(item.deadline).format('LL')}
          />
        );
      } else {
        overrideName = _t('Peer Graded Assignment');
        description = (
          <FormattedMessage
            message={_t(
              `Get started early to make sure your classmates have enough time
                    to review your work—grading ends at {deadline}`
            )}
            deadline={moment(item.deadline).format('LL')}
          />
        );
      }

      break;

    case 'GRADED_PEER_FAILED':
      overrideName = _t('Review what you missed');
      overrideLabel = _t('Try Again');
      ariaLabel = _t('Try assessment again');
      description = (
        <FormattedMessage
          message={_t("It looks like you didn't get full credit for {name}. That's ok")}
          name={getFormattedNameWithPrefix(item)}
        />
      );

      break;

    default:
      overrideName = _t("You're doing great!");
      description = _t("Pick up where you left off and you'll be done in no time.");
      overrideLabel = _t('Resume');
      ariaLabel = _t('Resume assessment');
      break;
  }

  return {
    description,
    overrideLabel,
    overrideName,
    ariaLabel,
  };
};
