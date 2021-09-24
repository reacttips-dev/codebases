import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {GUNSMOKE} from '../../../style/colors';
import {BASE_TEXT, TITLE_TEXT} from '../../../style/typography';
import {CurrentUserContext} from '../../../enhancers/current-user-enhancer';

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
});

const UserInfo = glamorous.div({
  marginLeft: 11
});

const UserName = glamorous.div({
  ...TITLE_TEXT,
  fontSize: 17
});

const UserTitle = glamorous.div({
  ...BASE_TEXT,
  fontSize: 14,
  lineHeight: 1.6,
  color: GUNSMOKE
});

const Prompt = glamorous.div({
  display: 'flex',
  alignItems: 'center'
});

export const Avatar = glamorous.img(
  {
    borderRadius: '50%'
  },
  ({size}) => ({width: size, height: size})
);

const Placeholder = glamorous.span({
  flex: 1,
  cursor: 'text',
  padding: '5px 0',
  fontSize: 15,
  letterSpacing: 0.2,
  color: GUNSMOKE,
  marginLeft: 14
});

const UserPanel = ({isActive = false, placeholder = ''}) => {
  const user = useContext(CurrentUserContext);

  if (!user) {
    return null;
  }

  return isActive ? (
    <Container>
      <Avatar src={user.imageUrl} alt={`Avatar of ${user.displayName}`} size={48} />
      <UserInfo>
        <UserName>{user.displayName}</UserName>
        <UserTitle>
          {user.title} {user.title && user.companyName ? 'at' : ''} {user.companyName}
        </UserTitle>
      </UserInfo>
    </Container>
  ) : (
    <Prompt>
      <Avatar src={user.imageUrl} alt={`Avatar of ${user.displayName}`} size={36} />
      <Placeholder>{placeholder}</Placeholder>
    </Prompt>
  );
};

UserPanel.propTypes = {
  isActive: PropTypes.bool,
  placeholder: PropTypes.string
};

export default UserPanel;
