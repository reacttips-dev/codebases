import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {CurrentUserContext} from '../../../../shared/enhancers/current-user-enhancer';
import {NavigationContext} from '../../../../shared/enhancers/router-enhancer';
import {ApolloContext} from '../../../../shared/enhancers/graphql-enhancer';
import {toggleBookmark} from '../../../../data/jobs/mutations';
import {user} from '../../../../data/shared/queries';
import {CtaPannel} from '../shared/styles';
import {SIGN_IN_PATH} from '../../../../shared/constants/paths';
import BookmarkIcon from '../../../../shared/library/icons/bookmarked-blue.svg';
import {ASH, CONCRETE, FOCUS_BLUE, WHITE} from '../../../../shared/style/colors';
import {ALPHA} from '../../../../shared/style/color-utils';
import {PHONE} from '../../../../shared/style/breakpoints';
import {useSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';
import {CLICK_JOBS_BOOKMARK, JOBS_CLICK} from '../../constants/analytics';

const Bookmark = glamorous.div(
  {
    border: `1px solid ${ASH}`,
    height: 40,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 10px',
    ' >svg ': {
      width: 20,
      height: 17
    }
  },
  ({bookmarked}) => ({
    background: bookmarked ? FOCUS_BLUE : WHITE,
    ' svg path': {
      stroke: bookmarked ? WHITE : CONCRETE,
      fill: bookmarked ? WHITE : CONCRETE
    }
  })
);

const Simple = glamorous.a({
  height: 40,
  textDecoration: 'none',
  marginRight: 10,
  padding: '0 15px',
  backgroundColor: FOCUS_BLUE,
  borderRadius: 2,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: WHITE,
  border: `1px solid ${FOCUS_BLUE}`,
  outline: 'none',
  ':hover': {
    background: ALPHA(FOCUS_BLUE, 0.8),
    color: WHITE
  },
  ':active': {
    color: WHITE
  },
  [PHONE]: {
    flexGrow: 1
  }
});

const CtaPanel = ({job, bookmarkedJobsIds}) => {
  const currentUser = useContext(CurrentUserContext);
  const navigate = useContext(NavigationContext);
  const client = useContext(ApolloContext);
  const sendAnalyticsEvent = useSendAnalyticsEvent();

  const bookmarked = job.bookmarked || (bookmarkedJobsIds && bookmarkedJobsIds.includes(job.id));

  const handleToggleBookmark = () => {
    client
      .mutate({
        mutation: toggleBookmark,
        variables: {
          id: job.id,
          bookmark: job.bookmarked
            ? !job.bookmarked
            : bookmarkedJobsIds && !bookmarkedJobsIds.includes(job.id)
        },
        optimisticResponse: {
          __typename: 'Mutation',
          toggleBookmark: {
            id: job.id,
            __typename: 'Job',
            bookmark: job.bookmarked
              ? !job.bookmarked
              : bookmarkedJobsIds && !bookmarkedJobsIds.includes(job.id)
          }
        },
        refetchQueries: [{query: user}]
      })
      // eslint-disable-next-line no-unused-vars
      .catch(err => {});
  };

  const onJobClick = ({job}) => {
    sendAnalyticsEvent(JOBS_CLICK, {...job, details: true});
  };

  const onBookmarkToggle = ({job}) => {
    if (currentUser) {
      handleToggleBookmark();
    } else {
      navigate(SIGN_IN_PATH);
    }
    sendAnalyticsEvent(CLICK_JOBS_BOOKMARK, {...job, bookmarked: !bookmarked});
  };

  return (
    <CtaPannel>
      <Simple
        href={job.url}
        title={job.title}
        rel="noopener noreferrer nofollow"
        target="_blank"
        onClick={() => onJobClick({job})}
      >
        View Details
      </Simple>
      <Bookmark
        title={bookmarked ? 'Unbookmark job' : 'Bookmark job'}
        bookmarked={bookmarked}
        onClick={() => onBookmarkToggle({job})}
      >
        <BookmarkIcon />
      </Bookmark>
    </CtaPannel>
  );
};

CtaPanel.propTypes = {
  job: PropTypes.object,
  bookmarkedJobsIds: PropTypes.array
};

export default CtaPanel;
