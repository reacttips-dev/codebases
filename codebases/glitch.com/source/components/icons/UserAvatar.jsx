import React from 'react';
import styled from 'styled-components';

const AvatarContainer = styled.div`
  // inline-table display prevents the user avatars from appearing squashed in some places (e.g. pending project invites on mobile)
  display: inline-table;
  height: 25px;
  width: 25px;
  border-radius: 100%;
  background-color: ${(props) => props.color || '#f080fc'};
  background-position: center;
  background-repeat: no-repeat;
  ${(props) =>
    props.src
      ? `background-image: url('${props.src}');
          background-size: cover;`
      : `background-image: url('images/anon-avatar-smile.svg');
          background-size: 18px;`}
`;
export default function UserAvatar({ avatarUrl, color }) {
  return <AvatarContainer src={avatarUrl} color={color} />;
}
