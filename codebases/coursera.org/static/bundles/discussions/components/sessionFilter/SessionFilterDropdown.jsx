import _ from 'underscore';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { DropdownButton, MenuItem } from 'react-bootstrap-33';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import waitFor from 'js/lib/waitFor';

import _t from 'i18n!nls/discussions';
import 'css!bundles/discussions/components/sessionFilter/__styles__/SessionFilterDropdown';

const dateFormat = 'MMM DD, YYYY';

class SessionFilterDropdown extends React.Component {
  static propTypes = {
    handleDropdownChange: PropTypes.func.isRequired,
    id: PropTypes.string,
    branches: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        filters: PropTypes.arrayOf(
          PropTypes.shape({
            branchId: PropTypes.string.isRequired,
            startedAt: PropTypes.number,
            endedAt: PropTypes.number,
          })
        ),
      })
    ),
    allSessions: PropTypes.array,
    selectedFilter: PropTypes.shape({
      id: PropTypes.string.isRequired,
      startedAt: PropTypes.number,
      endedAt: PropTypes.number,
    }),
    hideAllSessionsOption: PropTypes.bool,
    limitSwitchingToCurrentBranch: PropTypes.bool,
    currentBranchId: PropTypes.string,
    isSessionsV2Enabled: PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);

    if (props.hideAllSessionsOption && props.selectedFilter.id === 'all') {
      const selectedBranch = props.branches.find((branch) => branch.id === props.currentBranchId) || props.branches[0];
      this.state = {
        selectedFilter: selectedBranch.filters.find((filter) => filter.id !== 'all'),
      };
      props.handleDropdownChange(this.state.selectedFilter.id);
    } else {
      this.state = {
        selectedFilter: props.selectedFilter,
      };
    }
  }

  handleDropdownChange = (filterId) => {
    let selectedBranch;
    let selectedFilter;
    let filterIdWithoutBranch;
    if (filterId.startsWith('all~')) {
      selectedBranch = this.props.branches.find((branch) => branch.id === filterId.substring(4, filterId.length));
      selectedFilter = selectedBranch.filters.find((filter) => filter.id === 'all');
      filterIdWithoutBranch = 'all';
    } else {
      selectedBranch = this.props.branches.find((branch) => !!branch.filters.find((filter) => filter.id === filterId));
      selectedFilter = selectedBranch.filters.find((filter) => filter.id === filterId);
      filterIdWithoutBranch = filterId;
    }

    this.setState({
      selectedFilter,
    });

    this.props.handleDropdownChange(filterIdWithoutBranch, selectedBranch.id);
  };

  buildBranchMenuItemDisplay = (branch) => {
    return (
      <MenuItem key={branch.id} eventKey={branch.id} disabled className="disabled">
        <div className="horizontal-box">{branch.label}</div>
      </MenuItem>
    );
  };

  buildAllBranchFilterMenuItemDisplay = (branch) => {
    return branch.filters.map((filter) => {
      if (this.props.hideAllSessionsOption && filter.id === 'all') {
        return null;
      }
      const id = filter.id !== 'all' ? filter.id : 'all~' + filter.branchId;
      const filterClass = classNames({
        'body-2-text':
          filter.id === this.state.selectedFilter.id && filter.branchId === this.state.selectedFilter.branchId,
      });
      return (
        <MenuItem key={id} eventKey={id}>
          <div className={filterClass}>{this.buildFilterMenuItemDisplay(filter, true)}</div>
        </MenuItem>
      );
    });
  };

  buildFilterDisplayString(filter, showLabel) {
    const { isSessionsV2Enabled, branches } = this.props;
    const filterBranch = branches.find((branch) => branch.id === filter.branchId);

    if (filter.id === 'ondemand') {
      return showLabel ? 'Self Paced' : `Self Paced (${filterBranch.label})`;
    } else if (filter.id === 'all') {
      const sessionsDescriptorText = isSessionsV2Enabled ? 'cohorts' : 'sessions';
      return `All ${sessionsDescriptorText} for ${filterBranch.label}`;
    } else {
      const startedAtDisplay = moment(filter.startedAt).format(dateFormat);
      const endedAtDisplay = moment(filter.endedAt).format(dateFormat);

      const dateDisplay = `${startedAtDisplay} - ${endedAtDisplay}`;
      return showLabel ? dateDisplay : dateDisplay + ` (${filterBranch.label})`;
    }
  }

  buildFilterMenuItemDisplay = (filter, showLabel) => {
    if (filter.id === 'ondemand' || filter.id === 'all') {
      return (
        <div className="horizontal-box menu-item-box">
          {showLabel && <span>&nbsp;-&nbsp;</span>}
          {this.buildFilterDisplayString(filter, showLabel)}

          {
            // We only want the label if its for a session that has not yet ended.
            filter.id === 'ondemand' && showLabel && (
              <div className="menu-item-label caption-text color-secondary-text">{_t('Active')}</div>
            )
          }
        </div>
      );
    }

    // If it's not `ondemand` or `all` then it is a session

    // NOTE this calculated week could be different from the actual week. Getting the schedule for all sessions would
    // be expensive, so just make a best guess based on session deadlines.
    const session = this.props.allSessions.find((s) => s.id === filter.id);
    const earliestDeadline = _(session.moduleDeadlines)
      .chain()
      .sortBy((b) => b.startedAt)
      .find((moduleDeadline) => moment(moduleDeadline.deadline).isAfter(moment()))
      .value();
    const weekNumber = earliestDeadline && moment(earliestDeadline).diff(moment(session.startedAt), 'weeks');

    return (
      <div className="horizontal-box menu-item-box">
        {showLabel && <span>&nbsp;-&nbsp;</span>}
        {this.buildFilterDisplayString(filter, showLabel)}

        {showLabel &&
          // if findIndex returned -1 that means there isn't actually a moduleDeadline that is after now.
          weekNumber > 0 &&
          // We only want the label if its for a session that has not yet ended.
          moment(session.endedAt).isAfter(moment()) && (
            <div className="menu-item-label caption-text color-secondary-text">
              <FormattedMessage message={_t('Week {weekNumber} assignment due')} weekNumber={weekNumber} />
            </div>
          )}
      </div>
    );
  };

  render() {
    if (!this.props.branches || this.props.branches.length === 0) {
      return null;
    }

    // if we have a requiredBranchId, only show the sessions for that branch
    const branches = this.props.limitSwitchingToCurrentBranch
      ? this.props.branches.filter((branch) => branch.id === this.props.currentBranchId)
      : this.props.branches;

    return (
      <div className="rc-SessionFilterDropdown body-1-text">
        <div className="dropdown-section">
          <DropdownButton
            id={this.props.id}
            title={this.buildFilterMenuItemDisplay(this.state.selectedFilter, false)}
            onSelect={this.handleDropdownChange}
          >
            {branches.map((branch, index) => [
              // don't show the branch name if there is only a single branch
              branches.length > 1 ? this.buildBranchMenuItemDisplay(branch) : null,
              ...this.buildAllBranchFilterMenuItemDisplay(branch),
              // if it is not the last branch, show a spacer below it
              index === branches.length - 1 ? null : (
                <MenuItem className="disabled" disabled key={branch.id + 'spacer'} />
              ),
            ])}
          </DropdownButton>
        </div>
      </div>
    );
  }
}

export default _.compose(
  connectToStores(['SessionFilterStore'], ({ SessionFilterStore }, props) => {
    return {
      branches: SessionFilterStore.branches,
      sessionsLoaded: SessionFilterStore.filtersLoaded,
      selectedFilter: SessionFilterStore.activeFilter,
      allSessions: SessionFilterStore.allSessions,
      currentBranchId: SessionFilterStore.currentBranchId,
    };
  }),
  waitFor(
    (props) => props.sessionsLoaded,
    () => <div className="padded-label">{_t('Loading...')}</div>
  )
)(SessionFilterDropdown);
