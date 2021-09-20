import { Link } from 'react-router';
import { __ } from 'services/localization-service';
import styles from './_nav.scss';
import { trackInitialPageLoad } from 'helpers/performance-helper';

var ACTIVE = {
  background: '#018377',
  color: '#fff',
};

@cssModule(styles)
export default class SettingsNav extends React.Component {
  static displayName = 'setting-container/_nav';

  componentDidMount() {
    trackInitialPageLoad('settings');
  }

  _createNavLink = (title, name, options = {}) => {
    let badge;

    if (options && options.badgeText) {
      badge = <span styleName="badge-text">{options.badgeText}</span>;
    }

    return (
      <li styleName="submenu-container">
        <Link
          to={`/settings/${name}`}
          activeStyle={ACTIVE}
          styleName="submenu-link"
        >
          {title} {badge}
        </Link>
      </li>
    );
  };

  _renderSubscriptions = () => {
    return this._createNavLink(__('Subscriptions & Billing'), 'subscriptions');
  };

  render() {
    return (
      <nav aria-label="Settings Navigation">
        <h2 styleName="submenu-header" className="hidden-xs">
          {__('Account')}
        </h2>
        <ul styleName="submenu-wrapper">
          {this._createNavLink(__('Personal Information'), 'personal-info')}
          {this._createNavLink(__('Password'), 'password')}
          {this._createNavLink(__('Notifications'), 'notifications')}
          {this._createNavLink(__('Linked Accounts'), 'linked-accounts')}
          {this._createNavLink(
            __('Language Preference'),
            'language-preference'
          )}
        </ul>
        <h2 styleName="submenu-header-second" className="hidden-xs">
          {__('Enrollment')}
        </h2>
        <ul styleName="submenu-wrapper">
          {this._renderSubscriptions()}
          {this._createNavLink(__('Courses'), 'courses')}
        </ul>
      </nav>
    );
  }
}
