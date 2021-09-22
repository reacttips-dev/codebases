import React from 'react';
import user from 'js/lib/user';

import type { Item } from 'bundles/learner-progress/types/Item';

import ItemBox from 'bundles/item/components/ItemBox';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import supplementData from 'pages/open-course/data/supplementData';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import LoadingIndicator from 'bundles/item/components/LoadingIndicator';
import CML from 'bundles/cml/components/CML';
import CMLVariableNames from 'bundles/cml/constants/CMLVariableNames';

/* eslint-disable no-restricted-imports */
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import type CourseMaterials from 'pages/open-course/common/models/courseMaterials';
/* eslint-enable no-restricted-imports */

import ReadingCompleteButton from 'bundles/item-reading/components/ReadingCompleteButton';
import { compose } from 'recompose';

import type { CmlContent } from 'bundles/cml/types/Content';
import { H2, Divider } from '@coursera/coursera-ui';

import { beginsWithHeadingLevel1 } from 'bundles/cml/utils/CMLUtils';

type InputProps = {
  itemMetadata: ItemMetadata;
  computedItem: Item;
};

type Props = InputProps & {
  courseId: string;
  courseSlug: string;
  courseMaterials: CourseMaterials;
  courseProgress: any;
};

type State = {
  readingCml: CmlContent | null;
};

class ReadingItem extends React.Component<Props, State> {
  state: State = {
    readingCml: null,
  };

  componentDidMount() {
    const { computedItem, courseId, courseSlug } = this.props;
    const { id: itemId } = computedItem;

    supplementData({ itemId, courseId, courseSlug }).then((readingCml: $TSFixMe) => {
      this.setState({ readingCml });
    });
  }

  renderTitle() {
    const { computedItem } = this.props;
    const { readingCml } = this.state;

    if (!readingCml) {
      return null;
    }

    if (beginsWithHeadingLevel1(readingCml)) {
      // skip rendering title when CMl already begins with an H1 - assumption is the H1 is the title.
      return null;
    }

    return (
      <div className="reading-title">
        <H2 tag="h1" rootClassName="reading-header m-b-1s">
          {computedItem.name}
        </H2>
        <Divider style={{ marginBottom: 24 }} />
      </div>
    );
  }

  render() {
    const { computedItem, courseId, courseSlug, itemMetadata, courseMaterials, courseProgress } = this.props;
    const { readingCml } = this.state;

    const { NAME, USER_ID } = CMLVariableNames;

    const nextItemMetadataOrItemGroup = courseMaterials?.getNeighbors(itemMetadata)?.nextItemMetadataOrItemGroup;

    return (
      <ItemBox className="rc-ReadingItem" feedbackType="reading" computedItem={computedItem} courseId={courseId}>
        {readingCml ? (
          <div>
            {this.renderTitle()}
            <CML
              cml={readingCml}
              shouldApplyTracking
              variableData={{ [NAME]: user.get().fullName, [USER_ID]: user.get().id }}
            />

            <ReadingCompleteButton
              courseId={courseId}
              courseSlug={courseSlug}
              itemId={computedItem.id}
              isComplete={computedItem.isCompleted}
              nextItem={nextItemMetadataOrItemGroup}
              courseProgress={courseProgress}
            />
          </div>
        ) : (
          <LoadingIndicator />
        )}
      </ItemBox>
    );
  }
}
// TODO: connectToStores<Props, InputProps, Stores>
export default compose<Props, InputProps>(
  connectToStores<Props, InputProps>(['CourseStore', 'ProgressStore'], ({ CourseStore, ProgressStore }) => ({
    courseId: CourseStore.getCourseId(),
    courseSlug: CourseStore.getCourseSlug(),
    courseMaterials: CourseStore.getMaterials(),
    courseProgress: ProgressStore.courseProgress,
  }))
)(ReadingItem);
