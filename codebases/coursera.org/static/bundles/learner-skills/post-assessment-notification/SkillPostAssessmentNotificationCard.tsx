import React, { useEffect } from 'react';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/skills-common';
import { ProgressBar } from 'bundles/skills-common';
import { TrackedLink2 } from 'bundles/page/components/TrackedLink2';

import 'css!./__styles__/SkillPostAssessmentNotificationCard';
import { useRetracked } from 'js/lib/retracked';

import type { SkillImprovement } from './types';

type Props = {
  withSkillsLink?: boolean;
  improvements: SkillImprovement[];
};

const SkillPostAssessmentNotificationCard = ({ improvements, withSkillsLink = true }: Props) => {
  const track = useRetracked();
  useEffect(() => {
    track({
      trackingName: 'skill_post_assessment_notification_card',
      action: 'shown',
      trackingData: {
        improvements,
      },
    });
  }, [track, improvements]);
  return (
    <div className="rc-SkillPostAssessmentNotificationBox">
      <div className="skills-notification-box">
        <FormattedMessage
          message={_t('You have {count, plural, =1 {a new skill score} other {new skill scores}}!')}
          count={improvements.length}
          tagName="h3"
        />
        <span className="skills-notification-description">
          {_t('Great job! Keep learning and making progress in your courses to increase your skill scores.')}
          {withSkillsLink && (
            <TrackedLink2
              trackingName="skill_post_assessment_link"
              data={{ improvements }}
              type="Link"
              className="see-skills-profile"
              href="/skills"
            >
              {_t('See skills')}
            </TrackedLink2>
          )}
        </span>
        <div className="skills-container">
          {improvements.map((improvement) => (
            <div className="skill-improvement">
              <div className="skill-improvement-box">
                <div className="skill-improvement-info">
                  <span className="skill-improvement-name">{improvement.skill.name}</span>
                  <span className="skill-improvement-value">{improvement.readableScore}</span>
                </div>
                <ProgressBar score={improvement.readableScore} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillPostAssessmentNotificationCard;
