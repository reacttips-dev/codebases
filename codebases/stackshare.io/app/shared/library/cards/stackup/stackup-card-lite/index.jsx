import React from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import {
  border,
  flexBox,
  INITIAL,
  COLUMN,
  ROW,
  CENTER,
  SPACE_BTWN
} from '../../tool-alternatives/styles';
import {BASE_TEXT} from '../../../../style/typography';
import {TARMAC, CATHEDRAL, FOCUS_BLUE} from '../../../../style/colors';
import AlternativesIcon from '../../../icons/nav/alternatives.svg';
import Text from '../../../typography/text';
import Jobs from '../../../icons/nav/jobs.svg';

const Card = glamorous.div({
  textDecoration: 'none',
  minWidth: 300,
  ...flexBox(INITIAL, COLUMN)
});

const Link = glamorous.a({
  textDecoration: 'none'
});

const JobsLink = glamorous.a({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  margin: '5px 0 0 7px'
});

const JobsIcon = glamorous(Jobs)({
  width: 14,
  height: 14,
  marginRight: 7,
  ' path': {
    fill: FOCUS_BLUE
  }
});

const Row = glamorous.div({
  width: 150,
  marginRight: 100,
  ...flexBox(SPACE_BTWN, ROW, CENTER)
});

const Logo = glamorous.img({
  width: 50,
  height: 50,
  ...border(2)
});

const Title = glamorous.div({
  display: 'flex',
  marginTop: 15,
  '& div': {
    ...BASE_TEXT,
    color: TARMAC,
    fontSize: 14
  }
});

const Divider = glamorous.div({
  ...BASE_TEXT,
  color: CATHEDRAL,
  fontSize: 11,
  height: 21,
  width: 21,
  boxSizing: 'content-box',
  flexShrink: 0,
  marginRight: 5,
  marginLeft: 5,
  ...border('50%'),
  ...flexBox(CENTER, ROW, CENTER)
});

const Icon = glamorous.div({
  height: 25,
  width: 25,
  marginRight: 5,
  '& svg > g': {
    fill: FOCUS_BLUE,
    stroke: FOCUS_BLUE
  }
});

const StackupCardLite = ({
  slug,
  stackupSlug,
  thumbRetinaUrl,
  name,
  stackupLogo,
  stackupName,
  showJobs = false
}) => {
  return (
    <Card>
      <Link href={`/stackups/${slug}-vs-${stackupSlug}`}>
        <Row>
          <Logo src={thumbRetinaUrl} alt={`${name} logo`} />
          <Divider>VS</Divider>
          <Logo src={stackupLogo} alt={`${stackupName} logo`} />
        </Row>
        <Title>
          <Icon>
            <AlternativesIcon />
          </Icon>
          <div>{`Compare ${name} vs ${stackupName}`}</div>
        </Title>
      </Link>
      {showJobs && (
        <JobsLink href={`/jobs/${slug}`}>
          <JobsIcon /> <Text>View Jobs</Text>
        </JobsLink>
      )}
    </Card>
  );
};

StackupCardLite.propTypes = {
  slug: PropTypes.string,
  stackupSlug: PropTypes.string,
  thumbRetinaUrl: PropTypes.string,
  name: PropTypes.string,
  stackupLogo: PropTypes.string,
  stackupName: PropTypes.string,
  showJobs: PropTypes.bool
};

export default StackupCardLite;
