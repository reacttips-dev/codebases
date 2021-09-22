import React from 'react';
import _t from 'i18n!nls/discussions';
import PillTag from 'bundles/discussions/components/forumsV2-PillTag';
import { AnswerBadgeProps } from './__types__';

const acceptedTopLevelBadges = {
  MENTOR: true,
  TEACHING_STAFF: true,
  COURSE_ASSISTANT: true,
  UNIVERSITY_ADMIN: true,
  INSTRUCTOR: true,
  DATA_COORDINATOR: true,
};

export function badgeLabels() {
  return {
    MENTOR: _t('Mentor'),
    TEACHING_STAFF: _t('Staff'),
    COURSE_ASSISTANT: _t('Assistant'),
    UNIVERSITY_ADMIN: _t('Staff'),
    INSTRUCTOR: _t('Instructor'),
    DATA_COORDINATOR: _t('Staff'),
  };
}

export default function AnswerBadge({ answerBadge }: AnswerBadgeProps) {
  if (acceptedTopLevelBadges[answerBadge]) {
    const labelsMap = badgeLabels();
    return <PillTag label={labelsMap[answerBadge]} />;
  } else {
    return null;
  }
}
