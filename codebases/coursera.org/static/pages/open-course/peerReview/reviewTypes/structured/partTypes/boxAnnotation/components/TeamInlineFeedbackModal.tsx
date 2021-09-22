import type { WidgetSession } from 'bundles/widget/types/WidgetSession';
import user from 'js/lib/user';
import API from 'js/lib/api';
import React from 'react';
import { compose } from 'recompose';
import Modal from 'bundles/ui/components/Modal';
import connectToRouter from 'js/lib/connectToRouter';
import WidgetFrame from 'bundles/widget/components/WidgetFrame';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import CenteredLoadingSpinner from 'bundles/assess-common/components/CenteredLoadingSpinner';

import 'css!./__styles__/TeamInlineFeedbackModal';

const onDemandBoxViewAnnotationSessionsV1 = API('/api/onDemandBoxViewAnnotationSessions.v1', { type: 'rest' });

type InputProps = {};

type Props = InputProps & {
  itemId: string;
  courseId: string;
  reviewResponseId: string;
  onCloseModal: () => void;
};

type State = {
  widgetSession?: WidgetSession;
  widgetSessionId?: string;
};

class TeamInlineFeedbackModal extends React.Component<Props, State> {
  state: State = {
    widgetSession: undefined,
    widgetSessionId: undefined,
  };

  componentDidMount() {
    const { itemId, courseId, reviewResponseId } = this.props;
    onDemandBoxViewAnnotationSessionsV1
      .post(
        `?action=createForViewing&userId=${
          user.get().id
        }&courseId=${courseId}&reviewResponseId=${reviewResponseId}&itemId=${itemId}`,
        {
          data: {},
        }
      )
      .then((response) => {
        this.setState({
          widgetSession: response.session,
          widgetSessionId: response.sessionId,
        });
      });
  }

  render() {
    const { widgetSession, widgetSessionId } = this.state;
    const { onCloseModal } = this.props;

    return (
      <Modal onRequestClose={onCloseModal} size="x-large">
        <div className="rc-TeamInlineFeedbackModal">
          {widgetSession ? (
            <WidgetFrame
              session={widgetSession}
              sessionId={widgetSessionId}
              widgetId="box-inline-feedback"
              showPopupButton={false}
            />
          ) : (
            <CenteredLoadingSpinner />
          )}
        </div>
      </Modal>
    );
  }
}

export default compose<Props, InputProps>(
  connectToRouter((router) => ({
    itemId: router.params.item_id,
  })),
  // TODO: connectToStores<Props, InputProps, Stores>
  connectToStores<any, any>(['CourseStore'], ({ CourseStore }) => {
    return {
      courseId: CourseStore.getCourseId(),
    };
  })
)(TeamInlineFeedbackModal);
