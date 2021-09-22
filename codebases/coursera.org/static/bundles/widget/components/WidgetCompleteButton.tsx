import React from 'react';
import { Button } from '@coursera/coursera-ui';
import Icon from 'bundles/iconfont/Icon';
import type { InjectedRouter } from 'js/lib/connectToRouter';
import connectToRouter from 'js/lib/connectToRouter';

import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';

import _t from 'i18n!nls/widget';
import 'css!./__styles__/WidgetCompleteButton';

type Props = {
  isComplete: boolean;
  markComplete: () => void;
  nextItem?: ItemMetadata;
  router: InjectedRouter;
};

class WidgetCompleteButton extends React.Component<Props> {
  goToNextItem = () => {
    const { nextItem, router } = this.props;

    if (nextItem) {
      router.push(nextItem.getLink());
    }
  };

  render() {
    const { isComplete, markComplete, nextItem } = this.props;

    return (
      <div className="rc-WidgetCompleteButton horizontal-box align-items-right">
        {isComplete ? (
          <div className="completed">
            <Icon name="checkmark" className="color-success-dark" />
            &nbsp;
            {_t('Complete')}
            {!!nextItem && (
              <Button
                type="primary"
                rootClassName="next-item"
                size="sm"
                label={_t('Go to next item')}
                onClick={this.goToNextItem}
                htmlAttributes={{ type: 'submit' }}
              />
            )}
          </div>
        ) : (
          <button type="button" className="primary mark-complete" onClick={markComplete}>
            {_t('Mark as completed')}
          </button>
        )}
      </div>
    );
  }
}

export default connectToRouter<Props, Omit<Props, 'router'>>((router) => ({
  router,
}))(WidgetCompleteButton);
