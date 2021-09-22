import React from 'react';

import SkillTagPill from './SkillTagPill';

import 'css!./__styles__/SkillTagList';

export type Skill = {
  skillName: string;
  skillId: string;
  skillOrderDisplay: number;
};

type Props = {
  shownSkills: Skill[];
  onPillClick: (skillId: string, isSelected: boolean) => void;
  selectedSkills: string[];
};

type State = {
  randomOrderSkills: Skill[];
};

class SkillTagList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      randomOrderSkills: props.shownSkills.sort(() => 0.5 - Math.random()), // Randomize order of top 7 skills
    };
  }

  _renderSkillTagPill(skill: Skill) {
    const isSelected = this.props.selectedSkills.includes(skill.skillId);
    return (
      <SkillTagPill
        key={skill.skillId}
        skillName={skill.skillName}
        isSelected={isSelected}
        onPillClick={() => this.props.onPillClick(skill.skillId, !isSelected)}
      />
    );
  }

  render() {
    const { randomOrderSkills } = this.state;
    return <div className="skill-tag-list">{randomOrderSkills.map((skill) => this._renderSkillTagPill(skill))}</div>;
  }
}

export default SkillTagList;
