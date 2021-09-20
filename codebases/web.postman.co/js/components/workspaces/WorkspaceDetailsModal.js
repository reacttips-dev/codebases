import React, { Component } from 'react';
import DateHelper from '@postman/date-helper';

import SortableTable from '../base/SortableTable';
import Avatar from '../base/Avatar';
import ProfileIcon from '../base/Icons/ProfileIcon';
import TeamIcon from '../base/Icons/TeamIcon';
import TimeIcon from '../base/Icons/TimeIcon';
import PluralizeHelper from '../../utils/PluralizeHelper';
import util from '../../utils/util';
import { getStore } from '../../stores/get-store';

export default class WorkspaceDetailsModal extends Component {
  constructor (props) {
    super(props);
  }

  getUserRow (user) {
    if (!user) {
      return false;
    }

    return (
      <div className='user__row'>
        <Avatar
          userId={user.id}
        />
        <div className='user__row__details'>
          <div className='user__row__details__name'>{ user.name }</div>
          <div className='user__row__details__email'>{ user.email }</div>
        </div>
      </div>
    );
  }

  render () {
    let workspace = this.props.workspace,
      creatorId = _.get(workspace, 'createdBy.id'),
      members = getStore('CurrentUserStore').teamMembers,
      creatorDisplayName = _.get(workspace, 'createdBy.name') ||
        _.get(workspace, 'createdBy.username') ||
        _.get(workspace, 'createdBy.email');

    return (
      <div className='workspace-details'>
        <div className='workspace-details__name'>
          { workspace.name }
        </div>

        <div className='workspace-details__summary'>
          { workspace.description }
        </div>

        <div className='workspace-details__owner'>
          <ProfileIcon className='workspace-details__owner__icon' />
          <div className='workspace-details__owner__owner'>
            Created by
            {
              !members.has(creatorId) && getStore('CurrentUserStore').teamSyncEnabled ?
                ' Deactivated User' :
                ` ${creatorDisplayName}`
            }
          </div>
        </div>

        <div className='workspace-details__last-updated'>
          <TimeIcon className='workspace-details__last-updated__icon' />
          <div className='workspace-details__last-updated__last-updated'>
            { `Last updated: ${_.upperFirst(DateHelper.getFormattedDate(workspace.updatedAt))}` }
          </div>
        </div>

        <div className='workspace-details__member-count'>
          <TeamIcon className='workspace-details__member-count__icon' />
          <div className='workspace-details__member-count__member-count'>
            {
              `${_.size(workspace.members.users)} ${PluralizeHelper.pluralize({
                count: _.size(workspace.members.users),
                singular: 'Member',
                plural: 'Members'
              })}`
            }
          </div>
        </div>

        <div className='workspace-details__members'>
          <SortableTable
            header='USER'
            rows={workspace.members.users}
            rowKey='name'
            rowRenderer={this.getUserRow}
          />
        </div>
      </div>
    );
  }
}
