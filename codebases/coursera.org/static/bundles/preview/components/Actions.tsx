import React from 'react';
import ToolbarBox from 'bundles/preview/components/ToolbarBox';
import EditItem from 'bundles/preview/components/EditItem';
import EditCourse from 'bundles/preview/components/EditCourse';
import PreviewHelp from 'bundles/preview/components/PreviewHelp';
import FullHeightDivider from 'bundles/preview/components/FullHeightDivider';
import OpenSettingsButton from 'bundles/preview/components/OpenSettingsButton';
import type { AuthoringCourseContext } from 'bundles/authoring/common/types/authoringCourseContexts';
import type AuthoringCourse from 'bundles/author-common/models/AuthoringCourse';

import 'css!bundles/preview/components/__styles__/Actions';

type Props = {
  course: AuthoringCourse;
  matchedContext: AuthoringCourseContext;
  currentRouteName?: string;
  itemId?: string;
  versionId: string;
  groupId?: string;
  onSettingsButtonClick: () => void;
  userCanViewTeach: boolean;
  shouldUseContextBasedVaL: boolean;
};

const Actions: React.SFC<Props> = ({
  course,
  matchedContext,
  currentRouteName,
  itemId,
  onSettingsButtonClick,
  userCanViewTeach,
  versionId,
  groupId,
  shouldUseContextBasedVaL,
}) => {
  return (
    <ToolbarBox className="rc-Actions">
      <div className="settings-button-container">
        <OpenSettingsButton onClick={onSettingsButtonClick} />
      </div>

      {userCanViewTeach && itemId && currentRouteName && (
        <EditItem
          course={course}
          matchedContext={matchedContext}
          itemId={itemId}
          currentRouteName={currentRouteName}
          versionId={versionId}
          groupId={groupId}
          shouldUseContextBasedVaL={shouldUseContextBasedVaL}
        />
      )}
      {userCanViewTeach && <EditCourse course={course} />}
      {userCanViewTeach && <FullHeightDivider />}
      {userCanViewTeach && <PreviewHelp />}
    </ToolbarBox>
  );
};

export default Actions;
