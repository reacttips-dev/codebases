import React, { Component } from 'react';

import { Dropdown, DropdownMenu, DropdownButton, MenuItem } from '../base/Dropdowns';
import { Button } from '../base/Buttons';
import TeamIcon from '../base/Icons/TeamIcon';
import { Tabs, Tab } from '../base/Tabs';
import MultiSelectEntity from '../base/MultiSelectEntity';
import { getStore } from '../../stores/get-store';
import PluralizeHelper from '../../utils/PluralizeHelper';

import { decomposeUID } from '../../utils/uid-helper';
import Alert from '../messaging/Alert';
import { observer } from 'mobx-react';
import UIEventService from '../../services/UIEventService';
import { SHOW_USAGE } from '../../constants/UIEventConstants';
@observer
export default class BulkAddToWorkspaceModal extends Component {
  constructor (props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFreeTeamWarningClick = this.handleFreeTeamWarningClick.bind(this);
  }

  handleChange (field, value) {
    this.props.onChange && this.props.onChange(field, value);
  }

  getWorkspaceCollections () {
    let store = this.props.selectedWorkspace,
    collectionIds = (store && store.dependencies.collections) || [];
    return _.chain(collectionIds)

      // workspace dependency ids are uids
      .map((uid) => getStore('CollectionStore').find(decomposeUID(uid).modelId))
      .compact()
      .value();
  }

  getWorkspaceEnvironments () {
    let store = this.props.selectedWorkspace,
    environmentIds = (store && store.dependencies.environments) || [];
    return _.chain(environmentIds)

      // workspace dependency ids are uids
      .map((uid) => getStore('EnvironmentStore').find(decomposeUID(uid).modelId))
      .compact()
      .value();
  }

  getSelectedCountText () {
    let collectionsSize = _.size(this.props.selectedCollections),
      environmentsSize = _.size(this.props.selectedEnvironments),
      pluralizeCollection = PluralizeHelper.pluralize({
        count: collectionsSize,
        singular: 'collection',
        plural: 'collections'
      }),
      pluralizeEnvironment = PluralizeHelper.pluralize({
        count: environmentsSize,
        singular: 'environment',
        plural: 'environments'
      });

    return `${collectionsSize} ${pluralizeCollection} and ${environmentsSize} ${pluralizeEnvironment} selected`;
  }

  handleFreeTeamWarningClick () {
    this.props.onWarningMessageLinkClick && this.props.onWarningMessageLinkClick();
    UIEventService.publish(SHOW_USAGE);
  }

  render () {
    return (
      <div className='add-to-workspace-modal__contents'>
        <div className='add-to-workspace__input-group add-to-workspace__input-group--workspace'>
          <div className='add-to-workspace--helptext'>Select a workspace from which you want to add collections or environments to this workspace.</div>
          <div className='add-to-workspace__input-group__label'>
            Source workspace
          </div>
          <div className='add-to-workspace__input-group__input'>
            <Dropdown
              fullWidth
              className='add-to-workspace__input-group__input--selected-workspace'
              onSelect={this.handleChange.bind(this, 'selectedWorkspace')}
            >
              <DropdownButton
                size='small'
                type='secondary'
              >
                <Button>
                  <span className='workspace-name'>{ this.props.selectedWorkspace.name }</span>
                </Button>
              </DropdownButton>
              <DropdownMenu fluid>
              {
                _.map(this.props.workspaces, (workspace) => {
                  return (
                    <MenuItem key={workspace.id} refKey={workspace.id}>
                      <span>{ workspace.name }</span>
                      {
                        workspace.type === 'team' &&
                          <TeamIcon className='team-icon' />
                      }
                    </MenuItem>
                  );
                })
              }
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className='add-to-workspace-modal__choose-entities'>
          <Tabs
            type='primary'
            defaultActive={'collections'}
            activeRef={this.props.activeTab}
            onChange={this.props.onTabSelect}
            className='add-to-workspace__tabs'
          >
            <Tab refKey={'collections'} className=''>Collections</Tab>
            <Tab refKey={'environments'} className=''>Environments</Tab>
          </Tabs>
          {
            this.props.activeTab === 'collections' &&
            <MultiSelectEntity
              type='collections'
              items={this.getWorkspaceCollections()}
              selectedEntities={this.props.selectedCollections}
              onSelectEntity={this.props.onSelectCollection}
            />
          }
          {
            this.props.activeTab === 'environments' &&
            <MultiSelectEntity
              type='environments'
              items={this.getWorkspaceEnvironments()}
              selectedEntities={this.props.selectedEnvironments}
              onSelectEntity={this.props.onSelectEnvironment}
            />
          }
          <div className='add-to-workspace-modal__entities-count'>{this.getSelectedCountText()}</div>
          {
            getStore('ActiveWorkspaceStore').type === 'team' &&
            getStore('CurrentUserStore').isFreeTeamUser &&
            this.props.activeTab === 'collections' &&
            <div className='add-to-workspace-modal__alert-wrapper'>
              <Alert
                message={this.props.freeTeamWarningMessage}
                type='warn'
                isDismissable={false}
                onMessageLinkClick={this.handleFreeTeamWarningClick}
              />
            </div>
          }
        </div>
      </div>
    );
  }
}
