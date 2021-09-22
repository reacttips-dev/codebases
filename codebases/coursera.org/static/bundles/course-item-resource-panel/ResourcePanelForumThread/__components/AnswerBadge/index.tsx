import React from 'react';
import _t from 'i18n!nls/course-item-resource-panel';
import PillTag, { TagType } from '../PillTag';
import { AnswerBadgeProps, BadgeTypes } from './__types__';

function tagType(badgeType: BadgeTypes): TagType {
  let result: TagType;

  switch (badgeType) {
    case 'MENTOR_RESPONDED':
    case 'MENTOR_CREATED':
    case 'STAFF_RESPONDED':
    case 'STAFF_CREATED':
    case 'INSTRUCTOR_RESPONDED':
      result = 'person';
      break;
    case 'HIGHLIGHTED':
      result = 'info';
      break;
    default:
      result = 'info';
  }

  return result;
}
const acceptedTopLevelBadges = {
  MENTOR: true,
  TEACHING_STAFF: true,
  COURSE_ASSISTANT: true,
  UNIVERSITY_ADMIN: true,
  INSTRUCTOR: true,
  HIGHLIGHTED: true,
} as const;

export function badgeLabels() {
  return {
    MENTOR: _t('Mentor'),
    TEACHING_STAFF: _t('Staff'),
    COURSE_ASSISTANT: _t('Assistant'),
    UNIVERSITY_ADMIN: _t('Staff'),
    INSTRUCTOR: _t('Instructor'),
    DATA_COORDINATOR: _t('Staff'),
    MENTOR_RESPONDED: _t('Mentor replied'),
    MENTOR_CREATED: _t('Mentor created'),
    STAFF_RESPONDED: _t('Staff replied'),
    STAFF_CREATED: _t('Staff created'),
    INSTRUCTOR_RESPONDED: _t('Instructor created'),
    HIGHLIGHTED: _t('Highlighted'),
  };
}

export default function AnswerBadge({ answerBadge }: AnswerBadgeProps) {
  const labelsMap = badgeLabels();
  // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  if (acceptedTopLevelBadges[answerBadge]) {
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return <PillTag label={labelsMap[answerBadge]} type={tagType(answerBadge)} />;
  } else {
    return null;
  }
}
