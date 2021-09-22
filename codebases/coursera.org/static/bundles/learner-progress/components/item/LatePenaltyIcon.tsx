import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';

import { SvgInfo } from '@coursera/coursera-ui/svg';

import { GradingLatePenalty as GradingLatePenaltyType } from 'bundles/course-v2/types/Item';

// TODO: Remove this dependency by refactoring.
import GradingLatePenalty from 'bundles/author-common/models/GradingLatePenalty';
import { LATE_PENALTY_TYPE } from 'bundles/author-common/constants/GradingLatePenalty';

import _t from 'i18n!nls/learner-progress';

import 'css!./__styles__/LatePenaltyIcon';

type Props = {
  tooltipLabel?: React.ReactNode;
  gradingLatePenalty?: GradingLatePenaltyType;
};

const latePenaltyLabel = (gradingLatePenalty?: GradingLatePenaltyType) => {
  if (gradingLatePenalty) {
    if (gradingLatePenalty.typeName === LATE_PENALTY_TYPE.COMPOUND) {
      return _t('A late penalty will be applied to your score after deadline.');
    } else {
      return new GradingLatePenalty(gradingLatePenalty).learnerLabel;
    }
  }
  return null;
};

const LatePenaltyIcon: React.FC<Props> = ({ gradingLatePenalty, tooltipLabel }) => {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip>{tooltipLabel || latePenaltyLabel(gradingLatePenalty)}</Tooltip>}
    >
      <div className="rc-LatePenaltyIcon">
        <SvgInfo size={20} color="#111" />
      </div>
    </OverlayTrigger>
  );
};

export default LatePenaltyIcon;
