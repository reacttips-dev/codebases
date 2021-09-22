import PropTypes from 'prop-types';
import React from 'react';

import _t from 'i18n!nls/course-v2';

import { DropdownButton, MenuItem } from 'react-bootstrap-33';

import GroupInfo from 'bundles/course-v2/components/course-view/GroupInfo';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import GroupSummary from 'bundles/authoring/groups/models/GroupSummary';

import { compareByNaturalSortOrder } from 'bundles/author-assignment-grading/utils/common';

import 'css!./__styles__/GroupSwitcher';

/**
 * A dumb private group switcher
 */

type Props = {
  groups: Array<GroupSummary>;
  selectedGroupId: string;
  onGroupSelect: (x: string) => void;
};

class GroupSwitcher extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    onGroupSelect: () => {},
  };

  handleGroupSelect = (newGroupId: string) => {
    const { onGroupSelect, selectedGroupId } = this.props;
    // Only execute callback function if selected groupId changes
    if (selectedGroupId !== newGroupId) {
      onGroupSelect(newGroupId);
    }
  };

  renderGroupDropdownTitle = (selectedGroupId: string) => {
    let selectedGroup = this.props.groups.find((group) => group.id === selectedGroupId);

    if (!selectedGroup) {
      if (this.props.groups.length > 0 && this.props.groups[0].isEmptyGroup) {
        [selectedGroup] = this.props.groups;
      } else {
        return null;
      }
    }

    return (
      <div className="dropdown-title">
        <GroupInfo group={selectedGroup} />
      </div>
    );
  };

  renderDisabledGroupDropdownTitle = () => {
    return <div className="dropdown-title">{_t('No groups available for this session')}</div>;
  };

  render() {
    const { groups, selectedGroupId } = this.props;

    const dropdownDisabled = groups.length === 0;

    const alphabeticallySortedGroups = groups.sort((a, b) => {
      if (!a.name && !b.name) {
        return 0;
      } else if (a.name === undefined) {
        return 1;
      } else if (b.name === undefined) {
        return -1;
      } else {
        return compareByNaturalSortOrder(a.name, b.name);
      }
    });

    return (
      <div className="rc-GroupSwitcher">
        {!dropdownDisabled && (
          <div>
            <p>{_t('(Course staff and group managers cannot be removed from a group)')}</p>
            <DropdownButton title={this.renderGroupDropdownTitle(selectedGroupId)} onSelect={this.handleGroupSelect}>
              {alphabeticallySortedGroups.map((group) => {
                if (!group) {
                  return null;
                }

                return (
                  <MenuItem eventKey={group.id} key={group.id}>
                    <GroupInfo group={group} />
                  </MenuItem>
                );
              })}
            </DropdownButton>
          </div>
        )}
        {dropdownDisabled && <DropdownButton title={this.renderDisabledGroupDropdownTitle()} disabled />}
      </div>
    );
  }
}

export default GroupSwitcher;
