import React from 'react';
import { Select } from '@coursera/coursera-ui';
import 'css!./__styles__/SkillTagSelect';
import _t from 'i18n!nls/skill-tagging';

export type SkillEntry = {
  skillName: string;
  skillId: string;
  className?: string; // This will be added to the entries created by users
};

type Props = {
  skills: SkillEntry[];
  selectedSkills: SkillEntry[];
  onChange: (skills: SkillEntry[]) => void;
};

const SkillTagSelect: React.FunctionComponent<Props> = ({ skills, selectedSkills, onChange }) => (
  <div className="rc-SkillTagSelect">
    <Select
      className="skill-tagging-select"
      valueKey="skillId"
      labelKey="skillName"
      searchable
      creatable
      multi
      placeholder={_t('Select skills...')}
      onChange={onChange}
      options={skills}
      value={selectedSkills}
    />
  </div>
);

export default SkillTagSelect;
