import ClassroomPropTypes from 'components/prop-types';
import { IconPin } from '@udacity/veritas-icons';
import PurchaseCohortButton from 'components/nanodegree-dashboard/overview/purchase-cohort-button';
import Responsive from 'components/common/responsive';
import { __ } from 'services/localization-service';
import styles from './static-content-notification-bar.scss';

@cssModule(styles)
export default class StaticContentNotificationBar extends React.Component {
  static displayName = 'common/static-content-notification-bar';
  static contextTypes = {
    nanodegree: ClassroomPropTypes.nanodegree.isRequired,
  };

  _renderPurchaseCohortButton() {
    const { nanodegree } = this.context;

    return (
      !nanodegree.is_graduated && (
        <PurchaseCohortButton
          ndKey={nanodegree.key}
          label={__('Re-enroll')}
          trackingEventName="Static Content Re-enroll Clicked"
          variant="minimal"
        />
      )
    );
  }

  render() {
    return (
      <div styleName="notification-bar">
        <div styleName="notification-content">
          <div>
            <Responsive type="from-tablet">
              <IconPin />{' '}
            </Responsive>
            <p>
              {__(
                'You are not enrolled. You only have access to view our material.'
              )}{' '}
              <a
                href={__(
                  'https://udacity.zendesk.com/hc/en-us/articles/360015665011-How-long-will-I-have-access-to-Nanodegree-program-content-after-I-graduate-'
                )}
                target="_blank"
              >
                {__('Learn more about content access')}
              </a>
            </p>
          </div>
          {this._renderPurchaseCohortButton()}
        </div>
      </div>
    );
  }
}
