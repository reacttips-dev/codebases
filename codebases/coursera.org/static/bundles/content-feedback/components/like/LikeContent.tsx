import React from 'react';

import { CSSTransitionGroup } from 'react-transition-group';
import createLoadableComponent from 'js/lib/createLoadableComponent';
import a11yKeyPress from 'js/lib/a11yKeyPress';

import FeedbackComplete from 'bundles/content-feedback/components/FeedbackComplete';

import { Box, color } from '@coursera/coursera-ui';
import { SvgCheck } from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/content-feedback';

import 'css!./__styles__/LikeContent';

import type { CmlContent } from 'bundles/cml/types/Content';

const LoadableLikeFeedbackEditor = createLoadableComponent(
  () => import('bundles/content-feedback/components/like/LikeFeedbackEditor')
);

type Props = {
  withFeedback: boolean;
  selected: boolean;
  isConfusingFeedback?: boolean;

  onDeselect: () => void;
  onSelect: (comment: CmlContent) => void;
  onComment: (cml: CmlContent) => void;

  comment: CmlContent;
  placeholder: string;

  children: React.ReactNode;
};

type State = {
  showEditor: boolean;
  showFeedbackComplete: boolean;
  message: string;
};

class LikeContent extends React.Component<Props, State> {
  static defaultProps = {
    withFeedback: true,
  };

  state = {
    showEditor: false,
    showFeedbackComplete: false,
    message: '',
  };

  handleClick = () => {
    const { selected, comment, onDeselect, onSelect } = this.props;
    if (selected) {
      this.setState({
        showEditor: false,
        showFeedbackComplete: false,
      });

      onDeselect();
    } else {
      this.setState({
        showEditor: true,
      });

      onSelect(comment);
    }
  };

  handleSend = (cml: CmlContent) => {
    const { onComment } = this.props;

    this.setState({
      showEditor: false,
      showFeedbackComplete: true,
      message: _t('Thank you for sharing feedback!'),
    });

    onComment(cml);
  };

  handleRemove = (cml: CmlContent) => {
    const { onComment } = this.props;

    this.setState({
      showEditor: false,
      showFeedbackComplete: true,
      message: _t('Your feedback has been removed.'),
    });

    onComment(cml);
  };

  handleSkip = () => {
    this.setState({
      showEditor: false,
      showFeedbackComplete: false,
    });
  };

  handleFeedbackCompleteTimeout = () => {
    this.setState({
      showFeedbackComplete: false,
    });
  };

  render() {
    const { placeholder, comment, children, withFeedback, isConfusingFeedback } = this.props;
    const { showEditor, showFeedbackComplete, message } = this.state;

    return (
      <div className="rc-LikeContent">
        {/* The <div> element has a child <button> element that allows keyboard interaction */}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div onClick={this.handleClick} onKeyPress={(event) => a11yKeyPress(event, this.handleClick)}>
          {children}
        </div>

        {withFeedback && showEditor && (
          <LoadableLikeFeedbackEditor
            // @ts-expect-error TODO: untyped HOC
            onRemove={this.handleRemove}
            onSend={this.handleSend}
            onSkip={this.handleSkip}
            initialCML={comment}
            placeholder={placeholder}
            isConfusingFeedback={isConfusingFeedback}
          />
        )}

        <CSSTransitionGroup transitionEnterTimeout={500} transitionLeaveTimeout={500} transitionName="fade">
          {showFeedbackComplete && (
            <FeedbackComplete key="feedback-complete" onTimeout={this.handleFeedbackCompleteTimeout}>
              <Box flexDirection="column" alignItems="center">
                {message}
                <SvgCheck color={color.primary} style={{ marginTop: '6px' }} />
              </Box>
            </FeedbackComplete>
          )}
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default LikeContent;
