import React, { useEffect } from 'react';
import _t from 'i18n!nls/skill-tagging';
import { useRetracked } from 'js/lib/retracked';
import { TrackedButton } from 'bundles/common/components/withSingleTracked';

import type { Skill } from './SkillTagList';
import SkillTagList from './SkillTagList';
import SkillTagAddOther from './SkillTagAddOther';
import type { SkillEntry } from './SkillTagSelect';

type Props = {
  // Display properties
  dialogTitle: string;
  dialogDescription: string;
  // Data
  allSkills: string[];
  shownSkills: Skill[];
  // State
  selectedSkills: string[];
  userWrittenSkills: SkillEntry[];
  // Handlers
  onPillClick: (skillId: string, isSelected: boolean) => void;
  onSkillSelectChange: (skills: SkillEntry[]) => void;
  // Callback
  submit: () => void;
};

const SkillTagModalContent = ({
  dialogTitle,
  dialogDescription,
  allSkills,
  shownSkills,
  selectedSkills,
  userWrittenSkills,
  onPillClick,
  onSkillSelectChange,
  submit,
}: Props) => {
  const track = useRetracked();

  useEffect(() => {
    track({
      trackingName: 'skill_tagging_modal',
      action: 'opened',
      trackingData: {},
    });
    return () => {
      track({
        trackingName: 'skill_tagging_modal',
        action: 'closed',
        trackingData: {},
      });
    };
  }, [track]); // This should be stable, so it should only execute once

  return (
    <div className="skill-tag-modal-content">
      <div className="skill-tag-title">{dialogTitle}</div>
      <span className="skill-tag-description">{dialogDescription}</span>

      <SkillTagList selectedSkills={selectedSkills} onPillClick={onPillClick} shownSkills={shownSkills} />

      <SkillTagAddOther selectedSkills={userWrittenSkills} onChange={onSkillSelectChange} skills={allSkills} />

      <TrackedButton
        type="primary"
        disabled={selectedSkills.length + userWrittenSkills.length === 0}
        rootClassName="link-button primary roomy submit-skill-button"
        trackingName="skill_tagging_modal_submit"
        onClick={submit}
      >
        {_t('Submit')}
      </TrackedButton>
    </div>
  );
};

export default SkillTagModalContent;
