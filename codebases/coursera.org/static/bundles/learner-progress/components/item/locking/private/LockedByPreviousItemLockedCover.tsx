import PropTypes from 'prop-types';
import React from 'react';
import { Box } from '@coursera/coursera-ui';

import LockIcon from 'bundles/learner-progress/components/item/locking/private/LockIcon';
import LockMessage from 'bundles/learner-progress/components/item/locking/private/LockMessage';

import { Item } from 'bundles/learner-progress/types/Item';

import _t from 'i18n!nls/learner-progress';

type Props = {
  computedItem: Item;
};

class LockedByPreviousItemLockedCover extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  handleClick = () => {
    const {
      computedItem: { lockedByPreviousItem },
    } = this.props;

    this.context.router.push({
      pathname: lockedByPreviousItem && lockedByPreviousItem.resourcePath,
      query: this.context.router.location.query,
    });
  };

  render() {
    const { computedItem } = this.props;

    return (
      <Box rootClassName="rc-LockedByPreviousItemLockedCover">
        <LockIcon />

        <div>
          <LockMessage computedItem={computedItem} />

          <p>{_t('Complete the previous item to unlock this item.')}</p>
          <ul>
            <li>
              {_t('If you have just completed the previous item, please refresh your browser to unlock this item.')}
            </li>
            <li>
              {_t('If you have completed the previous item and a refresh still shows this page, please contact ')}
              <a href="https://learner.coursera.help/hc">{_t('Coursera 24x7 support')}</a>
            </li>
          </ul>

          <button type="button" className="primary" onClick={this.handleClick}>
            {_t('Go to Previous Item')}
          </button>
        </div>
      </Box>
    );
  }
}

export default LockedByPreviousItemLockedCover;
