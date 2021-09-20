import { CLASSROOM_CTA_CLICKED } from 'constants/analytics';
import { IconCaretDown } from '@udacity/veritas-icons';
import PropTypes from 'prop-types';
import TrackingLink from 'components/common/tracking-link';
import { __ } from 'services/localization-service';
import styles from './_tabs.scss';

@cssModule(styles)
class Tab extends React.Component {
  static displayName = 'common/tabs/_tab';
  static propTypes = {
    children: PropTypes.node,
    id: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    trackingOptions: PropTypes.object,
    trackingEventName: PropTypes.string,

    // From Tabs (clone element)
    isSelected: PropTypes.bool,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    isSelected: false,
    onClick: _.noop,
  };

  handleClick = (evt) => {
    const { id, onClick } = this.props;
    onClick(id, evt);
  };

  render() {
    const {
      children,
      isSelected,
      path,
      trackingEventName,
      trackingOptions,
    } = this.props;

    return (
      <li styleName={isSelected ? 'selected' : ''}>
        <TrackingLink
          onClick={this.handleClick}
          to={path}
          trackingEventName={trackingEventName || CLASSROOM_CTA_CLICKED}
          trackingOptions={trackingOptions}
        >
          {children}
          {isSelected ? (
            <span styleName="mobile-expand">
              <IconCaretDown size="sm" title={__('Expand')} color="cerulean" />
            </span>
          ) : null}
        </TrackingLink>
      </li>
    );
  }
}

export default Tab;
