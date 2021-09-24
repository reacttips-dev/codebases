import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {truncate} from '../../../shared/utils/lodash-functions';
import {grid} from '../../utils/grid';
import {stripURL} from '../../utils/strip-text';
import {ASH, FOCUS_BLUE, TARMAC} from '../../style/colors';
import TwitterIcon from './twitter-icon.svg';
import WebsiteIcon from './website-icon.svg';
import OpenSourceIcon from '../icons/open-source-icon.svg';
import LocationIcon from './location-icon.svg';
import CompanyIcon from '../../library/icons/company.svg';
import ToolProfileIcon from './tool-profile-icon.svg';
import PackageLinkIcon from './package-link-icon.svg';
import Jobs from '../icons/nav/jobs.svg';
import {PHONE} from '../../style/breakpoints';
import {BASE_TEXT} from '../../style/typography';

const GitRepoIcon = glamorous(OpenSourceIcon)({
  ' path': {
    fill: FOCUS_BLUE
  }
});

const JobsIcon = glamorous(Jobs)({
  ' path': {
    fill: FOCUS_BLUE
  }
});

const Container = glamorous.div(
  {
    display: 'flex',
    alignItems: 'flex-start',
    paddingRight: grid(1),
    [PHONE]: {
      width: '100%',
      paddingRight: 0,
      display: 'grid',
      gridTemplateColumns: '48% 48%',
      gridGap: 11
    },
    '& a, & span': {
      paddingRight: grid(1),
      display: 'flex',
      flexWrap: 'nowrap',
      flex: 2,
      alignItems: 'center',
      [PHONE]: {
        paddingRight: 0
      },
      '& div': {
        textAlign: 'initial',
        display: 'inline-block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    },
    '& div > span': {
      width: 90
    },
    '& a': {
      textDecoration: 'none',
      borderRight: `1px solid ${ASH}`,
      [PHONE]: {
        height: 40,
        border: '1px solid #dedede',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    },
    '& svg': {
      marginLeft: grid(2),
      marginRight: grid(1),
      position: 'relative',
      top: 2,
      height: 14,
      [PHONE]: {
        marginLeft: 0
      }
    },
    '& a:first-child > svg': {
      marginLeft: 0
    }
  },
  ({separatorForLast}) => ({
    '& a, & span': {
      ':nth-last-child(2)': {
        paddingRight: separatorForLast ? grid(1) : 0,
        [PHONE]: {
          paddingRight: 0
        }
      }
    },
    '& a': {
      ':nth-last-child(2)': {
        borderRight: separatorForLast ? `1px solid ${ASH}` : 'none',
        [PHONE]: {
          borderRight: '1px solid #dedede'
        }
      }
    }
  })
);

const Text = glamorous.div({
  ...BASE_TEXT,
  color: TARMAC,
  '& a, & a:hover, & a:visited': {
    color: TARMAC,
    textDecoration: 'none'
  }
});

const ExtraComponent = glamorous.div({
  display: 'none',
  [PHONE]: {
    display: 'block'
  }
});

export default class Links extends Component {
  static propTypes = {
    twitter: PropTypes.string,
    website: PropTypes.string,
    packageUrl: PropTypes.string,
    location: PropTypes.string,
    truncateLength: PropTypes.number,
    onClick: PropTypes.func,
    isCompany: PropTypes.bool,
    company: PropTypes.string,
    toolProfile: PropTypes.string,
    jobsPath: PropTypes.string,
    githubUrl: PropTypes.string,
    separatorForLast: PropTypes.bool,
    user: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    component: PropTypes.any
  };

  static defaultProps = {
    truncateLength: 23
  };

  render() {
    const {
      twitter,
      website,
      location,
      company,
      isCompany,
      toolProfile,
      truncateLength,
      onClick,
      jobsPath,
      githubUrl,
      user,
      separatorForLast,
      component,
      packageUrl
    } = this.props;
    const twitterUrl = `http://twitter.com/${twitter}`;
    return (
      <Container separatorForLast={separatorForLast}>
        {jobsPath && (
          <a
            onClick={() => {
              onClick('view jobs', jobsPath);
            }}
            href={`/jobs/${jobsPath}`}
          >
            <JobsIcon /> <Text>View Jobs</Text>
          </a>
        )}
        {toolProfile && (
          <a
            onClick={() => {
              onClick('tool', toolProfile);
            }}
            href={toolProfile}
          >
            <ToolProfileIcon /> <Text>Tool Profile</Text>
          </a>
        )}
        {isCompany && company && (
          <a
            onClick={() => {
              onClick('company', company);
            }}
            href={company}
          >
            <CompanyIcon /> <Text>Company Profile</Text>
          </a>
        )}
        {user && (
          <a
            onClick={() => {
              onClick('user', user);
            }}
            href={`/${user.username}`}
          >
            <CompanyIcon /> <Text>View user profile</Text>
          </a>
        )}
        {twitter && (
          <a
            rel="nofollow"
            onClick={() => {
              onClick('twitter', twitterUrl);
            }}
            href={twitterUrl}
          >
            <TwitterIcon /> <Text>{truncate(twitter, truncateLength)}</Text>
          </a>
        )}
        {website && (
          <a
            rel="nofollow"
            onClick={() => {
              onClick('website', website);
            }}
            href={website}
          >
            <WebsiteIcon /> <Text>{truncate(stripURL(website), {length: truncateLength})}</Text>
          </a>
        )}
        {packageUrl && (
          <a
            rel="nofollow"
            onClick={() => {
              onClick('packageUrl', packageUrl);
            }}
            href={packageUrl}
          >
            <PackageLinkIcon />{' '}
            <Text>{truncate(stripURL(packageUrl), {length: truncateLength})}</Text>
          </a>
        )}
        {githubUrl && (
          <a
            rel="nofollow"
            onClick={() => {
              onClick('githubUrl', githubUrl);
            }}
            href={githubUrl ? githubUrl : website}
          >
            <GitRepoIcon />{' '}
            <Text>{truncate(stripURL(githubUrl.split('/').pop()), {length: truncateLength})}</Text>
          </a>
        )}
        {location && (
          <span>
            <LocationIcon /> <Text>{truncate(location, {length: truncateLength})}</Text>
          </span>
        )}
        <ExtraComponent>{component && component}</ExtraComponent>
      </Container>
    );
  }
}
