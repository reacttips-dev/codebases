import React from 'react';

import { Box, Button } from '@coursera/coursera-ui';

import CML from 'bundles/cml/components/CML';
import withSingleTracked from 'bundles/common/components/withSingleTracked';
import { LearningAssistanceMessage } from 'bundles/learning-assistant/types/RealtimeMessages';

import { SvgaLightbulb } from '@coursera/coursera-ui/svg';
import { CmlContent } from 'bundles/cml/types/Content';

import _t from 'i18n!nls/learning-assistant';

import 'css!bundles/learning-assistant/components/__styles__/LearningAssistantAliceMessage';

const TrackedButton = withSingleTracked({ type: 'BUTTON' })(Button);

type Props = {
  sourceMessage: LearningAssistanceMessage;
  title: string;
  message: CmlContent;
  action: {
    title: string;
    url: string;
  };
  onDismiss: () => void;
};

class LearningAssistantAliceMessage extends React.Component<Props> {
  renderCTA() {
    const { action, sourceMessage } = this.props;

    return (
      <TrackedButton
        rootClassName="assistant-cta"
        tag="a"
        trackingName="cta"
        trackingData={{ message: sourceMessage }}
        htmlAttributes={{ href: action?.url }}
        size="sm"
        type="primary"
        label={action?.title}
      />
    );
  }

  renderFeedback() {
    const { onDismiss, sourceMessage } = this.props;

    return (
      <Box flexDirection="row" justifyContent="start" alignItems="center">
        <span className="feedback-label">{_t('Was this helpful?')}</span>

        <TrackedButton
          trackingName="helpful"
          trackingData={{ message: sourceMessage }}
          onClick={onDismiss}
          size="zero"
          type="secondary"
          rootClassName="feedback-button"
        >
          {_t('Yes')}
        </TrackedButton>

        <TrackedButton
          trackingName="not_helpful"
          trackingData={{ message: sourceMessage }}
          onClick={onDismiss}
          size="zero"
          type="secondary"
          rootClassName="feedback-button"
        >
          {_t('No')}
        </TrackedButton>
      </Box>
    );
  }

  render() {
    const {
      title,
      message,
      action: { title: actionTitle, url: actionURL },
    } = this.props;

    const shouldRenderCTA = actionTitle.trim().length > 0 && actionURL.trim().length > 0;

    return (
      <div className="rc-LearningAssistantAliceMessage">
        <Box flexDirection="row" justifyContent="start" alignItems="start">
          <div className="alice-icon">
            <SvgaLightbulb size={32} />
          </div>
          <div>
            <h1 id="assistant-header" className="assistant-header">
              {title}
            </h1>
            <CML contentId="assistant-description" cml={message} />
            {shouldRenderCTA ? this.renderCTA() : this.renderFeedback()}
          </div>
        </Box>
      </div>
    );
  }
}

export default LearningAssistantAliceMessage;
