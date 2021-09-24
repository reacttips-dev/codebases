import React from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import Avatar from '../../avatars/avatar';
import {BASE_TEXT} from '../../../style/typography';
import {CHARCOAL, TARMAC} from '../../../style/colors';
import {useSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';

const Container = glamorous.div({
  display: 'flex',
  width: 320,
  alignItems: 'center'
});

const MemberInfo = glamorous.a({
  marginLeft: 10,
  ...BASE_TEXT,
  fontSize: 12,
  color: TARMAC,
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  '>strong': {
    color: CHARCOAL
  },
  '&:hover': {
    color: TARMAC
  }
});

const TeamMemberCard = ({member}) => {
  const sendAnalyticsEvent = useSendAnalyticsEvent();

  const {username, displayName} = member;
  return (
    <Container key={member.id}>
      <Avatar
        user={member}
        withPopover={true}
        onActivate={() => sendAnalyticsEvent('activate_teamMemberCard', {username, displayName})}
        onClick={() => sendAnalyticsEvent('click_teamMemberCard', {username, displayName})}
        size={60}
      />
      <MemberInfo href={member.path} title={member.displayName}>
        <strong>{member.displayName}</strong>
        {member.title}
      </MemberInfo>
    </Container>
  );
};

TeamMemberCard.propTypes = {
  member: PropTypes.object
};

export default TeamMemberCard;
