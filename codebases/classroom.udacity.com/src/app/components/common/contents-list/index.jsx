import Item, { ItemTypes, scrollTargetId } from './_item';

import PropTypes from 'prop-types';
import styles from './index.scss';
import withScrollIntoView from 'decorators/scroll-into-view';

export { ItemTypes };

@cssModule(styles)
export class ContentsList extends React.Component {
  static displayName = 'contents-list';

  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        ..._.omit(Item.propTypes, 'id'),
        key: PropTypes.string.isRequired,
      })
    ).isRequired,
    scrollIdIntoView: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { items, scrollIdIntoView } = this.props;
    const selectedItem = _.find(items, 'isSelected');

    if (selectedItem) {
      scrollIdIntoView(scrollTargetId(selectedItem.key));
    }
  }

  _renderItems() {
    return _.map(this.props.items, ({ key, title, ...item }, idx) => (
      <Item key={key} id={key} title={`${idx + 1}. ${title}`} {...item} />
    ));
  }

  render() {
    return <ol styleName="contents-list">{this._renderItems()}</ol>;
  }
}

export default withScrollIntoView(ContentsList);
