import { Checkbox, Tooltip } from '@udacity/veritas-components';
import { IconChecked, IconWarning } from '@udacity/veritas-icons';

import { NotificationPreferencePropType } from 'services/notification-preferences-api-service';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './_notification-settings-card.scss';

@cssModule(styles)
export class NotificationSettingsCardContent extends React.Component {
  static displayName = 'settings/notification-settings-card-content';

  static propTypes = {
    group: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
    includeEmail: PropTypes.bool,
    includePhone: PropTypes.bool,
    isPhoneNumberVerified: PropTypes.bool.isRequired,
    settings: NotificationPreferencePropType.isRequired,
    skipPhoneVerification: PropTypes.bool,
    subtitle: PropTypes.string,
    title: PropTypes.string,
  };

  static defaultProps = {
    settings: {},
  };

  render() {
    const {
      group,
      includeEmail = true,
      includePhone = false,
      skipPhoneVerification = false,
      isPhoneNumberVerified,
      settings,
      handleChange,
      title,
      subtitle,
    } = this.props;

    const showToolTip = !skipPhoneVerification && !isPhoneNumberVerified;

    return (
      <dl styleName={includePhone ? 'wide' : null}>
        <div styleName="title">
          <dt styleName={!title ? 'hide-title' : null}>
            {title ? title : __('Delivery Method:')}
            {subtitle && <div styleName="subtitle">{subtitle}</div>}
          </dt>
        </div>
        <div styleName="options">
          {includePhone && (
            <dd>
              <Checkbox
                label={__('Phone call')}
                id={`${group}-delivery-phone`}
                checked={_.get(settings, 'phone')}
                disabled={!skipPhoneVerification && !isPhoneNumberVerified}
                onChange={_.partial(handleChange, 'phone')}
              />
            </dd>
          )}
          {includeEmail && (
            <dd>
              <Checkbox
                label={__('Email')}
                id={`${group}-delivery-email`}
                checked={_.get(settings, 'email')}
                onChange={_.partial(handleChange, 'email')}
              />
            </dd>
          )}
          <dd>
            <Checkbox
              label={__('SMS')}
              id={`${group}-delivery-sms`}
              checked={_.get(settings, 'sms')}
              disabled={!skipPhoneVerification && !isPhoneNumberVerified}
              onChange={_.partial(handleChange, 'sms')}
            />
            {showToolTip && (
              <Tooltip
                trigger={<IconWarning size="md" color="orange" />}
                direction="end"
                content={__('Phone number is missing and/or unverified.')}
              />
            )}
          </dd>
        </div>
      </dl>
    );
  }
}

@cssModule(styles)
export class NotificationSettingsCard extends React.Component {
  static displayName = 'settings/notification-settings-card';

  static propTypes = {
    children: PropTypes.node,
    image: PropTypes.string.isRequired,
    isSaving: PropTypes.bool.isRequired,
    subtitle: PropTypes.string.isRequired,
    subsubtitle: PropTypes.element,
    title: PropTypes.string.isRequired,
  };

  state = {
    justSaved: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.isSaving && !this.props.isSaving) {
      this.setState({ justSaved: true });

      setTimeout(() => {
        this.setState({ justSaved: false });
      }, 1000);
    }
  }

  render() {
    const {
      children,
      image,
      isSaving,
      subsubtitle,
      subtitle,
      title,
    } = this.props;
    const { justSaved } = this.state;

    return (
      <li styleName="item-active">
        <div styleName="item-header">
          {isSaving && (
            <div styleName="saving-notice">
              <IconChecked size="md" color="orange" />
              {__('Saving...')}
            </div>
          )}
          {justSaved && (
            <div styleName="saved-notice">
              <IconChecked size="md" color="green" />
              {__('Saved!')}
            </div>
          )}

          <div styleName="item-title">
            <span style={{ backgroundImage: `url(${image})` }}>{title}</span>
            <div styleName="title-text">
              <h2>{title}</h2>
              <p>{subtitle}</p>
              {subsubtitle && <p styleName="subsubtitle">{subsubtitle}</p>}
            </div>
          </div>
        </div>
        <div styleName="item-footer">{children}</div>
      </li>
    );
  }
}
