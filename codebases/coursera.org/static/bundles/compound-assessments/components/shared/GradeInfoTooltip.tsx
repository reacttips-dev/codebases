import React from 'react';

import { color } from '@coursera/coursera-ui';
import { SvgInfo } from '@coursera/coursera-ui/svg';
import TooltipWrapper from 'bundles/authoring/common/components/TooltipWrapper';
import { getPercentGradeFromDecimal } from 'bundles/author-common/utils/GradeUtils';

import initBem from 'js/lib/bem';
import _t from 'i18n!nls/compound-assessments';
import 'css!./__styles__/GradeInfoTooltip';

import { ItemGradeCA } from 'bundles/compound-assessments/lib/withItemGrade';

const bem = initBem('GradeInfoTooltip');

type Props = {
  itemGrade?: ItemGradeCA | null;
  computedScore?: number | null;
  maxScore?: number | null;
};

const getGradeOverrideText = (
  itemGrade?: ItemGradeCA | null,
  computedScore?: number | null,
  maxScore?: number | null
) => {
  if (itemGrade && itemGrade.isOverridden) {
    return typeof computedScore === 'number' && typeof maxScore === 'number'
      ? _t('This grade was overridden from #{originalValue}%.', {
          originalValue: getPercentGradeFromDecimal(computedScore / maxScore),
        })
      : _t('This grade was overridden, there is no original released grade.');
  }
  return null;
};

const getLatePenaltyText = (itemGrade?: ItemGradeCA | null) => {
  const { latePenaltyRatio } = itemGrade || {};
  if (itemGrade && typeof latePenaltyRatio === 'number') {
    return !itemGrade.isOverridden
      ? _t('A late penalty of #{latePenaltyPercent}% has been applied.', {
          latePenaltyPercent: getPercentGradeFromDecimal(latePenaltyRatio),
        })
      : _t('This submission was submitted late.');
  }
  return null;
};

const GradeInfoTooltip: React.SFC<Props> = ({ itemGrade, computedScore, maxScore }) => {
  const latePenaltyText = getLatePenaltyText(itemGrade);
  const gradeOverrideText = getGradeOverrideText(itemGrade, computedScore, maxScore);
  if (!latePenaltyText && !gradeOverrideText) {
    return null;
  }
  return (
    <div className={bem()}>
      <TooltipWrapper
        message={`${gradeOverrideText || ''}
          ${latePenaltyText || ''}`}
      >
        <div className={bem('grade-info-icon')}>
          <SvgInfo title={_t('Grade Information')} size={20} color={color.primary} />
        </div>
      </TooltipWrapper>
    </div>
  );
};

export default GradeInfoTooltip;
