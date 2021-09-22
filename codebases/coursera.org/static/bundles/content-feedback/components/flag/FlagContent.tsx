import type { Item } from 'bundles/learner-progress/types/Item';

import React from 'react';
import ReactModal from 'react-modal';

import a11yKeyPress from 'js/lib/a11yKeyPress';
import generateUUID from 'bundles/common/utils/uuid';

import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import FeedbackComplete from 'bundles/content-feedback/components/FeedbackComplete';
import FlagCategories from 'bundles/content-feedback/components/flag/FlagCategories';
import type { ItemType } from 'bundles/content-feedback/constants/ItemTypes';

import { Box, color } from '@coursera/coursera-ui';
import { SvgCheck } from '@coursera/coursera-ui/svg';
import type { CmlContent } from 'bundles/cml/types/Content';

import _t from 'i18n!nls/content-feedback';

import 'css!./__styles__/FlagContent';

type Props = {
  componentId?: string;
  computedItem: Item;
  itemFeedbackType: ItemType;
  children?: React.ReactNode;

  comments: CmlContent;
  onSelect: Function;
  onSubmit: Function;
  onRemove: Function;
};

type State = {
  showCategories: boolean;
  showMessage: boolean;
  message: string;
  modalParentId?: string;
};

class FlagContent extends React.Component<Props, State> {
  state = {
    showCategories: false,
    showMessage: false,
    message: '',
    modalParentId: undefined,
  };

  componentDidMount() {
    const { componentId } = this.props;
    this.setState({ modalParentId: componentId || `flagcontent-${generateUUID()}` });
  }

  handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { onSelect } = this.props;
    const { showCategories } = this.state;
    event.preventDefault();

    if (!showCategories) {
      this.setState({
        showCategories: true,
      });

      onSelect();
    } else {
      this.setState({
        showCategories: false,
        showMessage: false,
      });
    }
  };

  handleSend = (comments: $TSFixMe) => {
    const { onSubmit } = this.props;

    this.setState({
      showCategories: false,
      showMessage: true,
      message: _t('Thank you for sharing feedback!'),
    });

    onSubmit(comments);
  };

  handleRemove = (comments: $TSFixMe) => {
    const { onRemove } = this.props;

    this.setState({
      showCategories: false,
      showMessage: true,
      message: _t('Your feedback has been removed.'),
    });

    onRemove(comments);
  };

  handleCancel = () => {
    this.setState({
      showCategories: false,
      showMessage: false,
    });
  };

  handleMessageTimeout = () => {
    this.setState({
      showMessage: false,
    });
  };

  setModalParentSelector = () => {
    const { modalParentId = '' } = this.state;
    return document.getElementById(modalParentId) as HTMLElement;
  };

  render() {
    const { children, computedItem, itemFeedbackType, comments } = this.props;
    const { showCategories, showMessage, message } = this.state;
    const { modalParentId } = this.state;

    return (
      <div className="rc-FlagContent" id={modalParentId}>
        {/* The <div> element has a child <button> element that allows keyboard interaction */}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          aria-expanded={showCategories}
          onKeyPress={(event) => a11yKeyPress(event, this.handleClick)}
          onClick={this.handleClick}
        >
          {children}
        </div>
        {modalParentId && (
          <ReactModal
            isOpen={showCategories}
            className="c-flag-categories-modal"
            overlayClassName="c-flag-categories-modal-overlay"
            parentSelector={this.setModalParentSelector}
            aria={{
              labelledby: 'reportProblemId',
            }}
          >
            <FlagCategories
              computedItem={computedItem}
              itemFeedbackType={itemFeedbackType}
              onSend={this.handleSend}
              onRemove={this.handleRemove}
              onCancel={this.handleCancel}
              comments={comments}
            />
          </ReactModal>
        )}
        <div role="alert" aria-live="polite">
          <CSSTransitionGroup transitionName="fade" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
            {showMessage && (
              <FeedbackComplete key="message" onTimeout={this.handleMessageTimeout}>
                <Box flexDirection="column" alignItems="center">
                  {message}
                  <SvgCheck suppressTitle color={color.primary} style={{ marginTop: '6px' }} />
                </Box>
              </FeedbackComplete>
            )}
          </CSSTransitionGroup>
        </div>
      </div>
    );
  }
}

export default FlagContent;
