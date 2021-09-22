import React from 'react';
import { Pill } from '@coursera/coursera-ui';

import 'css!./__styles__/SkillTagPill';

type PillProps = {
  skillName: string;
  isSelected: boolean;
  onPillClick: (isSelected: boolean) => void;
};
const SkillTagPill: React.FunctionComponent<PillProps> = (props: PillProps) => (
  <button className="skill-tab-button" onClick={() => props.onPillClick(!props.isSelected)} type="button">
    <Pill
      rootClassName={props.isSelected ? 'skill-tag--selected' : 'skill-tag'}
      size="lg"
      type="outline"
      borderColor={props.isSelected ? '#2a73cc' : '#e1e1e1'}
      label={props.skillName}
      htmlAttributes={{
        role: 'checkbox',
        'aria-checked': props.isSelected,
      }}
    />
  </button>
);

export default SkillTagPill;
