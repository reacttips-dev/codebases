import React from 'react';
import { compose } from 'recompose';
import Q from 'q';
import API from 'js/lib/api';
import Uri from 'jsuri';

/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import getPropsFromPromise from 'js/lib/getPropsFromPromise';
import waitFor from 'js/lib/waitFor';
import user from 'js/lib/user';

import WidgetFrame from 'bundles/widget/components/WidgetFrame';

import type { WidgetSession } from 'bundles/widget/types/WidgetSession';

import type OnDemandStaffGradedSubmissionsV3 from 'bundles/naptimejs/resources/onDemandStaffGradedSubmissions.v3';

import type {
  FindBoxViewAnnotatorProfileByUserIdRequest,
  FindBoxViewAnnotatorProfileByUserIdResponse,
  CreateBoxViewAnnotatorProfileRequest,
  CreateBoxViewAnnotatorProfileResponse,
} from '@coursera/grpc-types-boxintegration/coursera/proto/boxintegration/boxviewannotatorprofiles/v1beta1/box_view_annotator_profiles_api';

import 'css!./__styles__/InlineSubmissionTool';

type PropsFromParent = {
  submission: OnDemandStaffGradedSubmissionsV3;
  reviewPartId: string;
  annotationsDisabled: boolean;
  showPopupButton: boolean;
};

type PropsWithAnnotatorProfileId = {
  annotatorProfileId?: string;
};

type Props = {
  widgetSession?: WidgetSession;
  widgetSessionId?: string;
  showPopupButton?: boolean;
};

const InlineSubmissionTool: React.FC<Props> = ({ widgetSession, widgetSessionId, showPopupButton }) => (
  <div className="rc-InlineSubmissionTool">
    {widgetSession && (
      <WidgetFrame
        session={widgetSession}
        sessionId={widgetSessionId}
        widgetId="box-inline-feedback"
        fallbackDefaultHeight="100%"
        showPopupButton={showPopupButton || false}
      />
    )}
  </div>
);

export default compose<Props, PropsFromParent>(
  getPropsFromPromise(({ annotationsDisabled }: PropsFromParent): Q.Promise<PropsWithAnnotatorProfileId> => {
    if (annotationsDisabled) {
      return Q({});
    }

    // Attempt to get annotator profile for current user. Create one if it doesn't exist.
    const api = API('/api/grpc/boxintegration/boxviewannotatorprofiles/v1beta1/BoxViewAnnotatorProfilesAPI', {
      type: 'rest',
    });

    const fetchProfilesUri = new Uri('FindBoxViewAnnotatorProfileByUserId');
    const fetchData: FindBoxViewAnnotatorProfileByUserIdRequest = { userId: user.get().id };

    return Q(api.post(fetchProfilesUri.toString(), { data: fetchData })).then(
      (response: FindBoxViewAnnotatorProfileByUserIdResponse) => {
        if (response.boxViewAnnotatorProfile.length > 0) {
          return {
            annotatorProfileId: response.boxViewAnnotatorProfile[0].boxViewProfileAnnotatorId,
          };
        } else {
          const createProfileUri = new Uri('CreateBoxViewAnnotatorProfile');
          const createData: CreateBoxViewAnnotatorProfileRequest = {
            userId: user.get().id,
            displayName: user.get().display_name,
          };
          return Q(api.post(createProfileUri.toString(), { data: createData })).then(
            (createResponse: CreateBoxViewAnnotatorProfileResponse) => {
              return {
                annotatorProfileId: createResponse.boxViewAnnotatorProfile?.boxViewProfileAnnotatorId,
              };
            }
          );
        }
      }
    );
  }),
  waitFor(
    (props: PropsFromParent & PropsWithAnnotatorProfileId) => props.annotationsDisabled || !!props.annotatorProfileId
  ),
  getPropsFromPromise(
    ({
      reviewPartId,
      submission,
      annotatorProfileId,
    }: PropsFromParent & PropsWithAnnotatorProfileId): Q.Promise<Props> => {
      const onDemandStaffGradedAnnotationSessionsApi = API('/api/onDemandBoxViewAnnotationSessions.v1', {
        type: 'rest',
      });
      const uri = new Uri()
        .addQueryParam('fields', ['session', 'sessionId'].join(','))
        .addQueryParam('action', 'createForGrading')
        .addQueryParam('userId', submission.submittedBy)
        .addQueryParam('courseId', submission.courseId)
        .addQueryParam('itemId', submission.itemId)
        .addQueryParam('reviewResponseId', `reviewResponseId~${reviewPartId}`);
      if (annotatorProfileId) {
        uri.addQueryParam('annotatorProfileId', annotatorProfileId);
      }
      const data = {};
      return Q(onDemandStaffGradedAnnotationSessionsApi.post(uri.toString(), { data })).then((response) => {
        return {
          widgetSession: response.session,
          widgetSessionId: response.sessionId,
        };
      });
    }
  )
)(InlineSubmissionTool);
