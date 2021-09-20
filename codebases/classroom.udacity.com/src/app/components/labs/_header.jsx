import ButtonLink from 'components/common/button-link';
import ClassroomPropTypes from 'components/prop-types';
import { Icon } from '@udacity/veritas-components';
import { IconCheck } from '@udacity/veritas-icons';
import IconUdacity from 'images/icons/udacity.svg';
import LabHelper from 'helpers/lab-helper';
import NodeHelper from 'helpers/node-helper';
import PropTypes from 'prop-types';
import StaticContentNotificationBar from 'components/common/static-content-notification-bar';
import StaticContentPlaceholder from 'components/common/static-content-placeholder';
import Svg from 'react-inlinesvg';
import Tabs from './_lab-tabs';
import { __ } from 'services/localization-service';
import styles from './_header.scss';

@cssModule(styles)
export class NavHeader extends React.Component {
  static displayName = 'components/labs/_header/nav-header';

  static propTypes = {
    title: PropTypes.string.isRequired,
    partPath: PropTypes.string.isRequired,
    lab: ClassroomPropTypes.lab.isRequired,
    selectedTabId: PropTypes.string.isRequired,
  };

  render() {
    const { lab, selectedTabId, partPath } = this.props;

    return (
      <div styleName="nav-bar">
        <div styleName="nav-info">
          <div styleName="logo">
            <div styleName="udacity-logo-holder">
              <Icon size="lg" title={__('Udacity')}>
                <Svg src={IconUdacity} />
              </Icon>
            </div>
            <h2 styleName="labs-header-text">{__('Lab')}</h2>
          </div>
          <div styleName="tabs">
            <Tabs lab={lab} selectedTabId={selectedTabId} />
          </div>
          <ButtonLink
            trackingEventName="CTA Clicked"
            small
            variant="minimal"
            label={__('Back to Lessons')}
            to={partPath}
          />
        </div>
      </div>
    );
  }
}

export class TabsHeaderComponent extends React.Component {
  static displayName = 'components/labs/_header/tabs-header';

  static propTypes = {
    lab: ClassroomPropTypes.lab.isRequired,
    part: ClassroomPropTypes.part.isRequired,
  };

  render() {
    const { lab } = this.props;

    return (
      <div styleName="header-container">
        <div styleName="title-container">
          <h1 styleName="title">{NodeHelper.getTitle(lab)}</h1>
          {LabHelper.isPassed(lab) && LabHelper.reviewCompleted(lab) ? (
            <div styleName="tag">
              <IconCheck title={__('Checkmark')} size="sm" />
              {__('Completed')}
            </div>
          ) : null}
        </div>
        <StaticContentPlaceholder
          placeholder={
            <div className={styles['notification-bar']}>
              <div className={styles['notification']}>
                <StaticContentNotificationBar />
              </div>
            </div>
          }
        />
      </div>
    );

    return null;
  }
}

export const TabsHeader = cssModule(TabsHeaderComponent, styles);
