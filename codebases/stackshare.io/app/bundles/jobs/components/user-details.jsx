import React, {useContext} from 'react';
import glamorous from 'glamorous';
import Avatar from '../../../shared/library/avatars/avatar';
import BigTitle from '../../../shared/library/typography/big-title';
import Text from '../../../shared/library/typography/text';
import Simple from '../../../shared/library/buttons/base/simple';
import {NavigationContext} from '../../../shared/enhancers/router-enhancer';
import {JOBS, SIGN_IN_PATH} from '../../../shared/constants/paths';
import LocationIcon from '../../../shared/library/icons/location-icon.svg';
import BookmarkBlue from '../../../shared/library/icons/bookmarked-blue.svg';
import {TARMAC} from '../../../shared/style/colors';
import {CurrentUserContext} from '../../../shared/enhancers/current-user-enhancer';
import MenuPopover from '../../../shared/library/popovers/menu';
import {EDIT_PROFILE, SETTINGS_ICONS, SETTINGS_LABELS} from '../../../shared/constants/settings';
import {redirectTo} from '../../../shared/utils/navigation';
import {
  useSendAnalyticsEvent,
  withSendAnalyticsEvent
} from '../../../shared/enhancers/analytics-enhancer';
import {PHONE} from '../../../shared/style/breakpoints';
import {JobsContext} from '../enhancers/jobs';
import {
  AvatarContainer,
  Bookmarks,
  Container,
  Location,
  MetaData,
  UserPositionDetails
} from './shared/styles';
import UserDetailsLoader from './loaders/user-details';
import {JOBS_CLICK_MENUOPTION, VIEW_BOOKMARKED_JOBS} from '../constants/analytics';

const Name = glamorous(BigTitle)({
  margin: '10px 0'
});

const MenuContainer = glamorous.div({
  marginLeft: 30,
  [PHONE]: {
    position: 'absolute',
    top: -10,
    right: 20
  }
});

const LocationSvg = glamorous(LocationIcon)({
  marginRight: 5,
  '> g': {
    stroke: TARMAC
  }
});

const CreateProfile = glamorous(Simple)({
  height: 45,
  width: '100%'
});

const BookmarkIcon = glamorous(BookmarkBlue)({
  marginRight: 5
});

const UserDetails = () => {
  const currentUser = useContext(CurrentUserContext);
  const navigate = useContext(NavigationContext);
  const jobsContext = useContext(JobsContext);
  const sendAnalyticsEvent = useSendAnalyticsEvent();
  const bookmarkedJobsCount = jobsContext.currentUserLoaded && currentUser.bookmarkedJobs.count;

  const handleMenuClick = option => {
    sendAnalyticsEvent(JOBS_CLICK_MENUOPTION, {optionName: option});
    switch (option) {
      case EDIT_PROFILE:
        redirectTo(`/signup/info`);
        break;
    }
  };

  const onBookmarkClick = () => {
    jobsContext.setBookmarkSearch(true);
    navigate(JOBS);
    jobsContext.setTerms([]);
    sendAnalyticsEvent(VIEW_BOOKMARKED_JOBS, {count: bookmarkedJobsCount});
  };

  const allMenuOptions = [EDIT_PROFILE].map(setting => ({
    id: setting,
    label: SETTINGS_LABELS[setting],
    icon: SETTINGS_ICONS[setting]
  }));

  if (!jobsContext.currentUserLoaded && currentUser) {
    return <UserDetailsLoader />;
  }

  return (
    <Container>
      <AvatarContainer>
        <Avatar user={currentUser} size={70} />
        {currentUser && (
          <MenuContainer>
            <MenuPopover options={allMenuOptions} onClick={handleMenuClick} />
          </MenuContainer>
        )}
      </AvatarContainer>
      <Name>{currentUser ? currentUser.displayName : 'Job Seeker'}</Name>
      {!currentUser && (
        <CreateProfile onClick={() => navigate(SIGN_IN_PATH)}>Create my profile now</CreateProfile>
      )}
      {currentUser && (
        <MetaData>
          {currentUser.title && (
            <UserPositionDetails>
              <Text>{currentUser.title ? currentUser.title : ''}</Text>
              {currentUser.companyName && <Text> at </Text>}
              {currentUser.companyName ? currentUser.companyName : ''}
            </UserPositionDetails>
          )}
          {currentUser.location && (
            <Location>
              <LocationSvg />
              <Text>{currentUser.location}</Text>
            </Location>
          )}
          <Bookmarks
            onClick={() => {
              onBookmarkClick();
            }}
            title={`${currentUser.displayName}'s Job Bookmarks`}
          >
            <BookmarkIcon />
            <span>
              {bookmarkedJobsCount !== 0
                ? `${bookmarkedJobsCount} bookmarked jobs`
                : `0 bookmarked jobs`}
            </span>
          </Bookmarks>
        </MetaData>
      )}
    </Container>
  );
};

export default withSendAnalyticsEvent(UserDetails);
