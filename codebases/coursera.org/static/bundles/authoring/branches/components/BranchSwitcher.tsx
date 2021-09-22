import React from 'react';
import CdsMigrationTypography from 'bundles/authoring/common/components/cds/CdsMigrationTypography';
import PropTypes from 'prop-types';
import { DropdownButton, MenuItem } from 'react-bootstrap-33';
import BranchStatusPill from 'bundles/authoring/branches/components/BranchStatusPill';
import BranchStatus from 'bundles/authoring/branches/components/BranchStatus';
import { Box } from '@coursera/coursera-ui';

import type AuthoringCourseBranch from 'bundles/author-common/models/AuthoringCourseBranch';
import { branchStatus } from 'bundles/author-branches/constants';
import { selectBranch } from 'bundles/author-branches/actions/branchActions';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { pushBranchIdToUrl } from 'bundles/authoring/branches/utils/BranchUtils';

import 'css!./__styles__/BranchSwitcher';

/**
 * A branch switcher that takes in branches and a selectedBranchId.
 * by default it will push the currently selected id to the url params
 */
type Props = {
  branches: Array<AuthoringCourseBranch>;
  selectedBranchId: string;
  onSelect?: (x: string) => void;
  showIfSingleBranch?: boolean;
  persistBranchSelectionChanges?: boolean;
  isEnabled?: boolean;
  label?: string;
};

class BranchSwitcher extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    executeAction: PropTypes.func,
  };

  static defaultProps = {
    persistBranchSelectionChanges: true,
    onSelect: () => {},
    isEnabled: true,
  };

  onBranchSelect = (newBranchId: string) => {
    const { onSelect, selectedBranchId, persistBranchSelectionChanges } = this.props;
    const { executeAction, router } = this.context;
    // Only execute callback function if selected branchId changes
    if (selectedBranchId !== newBranchId) {
      if (onSelect) {
        onSelect(newBranchId);
      }

      if (persistBranchSelectionChanges) {
        pushBranchIdToUrl(newBranchId, router);
        executeAction(selectBranch, { branchId: newBranchId });
      }
    }
  };

  renderMenuOption = (branch: AuthoringCourseBranch) => {
    return (
      <Box justifyContent="start">
        {branch && branch.branchStatus && <BranchStatusPill status={branch.branchStatus} />}
        <BranchStatus branch={branch} />
      </Box>
    );
  };

  renderDropdownTitle = (branchId: string) => {
    const { branches } = this.props;

    const selectedBranch = branches.find((branch) => branch.id === branchId);
    if (selectedBranch) {
      return (
        <CdsMigrationTypography variant="body1" cuiComponentName="View" className="dropdown-title">
          {this.renderMenuOption(selectedBranch)}
        </CdsMigrationTypography>
      );
    }
    return null;
  };

  render() {
    const { branches, selectedBranchId, showIfSingleBranch, isEnabled, label } = this.props;

    // we don't want to show the branch switcher if the only branch is the original branch
    if (!branches || branches.length === 0 || !selectedBranchId || (!showIfSingleBranch && branches.length <= 1)) {
      return null;
    }

    // Don't show branches that are still being created
    const visibleBranches = branches.filter((branch) => branch.branchStatus !== branchStatus.CREATING);

    return (
      <div className="rc-BranchSwitcher">
        {label && (
          <div className="switcher-label">
            <CdsMigrationTypography variant="h4bold" component="label" cuiComponentName="Label">
              {label}
            </CdsMigrationTypography>
          </div>
        )}
        <DropdownButton
          title={this.renderDropdownTitle(selectedBranchId)}
          onSelect={this.onBranchSelect}
          disabled={!isEnabled}
        >
          {visibleBranches.map((branch) => (
            <MenuItem eventKey={branch.id} key={branch.id}>
              {this.renderMenuOption(branch)}
            </MenuItem>
          ))}
        </DropdownButton>
      </div>
    );
  }
}

export default BranchSwitcher;
