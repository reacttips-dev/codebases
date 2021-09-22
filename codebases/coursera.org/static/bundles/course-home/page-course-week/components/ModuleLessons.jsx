import PropTypes from 'prop-types';
import React from 'react';
import _ from 'underscore';
import LessonCollectionBody from 'bundles/course-home/page-course-week/components/LessonCollectionBody';
import LessonCollectionHeader from 'bundles/course-home/page-course-week/components/LessonCollectionHeader';
import Lesson from 'pages/open-course/common/models/lesson';
import ItemMetadata from 'pages/open-course/common/models/itemMetadata';

export default class ModuleLessons extends React.Component {
  static propTypes = {
    lessons: PropTypes.arrayOf(PropTypes.instanceOf(Lesson)).isRequired,
    isNextItemChoiceStarted: PropTypes.bool.isRequired,
    isNextItemLessonStarted: PropTypes.bool.isRequired,
    nextItemMetadata: PropTypes.instanceOf(ItemMetadata),
  };

  render() {
    // We display consecutive non-item-group lessons from the same track together in one card. Collect them together
    // so that we can do this.
    const collectedLessons = _(this.props.lessons)
      .chain()
      .map((lesson) => {
        if (lesson.isItemGroupLesson()) {
          return {
            itemGroup: lesson.getItemGroups().at(0),
            trackId: lesson.getTrackId(),
          };
        } else {
          return { lessons: [lesson], trackId: lesson.getTrackId() };
        }
      })
      .reduce((collections, nextCollection) => {
        if (collections.length === 0) {
          return [nextCollection];
        }

        // Combine collections when they're both collections of non-item-group lessons from the same track.
        const previousCollection = collections[collections.length - 1];
        if (
          previousCollection.lessons &&
          nextCollection.lessons &&
          previousCollection.trackId === nextCollection.trackId
        ) {
          return collections.slice(0, collections.length - 1).concat([
            {
              lessons: previousCollection.lessons.concat(nextCollection.lessons),
              trackId: previousCollection.trackId,
            },
          ]);
        }

        // Otherwise do not combine the collections.
        return collections.concat([nextCollection]);
      }, [])
      .value();

    return (
      <div className="rc-ModuleLessons" data-elementtiming="ondemand.week-module-lessons">
        {collectedLessons.map((collection, index) => (
          <div className="od-section" key={index}>
            <LessonCollectionHeader
              trackId={collection.trackId}
              itemGroup={collection.itemGroup}
              isNextItemChoiceStarted={this.props.isNextItemChoiceStarted}
              isNextItemLessonStarted={this.props.isNextItemLessonStarted}
              nextItemMetadata={this.props.nextItemMetadata}
            />
            <LessonCollectionBody
              itemGroup={collection.itemGroup}
              lessons={collection.lessons}
              isNextItemChoiceStarted={this.props.isNextItemChoiceStarted}
              isNextItemLessonStarted={this.props.isNextItemLessonStarted}
              nextItemMetadata={this.props.nextItemMetadata}
            />
          </div>
        ))}
      </div>
    );
  }
}
