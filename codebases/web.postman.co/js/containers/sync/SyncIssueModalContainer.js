import React, { Component } from 'react';
import util from '../../utils/util';
import SyncIssueHelper from '../../utils/SyncIssueHelper';
import AnalyticsService from '../../modules/services/AnalyticsService';

import { Modal, ModalHeader, ModalContent } from '../../components/base/Modals';
import SyncIssue from '../../components/sync/SyncIssue';
import { getStore } from '../../stores/get-store';
import { observer } from 'mobx-react';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';
const COLLECTION_ENTITIES = ['collection', 'folder', 'request', 'response'];

@observer
export default class SyncIssueModalContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false,
      errorLog: '',
      changeSet: ''
    };
    this.openModal = this.openModal.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleResyncNow = this.handleResyncNow.bind(this);
    this.handleDiscardChange = this.handleDiscardChange.bind(this);
    this.handleErrorReporting = this.handleErrorReporting.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.attachModelListeners();
  }

  componentWillUnmount () {
    this.detachModelListeners();
  }

  attachModelListeners () {
    pm.mediator.on('showSyncIssue', this.openModal);
  }

  detachModelListeners () {
    pm.mediator.off('showSyncIssue', this.openModal);
  }

  openModal (changeSet) {
    this.setState({
      errorLog: this.constructErrorLog(changeSet),
      isOpen: true,
      changeSet: changeSet
    });
  }

  handleResyncNow () {
    let changeSet = this.state.changeSet,
        { entity, data, res } = changeSet,
        analyticsLog = SyncIssueHelper.constructLogToAnalytics(changeSet);
    if (entity && data) {
      if (_.includes(COLLECTION_ENTITIES, entity)) {
        let id = entity === 'collection' ? data.id : data.collection;
        pm.syncManager.forceSyncCollectionAndContinue(id);
        AnalyticsService.addEvent('sync', 'force_collection', 'issue', null, analyticsLog);
      }
      else {
        pm.syncManager.forceSync() && AnalyticsService.addEvent('sync', 'force', 'issue', null, analyticsLog);
      }
    }

    // Don't want anything to block the UI, so closing it without any restrictions
    this.handleClose();
  }

  handleDiscardChange () {
    // @todo numaan drop changeset and resume
    AnalyticsService.addEvent('sync', 'discard_changeset', 'issue', null, SyncIssueHelper.constructLogToAnalytics(this.state.changeSet));

    // Don't want anything to block the UI, so closing it without any restrictions
    this.handleClose();
  }

  handleErrorReporting () {
    let changeSet = this.state.changeSet,
        link = this.constructMailBody(changeSet);
    try {
      link = encodeURI(link);
    }
    catch (e) {
      pm.logger.error(e);
    }
    finally {
      openExternalLink(link);
      AnalyticsService.addEvent('sync', 'report_issue', 'issue', null, SyncIssueHelper.constructLogToAnalytics(changeSet));
    }
  }

  handleClose () {
    this.setState({
      isOpen: false,
      errorLog: '',
      changeSet: ''
    });
  }

  constructMailBody (changeSet) {
    let link = 'mailto:help@getpostman.com?Subject=Error Syncing data&body=',
        messageBody = [
          this.getAppBasicInfoTemplateString(),
          'Entity: ' + changeSet.entity,
          'Action: ' + changeSet.verb,
          'Request Size: ' + changeSet.dataSize
        ];
    if (changeSet.res && changeSet.res.error) {
      messageBody.push('Error: ' + util.beautifyJs(changeSet.res.error));
    }
    else {
      messageBody.push('Error: ' + util.beautifyJs({ name: 'Timeout' }));
    }
    return (link + messageBody.join('\n'));
  }

  constructErrorLog (changeSet) {
    let log = [
      'Entity: ' + changeSet.entity,
      'Action: ' + changeSet.verb,
      'Request Size: ' + changeSet.dataSize
    ];
    if (changeSet.res && changeSet.res.error) {
      log.push('Error: ' + util.beautifyJs(changeSet.res.error));
    }
    else {
      log.push('Error: timeout');
    }
    return log.join('\n');
  }

  /**
    Having this here now, will move to util if they need in more places
  */
  getAppBasicInfoTemplateString () {
    let currentUser = getStore('CurrentUserStore');


    let appInfo = pm.app.get('info'),
        info = [
          'App ID: ' + pm.app.get('installationId'),
          'Version: ' + appInfo.version,
          'User ID: ' + currentUser.id,
          'App Type: Electron',
          'OS: ' + appInfo.os,
          'Architecture: ' + appInfo.architecture
        ];
    return info.join('\n');
  }

  getCustomStyles () {
    return {
      height: '515px',
      width: '480px'
    };
  }

  render () {

    return (
      <Modal
        isOpen={this.state.isOpen}
        customStyles={this.getCustomStyles()}
      >
        <ModalHeader>SYNC ISSUES</ModalHeader>
        <ModalContent>
          <SyncIssue
            errorLog={this.state.errorLog}
            onDiscardChange={this.handleDiscardChange}
            onErrorReporting={this.handleErrorReporting}
            onResyncNow={this.handleResyncNow}
          />
        </ModalContent>
      </Modal>
    );
  }
}
