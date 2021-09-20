/* eslint-disable import/no-default-export */
import { forTemplate } from '@trello/i18n';
import { MemberAvatarUnconnected } from 'app/src/components/MemberAvatar';
import React from 'react';
import { MemberModel } from 'app/gamma/src/types/models';
import preventDefault from 'app/gamma/src/util/prevent-default';
import styles from './search-results.less';
import { Button } from '@trello/nachos/button';

const formatMemberResult = forTemplate('search_suggetion_member');

interface MemberSuggestionProps {
  member: MemberModel;
  onClick: (member: MemberModel) => void;
  setSelectedSuggestion: (selected: string | null) => void;
}
class MemberSuggestion extends React.Component<MemberSuggestionProps> {
  highlightSuggestion = () => {
    this.props.setSelectedSuggestion(this.props.member.id);
  };

  unhighlightSuggestion = () => {
    this.props.setSelectedSuggestion(null);
  };

  onClick = preventDefault(() => {
    this.props.onClick(this.props.member);
  });

  render() {
    const { member } = this.props;

    return (
      <Button
        appearance="subtle"
        size="fullwidth"
        className={styles.suggestionBtn}
        onClick={this.onClick}
        onMouseEnter={this.highlightSuggestion}
        onMouseLeave={this.unhighlightSuggestion}
        onFocus={this.highlightSuggestion}
      >
        <MemberAvatarUnconnected
          avatarSource={member.avatarSource}
          username={member.username}
          fullName={member.name}
          avatars={member.avatars || undefined}
          initials={member.initials}
          deactivated={member.activityBlocked}
        />
        <span className={styles.memberDescription}>
          {formatMemberResult('cards-assigned-to-fullname', {
            fullName: (
              <strong key={`strong-suggestion-${member.id}`}>
                {member.name}
              </strong>
            ),
          })}
        </span>
      </Button>
    );
  }
}

export default MemberSuggestion;
