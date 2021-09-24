import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {TARMAC, CHARCOAL, FOCUS_BLUE} from '../../../style/colors';
import {BASE_TEXT, WEIGHT} from '../../../style/typography';
import {truncateWords} from '../../../utils/truncate-text';
import AlternativesStatsCard from '../tool-stats/alternatives-stats/index';
import FollowServiceButton from '../../buttons/follow/follow-service-button';
import UseThisButton from '../../buttons/use-this';
import ContactVendorCard from '../contact-vendor';
import {border, flexBox, INITIAL, COLUMN, CENTER, ROW, SPACE_BTWN} from './styles';
import {TABLET, PHONE} from '../../../style/breakpoints';
import ToolStatsCard from '../tool-stats';
import {planPermissionCheck} from '../../../utils/plan-permission-check';
import {PLANS} from '../../../../bundles/private-payment/constants';

const Card = glamorous.div({
  ...flexBox(SPACE_BTWN, ROW, CENTER),
  width: '100%',
  padding: '0 20px',
  [PHONE]: {
    padding: 0,
    flexDirection: COLUMN
  }
});

const LogoColumn = glamorous.div({
  width: 110,
  ...flexBox(CENTER, ROW)
});

const Logo = glamorous.img({
  width: 68,
  height: 68,
  [TABLET]: {
    width: 78,
    height: 78
  }
});

const InfoBox = glamorous.div({
  height: '100%',
  width: '100%',
  ...flexBox(INITIAL, COLUMN),
  [TABLET]: {
    ...flexBox(INITIAL, COLUMN, CENTER)
  }
});

const Link = glamorous.a({
  textDecoration: 'none',
  cursor: 'pointer',
  color: CHARCOAL,
  '&:hover, &:focus': {
    color: FOCUS_BLUE
  }
});

const LogoLink = glamorous(Link)({
  width: 70,
  height: 70,
  marginRight: 20,
  ...border(2),
  [TABLET]: {
    marginRight: INITIAL,
    width: 80,
    height: 80
  }
});

const Title = glamorous.h2({
  ...BASE_TEXT,
  fontSize: 18,
  fontWeight: WEIGHT.BOLD,
  margin: 0,
  [TABLET]: {
    margin: '15px auto'
  }
});

const Description = glamorous.div({
  ...BASE_TEXT,
  fontSize: 14,
  lineHeight: 1.5,
  color: TARMAC,
  [TABLET]: {
    textAlign: CENTER,
    margin: '20px 0'
  }
});

const Stats = glamorous.div({
  padding: '5px 0',
  [TABLET]: {
    display: 'none'
  }
});

const MobileStats = glamorous.div({
  display: 'none',
  [TABLET]: {
    display: 'flex',
    width: '100%',
    marginBottom: 10,
    ' > div': {
      margin: '0 auto'
    }
  }
});

const FlexMultiple = glamorous.div({
  display: 'flex',
  width: '100%',
  padding: '10px 0',
  ' > button': {
    width: 125
  },
  [TABLET]: {
    justifyContent: 'space-between',
    ' > button': {
      width: '48%',
      margin: 0
    }
  }
});

const CompanyInfo = glamorous.div({
  ...flexBox('initial', ROW, CENTER),
  [PHONE]: {
    flexDirection: 'column'
  }
});

const CTAbox = glamorous.div({
  ...flexBox('initial', COLUMN, CENTER),
  [PHONE]: {
    width: '100%'
  }
});

const ToolAlternativesCard = ({
  id,
  contactButtonText,
  contactEnabled,
  contactFlow,
  followers,
  following,
  name,
  path,
  stacks,
  thumbRetinaUrl,
  title,
  votes,
  privateMode,
  currentUser
}) => {
  const planPermission = planPermissionCheck(privateMode, PLANS.FREE);

  return (
    <Card>
      <CompanyInfo>
        <LogoColumn>
          <LogoLink href={path}>
            <Logo src={thumbRetinaUrl} alt={`${name} logo`} />
          </LogoLink>
        </LogoColumn>
        <InfoBox>
          <Title>
            <Link href={path}>{name}</Link>
          </Title>
          <Stats>
            <AlternativesStatsCard
              followers={followers && followers.count}
              stacks={stacks}
              votes={votes}
            />
          </Stats>
          <Description>{truncateWords(title, {limit: 18})}</Description>
          <MobileStats>
            <ToolStatsCard stacks={stacks} followers={followers && followers.count} votes={votes} />
          </MobileStats>
        </InfoBox>
      </CompanyInfo>
      <CTAbox>
        <FlexMultiple>
          <FollowServiceButton serviceId={id} following={following} />
          <UseThisButton serviceId={id} />
        </FlexMultiple>

        {(!currentUser ||
          (!privateMode && currentUser) ||
          (privateMode && currentUser && planPermission)) &&
          contactEnabled && (
            <ContactVendorCard
              toolId={id}
              contactEnabled={contactEnabled}
              contactButtonText={contactButtonText}
              contactFlow={contactFlow}
              altStyle={true}
            />
          )}
      </CTAbox>
    </Card>
  );
};

ToolAlternativesCard.propTypes = {
  id: PropTypes.string,
  contactButtonText: PropTypes.string,
  contactEnabled: PropTypes.bool,
  contactFlow: PropTypes.object,
  followers: PropTypes.object,
  following: PropTypes.bool,
  name: PropTypes.string,
  path: PropTypes.string,
  stacks: PropTypes.number,
  thumbRetinaUrl: PropTypes.string,
  title: PropTypes.string,
  votes: PropTypes.number,
  privateMode: PropTypes.any,
  currentUser: PropTypes.object
};

export default ToolAlternativesCard;
