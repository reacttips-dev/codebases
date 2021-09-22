import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { TrackedLink2 } from 'bundles/page/components/TrackedLink2';
import ItemGroupMessage from 'bundles/ondemand/components/lessonMessages/ItemGroupMessage';
import PlainHonorsLessonsMessage from 'bundles/ondemand/components/lessonMessages/PlainHonorsLessonsMessage';
import ItemGroup from 'pages/open-course/common/models/itemGroup';
import ItemMetadata from 'pages/open-course/common/models/itemMetadata';
import { CORE_TRACK, HONORS_TRACK } from 'pages/open-course/common/models/tracks';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import _t from 'i18n!nls/course-home';
import 'css!./__styles__/LessonCollectionHeader';

class ItemGroupHeader extends React.Component {
  static propTypes = {
    trackId: PropTypes.oneOf([CORE_TRACK, HONORS_TRACK]).isRequired,
    itemGroup: PropTypes.instanceOf(ItemGroup),
    passedChoicesCount: PropTypes.number.isRequired,
    isItemGroupPassed: PropTypes.bool.isRequired,
    isNextItemChoiceStarted: PropTypes.bool.isRequired,
    isNextItemLessonStarted: PropTypes.bool.isRequired,
    nextItemMetadata: PropTypes.instanceOf(ItemMetadata),
  };

  render() {
    const { trackId, itemGroup, passedChoicesCount, isItemGroupPassed, isNextItemChoiceStarted } = this.props;
    const { isNextItemLessonStarted, nextItemMetadata } = this.props;

    const classNames = classnames([
      'nostyle',
      'rc-LessonCollectionHeader',
      'horizontal-box',
      'align-items-vertical-center',
      'card-rich-interaction',
      this.props.isItemGroupPassed ? 'lesson-collection-passed' : 'lesson-collection-not-passed',
    ]);

    return (
      <TrackedLink2 trackingName="lesson_collection_header" href={itemGroup.getLink()} className={classNames}>
        <ItemGroupMessage
          passedChoicesCount={passedChoicesCount}
          isItemGroupPassed={isItemGroupPassed}
          requiredPassedCount={itemGroup.getRequiredPassedCount()}
          choicesCount={itemGroup.getChoicesCount()}
          trackId={trackId}
        />

        {!!nextItemMetadata &&
          nextItemMetadata.getLessonId() === itemGroup.getLesson().getId() &&
          !isNextItemChoiceStarted && (
            <div className="flex-1 od-lesson-collection-header-button">
              <button className="primary">{isNextItemLessonStarted ? _t('Resume') : _t('Start')}</button>
            </div>
          )}
      </TrackedLink2>
    );
  }
}

class PlainHonorsLessonsHeader extends React.Component {
  render() {
    const classNames = classnames([
      'rc-LessonCollectionHeader',
      'horizontal-box',
      'align-items-vertical-center',
      'card-no-action',
      'lesson-collection-passing-irrelevant',
    ]);

    return (
      <div className={classNames}>
        <PlainHonorsLessonsMessage />
      </div>
    );
  }
}

/**
 * A header that appears above a <LessonCollectionBody> that explains to you if the collection is a group or if the
 * collection is a collection of honors lessons.
 */
class LessonCollectionHeader extends React.Component {
  static propTypes = {
    itemGroup: PropTypes.instanceOf(ItemGroup),
    isItemGroupPassed: PropTypes.bool,
    passedChoicesCount: PropTypes.number,
    trackId: PropTypes.oneOf([CORE_TRACK, HONORS_TRACK]).isRequired,
    isNextItemChoiceStarted: PropTypes.bool.isRequired,
    isNextItemLessonStarted: PropTypes.bool.isRequired,
    nextItemMetadata: PropTypes.instanceOf(ItemMetadata),
  };

  render() {
    const { itemGroup, passedChoicesCount, isItemGroupPassed, trackId, isNextItemChoiceStarted } = this.props;
    const { isNextItemLessonStarted, nextItemMetadata } = this.props;

    if (itemGroup) {
      return (
        <ItemGroupHeader
          trackId={trackId}
          itemGroup={itemGroup}
          passedChoicesCount={passedChoicesCount}
          isItemGroupPassed={isItemGroupPassed}
          isNextItemChoiceStarted={isNextItemChoiceStarted}
          isNextItemLessonStarted={isNextItemLessonStarted}
          nextItemMetadata={nextItemMetadata}
        />
      );
    } else if (trackId === HONORS_TRACK) {
      return <PlainHonorsLessonsHeader />;
    } else {
      return false;
    }
  }
}

export default connectToStores(LessonCollectionHeader, ['CourseViewGradeStore'], ({ CourseViewGradeStore }, props) => {
  const { itemGroup } = props;
  const isItemGroupPassed = itemGroup && CourseViewGradeStore.isItemGroupPassed(itemGroup.getId());
  const passedChoicesCount = itemGroup && CourseViewGradeStore.getItemGroupOverallPassedCount(itemGroup.getId());
  return {
    passedChoicesCount,
    isItemGroupPassed,
    ...props,
  };
});

export const BaseComponent = LessonCollectionHeader;
