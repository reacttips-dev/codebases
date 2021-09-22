import PropTypes from 'prop-types';
import React from 'react';
import NamedItemList from 'bundles/course-home/page-course-week/components/NamedItemList';
import Lesson from 'pages/open-course/common/models/lesson';
import ItemGroup from 'pages/open-course/common/models/itemGroup';
import ItemMetadata from 'pages/open-course/common/models/itemMetadata';
import 'css!./__styles__/LessonCollectionBody';

class ItemGroupLessonCollectionBody extends React.Component {
  static propTypes = {
    itemGroup: PropTypes.instanceOf(ItemGroup),
  };

  render() {
    const { itemGroup } = this.props;
    return (
      <div className="card-rich-interaction od-lesson-collection-container">
        {itemGroup.getChoices().map((choice, index) => {
          return (
            <div className="od-lesson-collection-element" key={choice.getId()}>
              <NamedItemList
                name={`${index + 1}. ${choice.getName()}`}
                description={choice.getDescription()}
                itemMetadatas={choice.getItemMetadatas().toArray()}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

class PlainLessonCollectionBody extends React.Component {
  static propTypes = {
    lessons: PropTypes.arrayOf(PropTypes.instanceOf(Lesson)),
  };

  render() {
    const { lessons } = this.props;
    return (
      <div className="card-rich-interaction od-lesson-collection-container">
        {lessons.map((lesson) => {
          return (
            <div className="od-lesson-collection-element" key={lesson.getId()}>
              <NamedItemList name={lesson.getName()} itemMetadatas={lesson.getItemMetadatas().toArray()} />
            </div>
          );
        })}
      </div>
    );
  }
}

/**
 * A LessonCollection is either a single item group, or a list of non-item-group lessons.
 */
class LessonCollectionBody extends React.Component {
  static propTypes = {
    itemGroup: PropTypes.instanceOf(ItemGroup),
    lessons: PropTypes.arrayOf(PropTypes.instanceOf(Lesson)),
    isNextItemChoiceStarted: PropTypes.bool.isRequired,
    isNextItemLessonStarted: PropTypes.bool.isRequired,
    nextItemMetadata: PropTypes.instanceOf(ItemMetadata),
  };

  render() {
    const { itemGroup, lessons } = this.props;
    return (
      <div className="rc-LessonCollectionBody">
        {itemGroup && (
          <ItemGroupLessonCollectionBody
            itemGroup={itemGroup}
            isNextItemChoiceStarted={this.props.isNextItemChoiceStarted}
            nextItemMetadata={this.props.nextItemMetadata}
          />
        )}
        {lessons && (
          <PlainLessonCollectionBody
            lessons={lessons}
            isNextItemLessonStarted={this.props.isNextItemLessonStarted}
            nextItemMetadata={this.props.nextItemMetadata}
          />
        )}
      </div>
    );
  }
}

export default LessonCollectionBody;
