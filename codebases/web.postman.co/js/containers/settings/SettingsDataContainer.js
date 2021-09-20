import React, { Component } from 'react';
import SettingsData from '../../components/settings/SettingsData';
import conversion from '../../services/conversion/promisifiedConverter';
import { getStore } from '../../stores/get-store';
import { observer } from 'mobx-react';
import exportAll, { EXPORT_STATE } from '../../services/conversion/export-all';

@observer
export default class SettingsDataContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      downloadOnlyMyData: true,
      downloadInprogress: false
    };
    this.handleExportData = this.handleExportData.bind(this);
    this.handleImportData = this.handleImportData.bind(this);
    this.handleDataSetSelect = this.handleDataSetSelect.bind(this);
  }

  componentWillUnmount () {
    clearTimeout(this.timeout);
  }

  handleExportData () {
    this.setState({ downloadInprogress: true });

    let exportAllData = !this.state.downloadOnlyMyData || !this.getUserOrgStatus();
    exportAll({ exportLevel: exportAllData ? 'all' : 'user' })

      // If there were no errors, show success alert
      .then((state) => {
        state === EXPORT_STATE.SUCCESS && pm.toasts.success('Your data was exported successfully.');
      })

      // If there was some error, show error alert and log the error
      .catch((err) => {
        pm.toasts.error('Could not export the data. Please check the DevTools.');
        pm.logger.error('ExportAll: Error in pipeline', err);
      })

      // set the flag back to false
      .then(() => {
        this.setState({ downloadInprogress: false });
      });
  }

  handleImportData (files) {
    conversion().then((converter) => {
      converter.importFiles(files);
    });
  }

  handleDataSetSelect (value) {
    this.setState({ downloadOnlyMyData: value });
  }

  getUserOrgStatus () {
    let orgs = getStore('CurrentUserStore').organizations;
    return (orgs && (orgs.length > 0) && (getStore('CurrentUserStore').teamSyncEnabled));
  }

  render () {
    return (
      <SettingsData
        onImportData={this.handleImportData}
        onExportData={this.handleExportData}
        downloadOnlyMyData={this.state.downloadOnlyMyData}
        onDataSetChange={this.handleDataSetSelect}
        hasOrg={this.getUserOrgStatus()}
        downloadInprogress={this.state.downloadInprogress}
      />
    );
  }
}
