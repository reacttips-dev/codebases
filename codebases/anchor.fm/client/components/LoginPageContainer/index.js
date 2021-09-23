import { connect } from 'react-redux';
import queryString from 'query-string';
import { LoginPage } from '../LoginPage';
import { MENU_MODE } from '../../user';

const getFeedUrlFromLocation = location => {
  const { feedUrl } = queryString.parse(location.search);

  return feedUrl ? decodeURIComponent(feedUrl) : null;
};

const mapStateToProps = (
  { user: { menuMode: menuModeFromUser } },
  { location }
) => {
  const { menuMode: menuModeParam } = queryString.parse(location.search);
  const menuMode = MENU_MODE[menuModeParam] || menuModeFromUser;

  return {
    feedUrl: getFeedUrlFromLocation(location),
    menuMode,
  };
};

export default connect(mapStateToProps)(LoginPage);
