import React, { Fragment } from 'react';
import classnames from 'classnames';
import { Icon, Heading, Text } from '@postman/aether';
import LoadingIndicator from '../../js/components/base/LoadingIndicator';

import util from '../../js/utils/util';

/**
 * Returns the icon based on workspace type
 */
function getIconName (workspace) {
  if (workspace.type === 'personal') {
    return 'icon-descriptive-user-stroke';
  }
  else if (workspace.visibilityStatus === 'public') {
    return 'icon-state-published-stroke';
  }
  else if (workspace.type === 'team' && workspace.visibilityStatus === 'private-team') {
    return 'icon-state-locked-stroke';
  }

  return 'icon-descriptive-team-stroke';
}

/**
 * Renders workspace item with an avatar
 */
export default function WorkspaceItems (props) {
  const search = props.search || '',
    selectedWorkspace = props.selectedWorkspace,
    isDisabled = Boolean(selectedWorkspace),
    isHighlightedWorkspace = (id) => id === _.get(props.highlightedWorkspace, 'id'),

    // We are taking 2 member ids from the member ids array and getting their corresponding names and
    // at max we display 2 member names and put 'and n others' for the remaining members
    subTitleTrimmer = (workspaceMemberIds) => {
      const numberOfMembersInWorkspace = workspaceMemberIds.length;

      return workspaceMemberIds.slice(0, 2).map((member) => {
        return util.getUserNameForId(member.id, props.currentUser);
      }).join(', ') + (numberOfMembersInWorkspace - 3 <= 0 ? '' :
      numberOfMembersInWorkspace - 3 === 1 ? ' and 1 other' :
      ' and ' + (numberOfMembersInWorkspace - 3) + ' others');
    };

  return props.workspaces.filter((workspace) => {
    return workspace.name.toLowerCase().includes(search.toLowerCase());
  }).map((workspace) => {
    const workspaceObj = _.find(props.allWorkspaces, { id: workspace.id }),
      workspaceMembers = _.get(workspaceObj, 'members.users') || {},
      workspaceMemberIds = Object.keys(workspaceMembers).map((userId) => {
        return { id: userId };
      }),
      className = classnames('api-overview-workspace', { 'api-overview-workspace--disabled': isDisabled },
        { 'api-overview-workspace--highlighted': isHighlightedWorkspace(workspace.id) }),
      subTitle = subTitleTrimmer(workspaceMemberIds);

    return (
      <div
        className={className}
        key={workspace.id}
        onClick={() => {
          if (isDisabled) {
            return;
          }

          props.onSelect && props.onSelect(workspace);
        }}
      >
        <div className='api-overview-workspace__type'>
          <Icon
            name={getIconName(workspaceObj)}
          />
        </div>
        <div className='api-overview-workspace-meta'>
          <div className='api-overview-workspace-meta__name'>
            {props.isModal ?
              <Heading text={workspace.name} type='h4' styleAs='h6' color='content-color-primary' /> :
              <Fragment>
                <Text
                  typographyStyle={{
                  fontSize: 'text-size-l',
                  fontWeight: 'text-weight-medium',
                  lineHeight: 'line-height-m',
                  fontFamily: 'text-family-default'
                }}
                >
                  {workspace.name}
                </Text>

                <span className='api-overview-workspace-open'>
                  <Fragment>
                    {props.actionText || 'Open'}
                    <Icon name='icon-direction-forward' />
                  </Fragment>
                </span>
              </Fragment>
            }

          </div>
          <span className='api-overview-workspace-meta__members' title={subTitle}>
            {subTitle}
          </span>
        </div>
      </div>
    );
  });
}
