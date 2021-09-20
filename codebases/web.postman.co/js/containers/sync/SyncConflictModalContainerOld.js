import React, { Component } from 'react';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../components/base/Modals';
import SyncConflictOld from '../../components/sync/SyncConflictOld';
import SyncConflictFooterOld from '../../components/sync/SyncConflictFooterOld';
import AnalyticsService from '../../modules/services/AnalyticsService';
import { submitUserResolution } from '../../modules/sync-timeline-helpers/ConflictResolutionsService';
import { createEvent } from '../../modules/model-event';
import CrashHandler from '../../../js/components/empty-states/CrashHandler';

export default class SyncConflictModalContainerOld extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false,
      conflictsInTimeline: {}
    };

    this.handleValueSelect = this.handleValueSelect.bind(this);
    this.handleAllLocalValueSelected = this.handleAllLocalValueSelected.bind(this);
    this.handleAllServerValueSelected = this.handleAllServerValueSelected.bind(this);
    this.handleResync = this.handleResync.bind(this);
    this.openModal = this.openModal.bind(this);
    this.showConflicts = this.showConflicts.bind(this);
    this.resyncAllTimelines = this.resyncAllTimelines.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.attachModelListeners();
    this.fetchPendingConflicts();
  }

  componentWillUnmount () {
    this.detachModelListeners();
  }

  fetchPendingConflicts () {
    pm.eventBus.channel('conflict-resolution').publish(createEvent('pushPending', 'conflicts'));
  }

  attachModelListeners () {
    this.unsubscribe = pm.eventBus.channel('conflict-resolution').subscribe(this.showConflicts);
  }

  detachModelListeners () {
    this.unsubscribe && this.unsubscribe();
  }

  showConflicts (event) {
    if (!event || event.namespace !== 'conflicts' || event.name !== 'show') {
      return;
    }

    this.openModal(event.data.conflicts, event.data.timeline);
    AnalyticsService.addEvent('sync', 'conflict');
  }

  openModal (conflicts, timeline) {
    this.setState({
      isOpen: true,
      conflictsInTimeline: {
        ...this.state.conflictsInTimeline,
        [`${timeline.model}:${timeline.modelId}`]: { conflicts }
      }
    }, () => {
      this.computeBulkAction();
    });
  }

  handleClose () {
    this.props.handleModalClose();

    this.setState({
      isOpen: false,
      conflictArray: []
    }, () => {
      this.computeBulkAction();
    });
  }

  getCustomStyles () {
    return {
      height: '80vh',
      width: '720px'
    };
  }

  handleValueSelect (timeline, index, value) {
    let tempConflictArray = _.cloneDeep(this.state.conflictsInTimeline[timeline].conflicts);

    let row = tempConflictArray[index.rowIndex];

    if (Array.isArray(row.value)) {
      row = row.value[index.valueIndex];
    }

    if (value === 'local') {
      row.isLocalSelected = true;
      row.isServerSelected = false;
    }
    else {
      row.isServerSelected = true;
      row.isLocalSelected = false;
    }
    this.setState({
      conflictsInTimeline: {
        ...this.state.conflictsInTimeline,
        [timeline]: {
          ...this.state.conflictsInTimeline[timeline],
          conflicts: tempConflictArray
        }
      }
    }, () => {
      this.computeBulkAction();
    });
  }

  resyncAllTimelines () {
    // add analytics when fallback is server changes in case of error
    AnalyticsService.addEventV2({
      category: 'sync_failure',
      action: 'resolve_conflicts_server_only',
      label: 'request_view'
    });

    (Object.keys(this.state.conflictsInTimeline) || []).forEach((timeline) => {
      this.handleResync(timeline);
    });
  }

  computeBulkAction () {
    let finalState = _.cloneDeep(this.state.conflictsInTimeline);

    _.forEach(finalState, (conflictsPerTimeline) => {
      if (!conflictsPerTimeline) {
        return;
      }

      conflictsPerTimeline.isAllLocalValueSelected = _.every(conflictsPerTimeline.conflicts, (data) => {
        if (Array.isArray(data.value)) {
          return _.every(data.value, (valueRow) => valueRow.isLocalSelected);
        }
        return data.isLocalSelected;
      });

      conflictsPerTimeline.isAllServerValueSelected = _.every(conflictsPerTimeline.conflicts, (data) => {
        if (Array.isArray(data.value)) {
          return _.every(data.value, (valueRow) => valueRow.isServerSelected);
        }
        return data.isServerSelected;
      });
    });

    this.setState({
      conflictsInTimeline: finalState
    });
  }

  handleAllLocalValueSelected (timeline) {
    let tempConflictArray = _.cloneDeep(this.state.conflictsInTimeline[timeline]).conflicts;
    _.forEach(tempConflictArray, (data) => {
      if (Array.isArray(data.value)) {
        _.forEach(data.value, (row) => {
          row.isLocalSelected = true;
          row.isServerSelected = false;
        });
      }
      else {
        data.isLocalSelected = true;
        data.isServerSelected = false;
      }
      return data;
    });

    this.setState({
      conflictsInTimeline: {
        ...this.state.conflictsInTimeline,
        [timeline]: {
          isAllLocalValueSelected: true,
          isAllServerValueSelected: false,
          conflicts: tempConflictArray
        }
      }
    });
  }

  handleAllServerValueSelected (timeline) {
    let tempConflictArray = _.cloneDeep(this.state.conflictsInTimeline[timeline]).conflicts;
    _.forEach(tempConflictArray, (data) => {
      if (Array.isArray(data.value)) {
        _.forEach(data.value, (row) => {
          row.isLocalSelected = false;
          row.isServerSelected = true;
        });
      }
      else {
        data.isLocalSelected = false;
        data.isServerSelected = true;
      }
      return data;
    });

    this.setState({
      conflictsInTimeline: {
        ...this.state.conflictsInTimeline,
        [timeline]: {
          isAllLocalValueSelected: false,
          isAllServerValueSelected: true,
          conflicts: tempConflictArray
        }
      }
    });
  }

  handleResync (timeline) {
    let [model, modelId] = timeline.split(':');

    submitUserResolution(_.get(this.state.conflictsInTimeline, [timeline, 'conflicts']), { model, modelId });

    let currentTimelineRemoved = this.state.conflictsInTimeline,
        isNoMoreConflictsToResolve = false;

    currentTimelineRemoved[timeline] = null;

    isNoMoreConflictsToResolve = _.chain(currentTimelineRemoved)
      .values()
      .compact()
      .isEmpty()
      .value();

    if (isNoMoreConflictsToResolve) {
      this.handleClose();
    }

    this.setState(currentTimelineRemoved);
  }

  render () {
    return (
      <CrashHandler
        errorMessage='Error ocuurred in older conflict resolution modal while rendering'
        message='We were unable to load the conflicts. Our engineers have been notified and we should
          have this fixed shortly.'
        buttonText='Use server changes'
        onClose={this.resyncAllTimelines}
      >
        <ModalHeader>RESOLVE SYNC CONFLICTS</ModalHeader>
        <ModalContent>
          {_.map(this.state.conflictsInTimeline, (timelineConflicts, timeline) => {
            if (!timelineConflicts) {
              return null;
            }

            return (
              <div key={timeline}>
                <SyncConflictOld
                  conflictArray={timelineConflicts.conflicts}
                  isAllLocalValueSelected={timelineConflicts.isAllLocalValueSelected}
                  isAllServerValueSelected={timelineConflicts.isAllServerValueSelected}
                  onValueSelect={this.handleValueSelect.bind(this, timeline)}
                  onAllLocalValueSelected={() => this.handleAllLocalValueSelected(timeline)}
                  onAllServerValueSelected={() => this.handleAllServerValueSelected(timeline)}
                  onSubmit={() => this.handleResync(timeline)}
                />
                <SyncConflictFooterOld
                  onResyncClicked={() => this.handleResync(timeline)}
                />
              </div>
            );
          })}
        </ModalContent>
      </CrashHandler>
    );
  }
}
