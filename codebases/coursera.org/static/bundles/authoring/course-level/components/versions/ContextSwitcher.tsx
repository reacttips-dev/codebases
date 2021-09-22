import React from 'react';
import CdsMigrationTypography from 'bundles/authoring/common/components/cds/CdsMigrationTypography';
import { DropdownButton, MenuItem } from 'react-bootstrap-33';
import { Box } from '@coursera/coursera-ui';

import { branchStatus } from 'bundles/author-branches/constants';
import { getContextDateString } from 'bundles/authoring/course-level/utils/contextDateUtils';
import ContextStatusPill from 'bundles/authoring/course-level/components/ContextStatusPill';
import { getContextByContextId, getIdForContextSwitcher } from 'bundles/authoring/course-level/utils/contextUtils';
import type {
  AuthoringCourseContext,
  SessionGroupContext,
} from 'bundles/authoring/common/types/authoringCourseContexts';
import { authoringCourseContextTypes } from 'bundles/authoring/common/constants/authoringCourseContexts';
import { MED_DATE_ONLY_DISPLAY } from 'js/utils/DateTimeUtils';

import _t from 'i18n!nls/authoring';
import 'css!./__styles__/ContextSwitcher';

/**
 * Renders a dropdown menu of course contexts and handles selecting the course context
 */
type Props = {
  courseContexts: Array<AuthoringCourseContext>;
  selectedContextId: string;
  onSelect: (contextId: string, courseContext: AuthoringCourseContext) => void;
  isEnabled?: boolean;
  label?: string;
  showBranchName?: boolean; // shows the underlying version name for sessionGroup contexts
};

class ContextSwitcher extends React.Component<Props> {
  static defaultProps = {
    onSelect: () => {},
    isEnabled: true,
    showBranchName: true,
  };

  onContextSelect = (newContextId: string) => {
    const { onSelect, selectedContextId, courseContexts } = this.props;

    // Only execute callback function if selected contextId changes
    if (selectedContextId !== newContextId) {
      // @ts-expect-error TODO: getContextByContextId can return undefined
      onSelect(newContextId, getContextByContextId(courseContexts, newContextId));
    }
  };

  renderMenuOption = (courseContext: AuthoringCourseContext) => {
    const { showBranchName } = this.props;
    const {
      definition: { name, status, createdAt, startsAt, endsAt },
      typeName,
    } = courseContext;

    const isSessionGroupContext = typeName === authoringCourseContextTypes.SESSION_GROUP;
    const showContextBranchName = isSessionGroupContext && showBranchName;
    const contextBranchName = showContextBranchName
      ? (courseContext as SessionGroupContext).definition.branchName
      : null;

    return (
      <Box justifyContent="start" rootClassName="menu-option align-items-vertical-center">
        <ContextStatusPill status={status} />
        <div className="context-info vertical-box flex-1">
          <CdsMigrationTypography variant="body2" cuiComponentName="View" className="context-name">
            {contextBranchName ? <strong>{name}</strong> : name}
          </CdsMigrationTypography>
          {contextBranchName && (
            <CdsMigrationTypography variant="body2" cuiComponentName="View" className="branch-name">
              {_t('Version: #{versionName}', { versionName: contextBranchName })}
            </CdsMigrationTypography>
          )}
        </div>
        <CdsMigrationTypography variant="body2" className="context-date" cuiComponentName="Caption">
          {getContextDateString({ createdAt, startsAt, endsAt, status, typeName }, MED_DATE_ONLY_DISPLAY)}
        </CdsMigrationTypography>
      </Box>
    );
  };

  renderDropdownTitle = (contextId: string) => {
    const { courseContexts } = this.props;

    const selectedContext = getContextByContextId(courseContexts, contextId) || courseContexts[0];

    return <div className="dropdown-title">{this.renderMenuOption(selectedContext)}</div>;
  };

  render() {
    const { courseContexts, selectedContextId, isEnabled, label } = this.props;

    if (!courseContexts || courseContexts.length === 0 || !selectedContextId) {
      return null;
    }

    // Don't show branches that are still being created
    const visibleContexts = courseContexts.filter(({ definition }) => definition.status !== branchStatus.CREATING);

    return (
      <div className="rc-ContextSwitcher">
        {label && (
          <div className="switcher-label">
            <CdsMigrationTypography variant="h4bold" component="label" cuiComponentName="Label">
              {label}
            </CdsMigrationTypography>
          </div>
        )}
        <DropdownButton
          title={this.renderDropdownTitle(selectedContextId)}
          onSelect={this.onContextSelect}
          disabled={!isEnabled}
        >
          {visibleContexts.map((courseContext) => {
            const contextId = getIdForContextSwitcher(courseContext);

            return (
              <MenuItem eventKey={contextId} key={contextId}>
                {this.renderMenuOption(courseContext)}
              </MenuItem>
            );
          })}
        </DropdownButton>
      </div>
    );
  }
}

export default ContextSwitcher;
