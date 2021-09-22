import React from 'react';
import 'css!./__styles__/index';
import _t from 'i18n!nls/course-item-resource-panel';

type Props = { initials: string | JSX.Element; color?: string; photoUrl?: string };

export default function ProfileAvatar({ initials, color = '#2A73CC', photoUrl }: Props) {
  return (
    <span
      className="rc-ProfileAvatar"
      style={{
        background: color,
      }}
    >
      {photoUrl && <img className="rc-ProfileAvatar__profileImage" src={photoUrl} alt={_t('user profile avatar')} />}
      {!photoUrl && initials}
    </span>
  );
}
