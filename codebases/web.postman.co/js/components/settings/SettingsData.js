import React, { Component } from 'react';
import { Button } from '../base/Buttons';
import { Input } from '../base/Inputs';
import { Icon, Text, Heading, FileUploader } from '@postman/aether';

import GetUniqueIdHelper from '../../utils/GetUniqueIdHelper';
import CloseIcon from '../base/Icons/CloseIcon';
import InformationIcon from '../base/Icons/InformationIcon';
import { Tooltip, TooltipBody } from '../base/Tooltips';
import { getStore } from '../../stores/get-store';
import SyncWorkspaceController from '../../modules/controllers/SyncWorkspaceController';
import Link from '../../../appsdk/components/link/Link';
import { DropZone } from '../../../js/components/base/DropZone';

export default class SettingsData extends Component {
  constructor (props) {
    super(props);
    this.state = {
      uniqueName: GetUniqueIdHelper.generateUniqueId(),
      showTooltip: false,
      showWarning: true,
      workspaces: []
    };

    this.handleExportData = this.handleExportData.bind(this);
    this.handleImportData = this.handleImportData.bind(this);
    this.toggleTooltip = this.toggleTooltip.bind(this);
  }

  componentDidMount () {
    getStore('CurrentUserStore').isLoggedIn && SyncWorkspaceController.getAll()
      .then((workspaces) => {
        this.setState({
          workspaces: workspaces
        });
      })
      .catch((err) => {
        pm.logger.error('Could not find workspaces', err);
        pm.toasts.error('Could not find workspaces');
      });
  }

  handleExportData () {
    this.props.onExportData && this.props.onExportData();
  }

  handleImportData (value) {
    this.props.onImportData && this.props.onImportData(value);
  }

  toggleTooltip () {
    this.setState((prevState) => {
      return { showTooltip: !prevState.showTooltip };
    });
  }

  render () {
    const userPrefStore = getStore('UserPreferenceStore');
    const workspaces = this.state.workspaces;
    const currentUserStore = getStore('CurrentUserStore');
    const workspacesUserHasNotVisited = workspaces.filter((workspace) => {
      const pref = userPrefStore.find(`workspace:${workspace.id}:isHistoryAndRunsPulled`);

      return !pref || !pref.value;
    });

    return (
      <div className='settings-data-wrapper'>
        <div className='settings-data-header'>
          <Heading text='Export data' type='h3' styleAs='h5' />
        </div>

        <div className='settings-data-header-description'>
          <Text type='para'>Export all your collections to a single dump file.</Text>
          {
            pm.isScratchpad &&
            <React.Fragment>
              <br />
              <Text type='strong'>Note: </Text>
              <Text type='para'>Exporting a data dump will save your globals from different workspaces as individual environments.</Text>
            </React.Fragment>
          }
        </div>
        {
          this.props.downloadInprogress &&
          <div className='settings-data-export-button-wrapper'>
            <Button type='primary' className='settings-data-export-button'>
              <Text type='strong'>Exporting...</Text>
            </Button>
          </div>
        }
        {
          !this.props.downloadInprogress &&
          <div className='settings-data-export-button-wrapper'>
            {
              pm.isScratchpad ?
              (
                <Button type='primary' className='settings-data-export-button' onClick={this.handleExportData}>
                  <Text type='strong'>Export Data</Text>
                </Button>
              ) : (
                <Link to={`${pm.artemisUrl}/me/export`}>
                  <Button type='primary' className='settings-data-export-button'>
                    <Text type='strong'>Export Data</Text>
                  </Button>
                </Link>
              )
            }
          </div>
        }
        <div className='settings-data-section-separator' />
        <div className='settings-data-header'>
          <Heading text='Import data' type='h3' styleAs='h5' />
        </div>
        <div className='settings-data-header-description'>
          <Text type='para'>Import a Postman data dump. This may overwrite existing data.</Text>
        </div>
        <div>
          <Button type='secondary' className='settings-data-import-button'>
            <DropZone
              multiple
              ref='importData'
              type='file'
              onDropFile={this.handleImportData}
            >
              Choose files
            </DropZone>
          </Button>
        </div>
      </div>
    );
  }
}
