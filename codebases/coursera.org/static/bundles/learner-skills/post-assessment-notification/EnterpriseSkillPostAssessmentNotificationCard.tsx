import React, { useEffect } from 'react';
import _ from 'lodash';

import _t from 'i18n!nls/skills-common';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import { Button, color } from '@coursera/coursera-ui';
import { ProgressTracker } from 'bundles/skills-common';
import { useRetracked } from 'js/lib/retracked';

import type { EnterpriseSkillsPostAssessmentData } from './EnterpriseSkillPostAssesmentDataProvider';
import type { SkillImprovement } from './types';

import 'css!./__styles__/EnterpriseSkillPostAssessmentNotificationCard';

type Props = {
  improvements: SkillImprovement[];
} & Required<EnterpriseSkillsPostAssessmentData>;

const EnterpriseSkillPostAssessmentNotificationCard = ({
  improvements,
  savedSkillSet,
  savedSkillSetProgramUrl,
}: Props) => {
  const skillSetTargets = savedSkillSet.targetSkillProficiencies;
  const keyedImprovements = _.keyBy(improvements, (i) => i.skill.id);

  // Only display improved skills that are part of saved SkillSet
  const skillSetTargetsWithScores = skillSetTargets
    .map((t) => {
      const skillId = t.skillId;
      const improvement = keyedImprovements[skillId];
      return {
        ...t,
        score: improvement?.readableScore,
        skillName: improvement?.skill.name,
      };
    })
    .filter((st) => st.score && st.skillName);

  const track = useRetracked();
  useEffect(() => {
    track({
      trackingName: 'enterprise_skill_post_assessment_notification_card',
      action: 'shown',
      trackingData: { skillSetTargetsWithScores },
    });
  }, [track, skillSetTargetsWithScores]);

  if (skillSetTargetsWithScores.length === 0) return null;

  return (
    <div className="rc-EnterpriseSkillPostAssessmentNotificationCard">
      <div className="vertical-box">
        <div className="horizontal-box align-items-spacebetween heading-container">
          <h3 className="heading">{_t('You have new skill scores!')}</h3>
          <Button
            type="link"
            label={_t('See SkillSet Progress')}
            tag="a"
            htmlAttributes={{ href: savedSkillSetProgramUrl, target: '_blank', rel: 'noopener noreferrer' }}
            customStyles={{
              Button: { color: color.primary, padding: 0, minHeight: 0, fontWeight: 700, lineHeight: '24px' },
            }}
          />
        </div>
        <span className="sub-heading">
          <FormattedMessage
            message={_t("You're making great progress in the {skillSetTitle} SkillSet.")}
            skillSetTitle={<strong>{savedSkillSet.title}</strong>}
          />
        </span>
      </div>
      <div className="horizontal-box wrap align-items-spacebetween progress-container">
        {skillSetTargetsWithScores.map((skillTarget) => (
          <div key={skillTarget.skillId} className="progress-tracker-box">
            <ProgressTracker
              headerSize="sm"
              benchmarkLabelText={_t('Target')}
              score={skillTarget.score}
              target={skillTarget.targetProficiency}
              skillName={skillTarget.skillName}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnterpriseSkillPostAssessmentNotificationCard;
