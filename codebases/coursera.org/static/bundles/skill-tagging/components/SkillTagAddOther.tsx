import React from 'react';

import { TrackedButton } from 'bundles/common/components/withSingleTracked';
import 'css!./__styles__/SkillTagAddOther';

import _t from 'i18n!nls/skill-tagging';
import type { SkillEntry } from './SkillTagSelect';
import SkillTagSelect from './SkillTagSelect';

type Props = {
  skills: string[];
  selectedSkills: SkillEntry[];
  onChange: (skills: SkillEntry[]) => void;
};
type State = {
  isOpen: boolean;
};

class SkillTagAddOther extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  _renderAutocomplete() {
    return [
      <span key="0" className="skill-tag-description">
        {_t('Tell us what other skills are covered:')}
      </span>,
      <SkillTagSelect
        key="1"
        skills={this.props.skills.map((skillName) => ({
          skillId: skillName,
          skillName,
        }))}
        selectedSkills={this.props.selectedSkills}
        onChange={(skills) => this.props.onChange(skills)}
      />,
    ];
  }

  _renderAddOtherButton() {
    return (
      <TrackedButton
        type="link"
        trackingName="add_other_skill_button"
        rootClassName="add-other-skill-button"
        onClick={() => this.setState({ isOpen: true })}
      >
        {_t('Add Other')}
      </TrackedButton>
    );
  }

  render() {
    const { isOpen } = this.state;
    return (
      <div className="rc-SkillTagAddOther">
        {isOpen && this._renderAutocomplete()}
        {!isOpen && this._renderAddOtherButton()}
      </div>
    );
  }
}

export default SkillTagAddOther;
