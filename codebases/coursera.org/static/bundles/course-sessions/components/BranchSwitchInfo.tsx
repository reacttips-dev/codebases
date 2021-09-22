import React from 'react';

import CML from 'bundles/cml/components/CML';
import { isVideoHighlightingEnabled } from 'bundles/video-highlighting/utils/highlightingFeatureToggles';

import { Button } from '@coursera/coursera-ui';

import _t from 'i18n!nls/course-sessions';

import type { CmlContent } from 'bundles/cml/types/Content';

import 'css!./__styles__/BranchSwitchInfo';

type Props = {
  handleConfirm: () => void;
  changesDescription?: CmlContent;
  courseId: string;
};

// TODO: reconcile this component with SessionSwitchBranchChangeInfo
const BranchSwitchInfo = (props: Props) => {
  const { changesDescription, handleConfirm, courseId } = props;

  const message = isVideoHighlightingEnabled(courseId)
    ? _t(
        `Your instructor has made some changes to the course! Review the information below to learn
        more. You may need to complete additional assignments to pass the course in this version.
        If the instructor has removed or altered videos, then your highlights and notes
        will be preserved, but they may not link back to the original video.`
      )
    : _t(
        `Your instructor has made some changes to the course! Review the information below to learn
        more. You may need to complete additional assignments to pass the course in this version.`
      );

  return (
    <div className="rc-BranchSwitchInfo vertical-box flex-1">
      <h3 className="title">{_t('New in this version')}</h3>

      <div>
        <p className="body-1-text">{message}</p>
        <p className="body-2-text instructor-note">{_t('Note from your instructor:')}</p>
        <p className="body-1-text">
          <CML cml={changesDescription} />
        </p>
      </div>
      <div className="horizontal-box align-items-right wrap">
        <Button rootClassName="confirm-button" type="primary" onClick={handleConfirm}>
          {_t('Confirm')}
        </Button>
      </div>
    </div>
  );
};

export default BranchSwitchInfo;
