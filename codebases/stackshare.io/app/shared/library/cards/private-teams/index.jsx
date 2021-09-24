import React from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import {BASE_TEXT} from '../../../style/typography';
import {ASH, CATHEDRAL, WHITE, FOCUS_BLUE} from '../../../style/colors';
import InformationCircle from '../../information/circle';
import {truncateText} from '../../../utils/truncate-text';

const Container = glamorous.div({
  display: 'flex',
  borderRadius: '4px',
  boxShadow: `0 1px 0 0 ${ASH}`,
  border: `solid 1px ${ASH}`,
  backgroundColor: WHITE,
  padding: '19px 15px',
  fontSize: 18,
  fontWeight: 'bold',
  color: CATHEDRAL,
  flexDirection: 'column',
  alignItems: 'self-start',
  ...BASE_TEXT
});

const SubContainer = glamorous.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  marginBottom: 15
});

const IconContainer = glamorous.div({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const MemberInfo = glamorous.div({
  marginLeft: '13px',
  display: 'flex',
  flexDirection: 'column',
  fontSize: 13,
  fontWeight: 'normal'
});

const Link = glamorous.a({
  ...BASE_TEXT,
  fontSize: 14,
  fontWeight: 'bold',
  color: CATHEDRAL,
  '&:hover': {
    color: FOCUS_BLUE
  }
});

const Avatar = glamorous.img({
  width: 60,
  height: 60,
  borderRadius: 4,
  border: `1px solid ${ASH}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const PrivateTeamCard = ({team, iconData}) => {
  const {id, name, description, canonicalUrl, imageUrl} = team;

  return (
    <Container key={id}>
      <SubContainer>
        <a title={name} href={canonicalUrl}>
          <Avatar src={imageUrl} alt={name} title={name} />
        </a>
        <MemberInfo>
          <Link title={name} href={canonicalUrl}>
            {name}
          </Link>
          {description && truncateText(description, 100, '...')}
        </MemberInfo>
      </SubContainer>
      <IconContainer>
        {iconData.map((ed, index) => (
          <InformationCircle
            toolTip={ed.toolTip}
            key={index}
            icon={ed.Icon}
            count={ed.count}
            iconSize={{width: 13, height: 13}}
          />
        ))}
      </IconContainer>
    </Container>
  );
};

PrivateTeamCard.propTypes = {
  team: PropTypes.object,
  iconData: PropTypes.array
};

export default PrivateTeamCard;
