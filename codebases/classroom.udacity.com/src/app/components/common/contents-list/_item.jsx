import {
  IconCheck,
  IconCircleFull,
  IconStarFull,
} from '@udacity/veritas-icons';
import PropTypes from 'prop-types';
import TrackingLink from 'components/common/tracking-link';
import styles from './_item.scss';

export const ItemTypes = {
  STAR: 'star',
  CIRCLE: 'circle',
  CHECK: 'check',
};

const iconsByType = {
  [ItemTypes.CHECK]: <IconCheck size="sm" />,
  [ItemTypes.CIRCLE]: <IconCircleFull size="sm" />,
  [ItemTypes.STAR]: <IconStarFull size="sm" />,
};

export function scrollTargetId(id) {
  return `contents-list-scroll-target-${id}`;
}

@cssModule(styles)
export default class Item extends React.Component {
  static displayName = 'contents-list/_item';

  static propTypes = {
    id: PropTypes.string.isRequired,
    isSelected: PropTypes.bool,
    path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(_.values(ItemTypes)).isRequired,
  };

  _renderWaypoint() {
    const { type } = this.props;

    return (
      <span className={styles[`waypoint-${type}`]}>{iconsByType[type]}</span>
    );
  }

  render() {
    const { id, isSelected, title, path } = this.props;

    return (
      <li
        styleName={isSelected ? 'item-selected' : 'item'}
        id={scrollTargetId(id)}
      >
        <TrackingLink
          to={path}
          title={title}
          trackingEventName="Learning Nav Clicked"
        >
          {this._renderWaypoint()} {title}
        </TrackingLink>
      </li>
    );
  }
}
