import React from 'react';
import PropTypes from 'prop-types';
import type { InjectedRouter } from 'js/lib/connectToRouter';
import connectToRouter from 'js/lib/connectToRouter';

import user from 'js/lib/user';
import Icon from 'bundles/iconfont/Icon';
import { progressCompleted } from 'pages/open-course/common/constants';

import { saveProgressToLocalStorage, updateProgress } from 'bundles/ondemand/actions/ProgressActions';

import supplementProgressApiUtils from 'bundles/item-reading/utils/supplementProgressApi';

/* eslint-disable no-restricted-imports */
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
/* eslint-enable no-restricted-imports */

import _t from 'i18n!nls/item-reading';

import 'css!./__styles__/ReadingCompleteButton';

type Props = {
  isComplete: boolean;
  itemId: string;
  courseId: string;
  courseSlug: string;
  nextItem?: ItemMetadata;
  router: InjectedRouter;
  courseProgress: any;
};

class ReadingCompleteButton extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
    executeAction: PropTypes.func.isRequired,
  };

  markComplete = () => {
    // Since the learner progress API is asynchronous and eventual consistency,
    // we cannot use a simple "call API -> get response and update model"
    // pattern. Instead, we optimistically set progress in-memory, and update
    // through the API in the background.
    //
    // If the learner moves to another page, the item progress has been updated
    // in-memory. If the learner refreshes, hopefully the progress API will
    // have finished updating and their new progress will be loaded.
    const { executeAction } = this.context;
    const { itemId, courseId, courseProgress } = this.props;

    // optimistically set reading progress to completed in-memory
    const itemProgress = courseProgress.getItemProgress(itemId);
    itemProgress.setState(progressCompleted);

    // in-memory refresh the store so that components update with the
    // new item progress
    executeAction(updateProgress, { courseProgress });

    saveProgressToLocalStorage(courseProgress.get('id'), courseProgress);

    // submit an API call to update progress in the background
    supplementProgressApiUtils.markComplete(itemId, courseId, user.get().id).done();
  };

  goToNextItem = () => {
    const { nextItem, router } = this.props;

    if (nextItem) {
      router.push(nextItem.getLink());
    }
  };

  render() {
    const { isComplete, nextItem } = this.props;
    return (
      <div className="rc-ReadingCompleteButton horizontal-box align-items-right">
        {isComplete ? (
          <div className="completed">
            <Icon name="checkmark" className="color-success-dark" />
            &nbsp;
            {_t('Complete')}
            {!!nextItem && (
              <button className="primary next-item" type="submit" onClick={this.goToNextItem}>
                {_t('Go to next item')}
              </button>
            )}
          </div>
        ) : (
          <button className="primary mark-complete" type="submit" onClick={this.markComplete}>
            {_t('Mark as completed')}
          </button>
        )}
      </div>
    );
  }
}

export default connectToRouter<Props, Omit<Props, 'router'>>((router) => ({
  router,
}))(ReadingCompleteButton);
