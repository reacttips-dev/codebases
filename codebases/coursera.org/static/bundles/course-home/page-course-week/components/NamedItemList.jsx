import PropTypes from 'prop-types';
import React from 'react';
import ItemMetadata from 'pages/open-course/common/models/itemMetadata';
import WeekItem from 'bundles/learner-progress/components/item/week/WeekItem';
import 'css!./__styles__/NamedItemList';

/**
 * A list of items with a name and an optional description. Can be used to display a lesson or an item group choice.
 */
class NamedItemList extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    itemMetadatas: PropTypes.arrayOf(PropTypes.instanceOf(ItemMetadata)).isRequired,
  };

  render() {
    const { name, description, itemMetadatas } = this.props;

    return (
      <div className="rc-NamedItemList">
        <div className="horizontal-box named-item-list-title">
          <h3 className="flex-1 align-self-center card-headline-text">{name}</h3>
        </div>

        {!!description && <div className="named-item-list-description">{description}</div>}

        <ul>
          {itemMetadatas.map((itemMetadata) => {
            return (
              <li key={itemMetadata.get('id')}>
                <WeekItem key={itemMetadata.get('id')} itemMetadata={itemMetadata} />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
export default NamedItemList;
