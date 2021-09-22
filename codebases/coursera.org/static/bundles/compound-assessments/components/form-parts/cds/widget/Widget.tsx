/* eslint-disable graphql/template-strings */
import React from 'react';
import initBem from 'js/lib/bem';
import WidgetFrame from 'bundles/widget/components/cds/WidgetFrame';
import { RPCActions } from 'bundles/widget/constants/WidgetConstants';
import GradeNotification from 'bundles/compound-assessments/components/form-parts/cds/GradeNotification';

import { WidgetPrompt } from 'bundles/compound-assessments/types/FormParts';
import { CourseraConnectMessage } from 'bundles/widget/types/Request';
import { WidgetSession } from 'bundles/widget/types/WidgetSession';
import { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';

import { typeNames } from 'bundles/compound-assessments/constants';

const bem = initBem('Widget');

type Props = {
  prompt?: WidgetPrompt;
  onChangeResponse: (response: any) => void; // TODO(carl): what is response type?
  isDisabled: boolean;
};

type State = {
  widgetSession?: WidgetSession | null;
};

export const checkInvalid = (response: any): FormPartsValidationStatus | null => null;

export default class Widget extends React.Component<Props, State> {
  state: State = {
    widgetSession: null,
  };

  componentDidMount() {
    const { prompt } = this.props;
    if (prompt) {
      let sessionId = prompt.variant.definition.widgetSessionId;
      if (prompt.feedback) {
        // @ts-expect-error TSMIGRATION
        sessionId = prompt.feedback.definition.widgetSessionId;
      }
      this.fetchWidgetSession(sessionId);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { prompt } = this.props;
    const { prompt: prevPrompt } = prevProps;
    if (prompt && prevPrompt) {
      let sessionId = prompt.variant.definition.widgetSessionId;
      if (prompt.feedback) {
        // @ts-expect-error TSMIGRATION
        sessionId = prompt.feedback.definition.widgetSessionId;
      }
      let prevSessionId = prevPrompt.variant.definition.widgetSessionId;
      if (prevPrompt.feedback) {
        // @ts-expect-error TSMIGRATION
        prevSessionId = prevPrompt.feedback.definition.widgetSessionId;
      }
      if (sessionId !== prevSessionId) {
        this.fetchWidgetSession(sessionId);
      }
    }
  }

  onReceiveWidgetMessage = (request: CourseraConnectMessage) => {
    const { onChangeResponse } = this.props;
    if (request.type === RPCActions.SET_ANSWER) {
      onChangeResponse({
        typeName: typeNames.AUTO_GRADABLE_RESPONSE,
        definition: {
          value: {
            answer: (request.body || {}).answer,
          },
        },
      });
    }
    return Promise.resolve();
  };

  fetchWidgetSession = (sessionId: string) => {
    this.setState({ widgetSession: null });
    fetch(
      `/api/widgetSessions.v1/${sessionId}?fields=configuration,expiresAt,id,iframeTitle,rpcActionTypes,sandbox,src`
    )
      .then((response) => response.json())
      .then((response) =>
        this.setState({
          widgetSession: (response.elements || [])[0],
        })
      );
  };

  render() {
    const { prompt, isDisabled } = this.props;
    const { widgetSession } = this.state;
    if (prompt) {
      const { widgetSessionId } = prompt.variant.definition;
      const isPartialFeedback = ((prompt || {}).variant || {}).detailLevel === 'Partial';

      return (
        <div className={bem()}>
          {!isPartialFeedback && (
            <div className={bem('response')}>
              {widgetSession && (
                <WidgetFrame
                  sessionId={widgetSessionId}
                  session={widgetSession}
                  widgetId={`widget-question-${prompt.id}`}
                  parentRpcActions={[RPCActions.SET_ANSWER]}
                  onReceiveMessage={this.onReceiveWidgetMessage}
                  isDisabled={isDisabled}
                />
              )}
            </div>
          )}
          <GradeNotification prompt={prompt} />
        </div>
      );
    }
    return null;
  }
}
