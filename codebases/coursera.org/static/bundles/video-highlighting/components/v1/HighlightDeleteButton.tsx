import React from 'react';

import { Box, Button, color } from '@coursera/coursera-ui';
import { SvgTrash } from '@coursera/coursera-ui/svg';

import withSingleTracked from 'bundles/common/components/withSingleTracked';
import HighlightButtonLabel from 'bundles/video-highlighting/components/v1/HighlightButtonLabel';

import type { Highlight } from 'bundles/video-highlighting/types';

import _t from 'i18n!nls/video-highlighting';

import 'css!./__styles__/HighlightDeleteButton';

const TrackedButton = withSingleTracked({ type: 'BUTTON' })(Button);

type Props = {
  disabled: boolean;
  onDelete: () => void;
  highlight: Highlight;
};

type State = {
  showConfirmation: boolean;
};

class HighlightDeleteButton extends React.Component<Props, State> {
  state = {
    showConfirmation: false,
  };

  handleClick = () => {
    this.setState({ showConfirmation: true });
  };

  handleConfirm = () => {
    const { onDelete } = this.props;
    onDelete();
    this.setState({ showConfirmation: false });
  };

  handleCancel = () => {
    this.setState({ showConfirmation: false });
  };

  render() {
    const { disabled, highlight } = this.props;
    const { showConfirmation } = this.state;
    const { id } = highlight;

    return (
      <div className="rc-HighlightDeleteButton">
        {!showConfirmation && (
          <button
            type="button"
            disabled={disabled}
            onClick={this.handleClick}
            className="highlight-delete-btn"
            aria-labelledby={`delete-btn-label-${id}`}
          >
            <HighlightButtonLabel
              id={`delete-btn-label-${id}`}
              startText={_t('Delete note marked')}
              highlight={highlight}
            />
            <SvgTrash color={disabled ? color.secondaryText : color.primaryText} size={15} suppressTitle={true} />
          </button>
        )}

        {showConfirmation && (
          <Box style={{ marginTop: '-5px' }}>
            <div className="highlight-delete-btn-confirm">{_t('Delete Note?')}</div>

            <TrackedButton
              size="zero"
              type="primary"
              label={_t('Yes')}
              onClick={this.handleConfirm}
              trackingName="delete_highlight"
              style={{ fontSize: '12px', padding: '0 5px', marginRight: '8px' }}
            />

            <TrackedButton
              size="zero"
              type="default"
              label={_t('No')}
              onClick={this.handleCancel}
              trackingName="cancel_delete_highlight"
              style={{ fontSize: '12px', padding: '0 5px' }}
            />
          </Box>
        )}
      </div>
    );
  }
}

export default HighlightDeleteButton;
