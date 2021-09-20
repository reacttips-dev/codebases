import React, { Component } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../components/base/Modals';
import SyncConflict from '../../components/sync/SyncConflict';
import SyncConflictFooter from '../../components/sync/SyncConflictFooter';
import SyncConflictErrorBoundary from './SyncConflictErrorBoundary';
import AnalyticsService from '../../modules/services/AnalyticsService';
import { submitUserResolution } from '../../modules/sync-timeline-helpers/ConflictResolutionsService';
import { createEvent } from '../../modules/model-event';
import { Tabs, Tab } from '../../components/base/Tabs';
import LoadingIndicator from '../../components/base/LoadingIndicator';
import CollectionIcon from '../../components/base/Icons/CollectionIcon';
import EnvironmentIcon from '../../components/base/Icons/EnvironmentIcon';
import { getStore } from '../../stores/get-store';
import { decomposeUID } from '../../utils/uid-helper';
import { Button } from '../../components/base/Buttons';
import { Tooltip, TooltipBody } from '../../components/base/Tooltips';

const storeMap = {
  'request': 'RequestStore',
  'folder': 'FolderStore',
  'environment': 'EnvironmentStore',
  'response': 'ResponseStore',
  'collection': 'CollectionStore'
};

/**
 * @param {String} props.entity - Name of entity
 * @param {Boolean} props.disabled - Disabled icon prop
 */
export function iconMap (entity, disabled) {
  const iconMap = {
    'collection':
      <CollectionIcon
        className={classnames('dropdown-menu-item-icon menu-icon--collection sync-conflict__model-icon',
          { 'sync-conflict__model-icon-disabled': disabled })}
      />,
    'environment':
      <EnvironmentIcon
        className={classnames('dropdown-menu-item-icon menu-icon--collection sync-conflict__model-icon',
          { 'sync-conflict__model-icon-disabled': disabled })}
      />
  };

  return iconMap[entity];
}

@observer
export default class SyncConflictModalContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpen: false,
      conflictsInTimeline: {},
      activeTab: null,
      timelines: {},
      isTooltipVisible: false
    };

    this.handleValueSelect = this.handleValueSelect.bind(this);
    this.handleAllLocalValueSelected = this.handleAllLocalValueSelected.bind(this);
    this.handleAllServerValueSelected = this.handleAllServerValueSelected.bind(this);
    this.handleResync = this.handleResync.bind(this);
    this.resyncAllTimelines = this.resyncAllTimelines.bind(this);
    this.openModal = this.openModal.bind(this);
    this.showConflicts = this.showConflicts.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.attachModelListeners();
    this.fetchPendingConflicts();

    _.invoke(this, 'keymapRef.focus');
  }

  componentWillUnmount () {
    this.detachModelListeners();
  }

  fetchPendingConflicts () {
    pm.eventBus.channel('conflict-resolution').publish(createEvent('pushPending', 'conflicts'));
  }

  showTooltip () {
    !this.state.isTooltipVisible && this.setState({ isTooltipVisible: true });
  }

  hideTooltip () {
    this.state.isTooltipVisible && this.setState({ isTooltipVisible: false });
  }

  attachModelListeners () {
    this.unsubscribe = pm.eventBus.channel('conflict-resolution').subscribe(this.showConflicts);
  }

  handleTabChange (value) {
    this.setState({ activeTab: value });
  }

  detachModelListeners () {
    this.unsubscribe && this.unsubscribe();
  }

  showConflicts (event) {
    if (!event || event.namespace !== 'conflicts' || event.name !== 'show') {
      return;
    }

    this.openModal(event.data.conflicts, event.data.timeline);
    AnalyticsService.addEventV2({
      category: 'sync_failure',
      action: 'resolve_conflicts',
      label: 'request_view'
    });
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

      this.setState({
        timelines: Object.keys(this.state.conflictsInTimeline)
      });
    });
  }

  handleClose () {
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
        isNoMoreConflictsToResolve = false,
        timelinesLeftToResolve = this.state.timelines;

    currentTimelineRemoved[timeline] = null;

    // remove the timeline from state
    timelinesLeftToResolve = _.pull(timelinesLeftToResolve, timeline);

    isNoMoreConflictsToResolve = _.chain(currentTimelineRemoved)
      .values()
      .compact()
      .isEmpty()
      .value();

    if (isNoMoreConflictsToResolve) {
      this.handleClose();

      this.setState({
        conflictsInTimeline: {}
      });
    }

    this.setState({
      currentTimelineRemoved,
      activeTab: timelinesLeftToResolve[0]
    });
  }

  filterConflictsByTimeline (conflicts, timeline) {
    return _.pick(conflicts, timeline);
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

  constructDiffObjectbyModelId (conflicts) {
    let byId = {};

    conflicts && _.isArray(conflicts) && conflicts.map((element) => {
      if (!byId[element.modelId]) {
        byId[element.modelId] = {};
      }
    });

    let result = byId;

    // maintain this index in filtered array since it will be used to select and resync the original conflict array
    conflicts.forEach((conflict, index) => {
      conflict.conflictArrayIndex = index;
    });

    // organize this to make this compatible with pmDiff utils
    Object.keys(byId).forEach((element, index, value) => {
      let conflictObj = {};

      conflictObj.localValues = {};
      conflictObj.serverValues = {};

      const filteredConflicts = conflicts.filter((e) => {
        return e.modelId === element;
      });

      filteredConflicts.forEach((element) => {
        conflictObj.localValues[element.key] = {
          value: element.localValue,
          id: element.conflictArrayIndex
        },
        conflictObj.serverValues[element.key] = {
          value: element.serverValue,
          id: element.conflictArrayIndex
        },
        conflictObj.model = element.model;
      });

      result[element] = conflictObj;
    });

    return _.sortBy(Object.values(result), ['model']);
  }

  getTimelineMeta (timelineData) {
    return getStore(storeMap[timelineData[0]]).find(decomposeUID(timelineData[1]).modelId);
  }

  render () {
    const defaultActiveTabRef = this.state.conflictsInTimeline && Object.keys(this.state.conflictsInTimeline).length > 0 &&
      Object.keys(this.state.conflictsInTimeline)[0],
      isHydrated = getStore('RequestStore').isHydrated && getStore('FolderStore').isHydrated &&
        getStore('CollectionStore').isHydrated && getStore('EnvironmentStore').isHydrated;

    return (
        <Modal
          className='sync-conflict-modal'
          isOpen={this.state.isOpen}
          customStyles={this.getCustomStyles()}
        >
          <SyncConflictErrorBoundary
            handleClose={this.handleClose.bind(this)}
          >
            <ModalHeader>RESOLVE SYNC CONFLICTS</ModalHeader>
              <ModalContent className='sync-conflict-modal__content'>
                <Tabs
                  className='share-entity-modal-container--tabs sync-conflict-modal__tabs'
                  type='primary'
                  defaultActive={defaultActiveTabRef.toString()}
                  activeRef={this.state.activeTab || defaultActiveTabRef.toString()}
                  onChange={this.handleTabChange}
                >
                  {_.map(this.state.conflictsInTimeline, (timelineConflicts, timeline) => {
                    const conflictTimelineData = timeline.split(':'),
                      timelineMeta = this.getTimelineMeta(conflictTimelineData) || {};

                    return (
                      <Tab
                        className='sync-conflict-modal__tab'
                        refKey={timeline}
                        key={timeline}
                        disabled={!timelineConflicts}
                      >
                        <div
                          className='sync-conflict-modal__entity-name'
                          title={`${timelineMeta.name}`}
                        >
                          {iconMap([conflictTimelineData[0]], !timelineConflicts)}{timelineMeta.name}
                        </div>
                        <Button
                          className={classnames('sync-conflict-badge', { 'sync-conflict-badge-disabled': !timelineConflicts })}
                          size='small'
                          focusable
                        >
                          {(_.get(this.state.conflictsInTimeline, [timeline, 'conflicts']) || []).length || 0}
                      </Button>
                      </Tab>
                    );
                  })}
                </Tabs>
                {isHydrated ?
                  <div className='sync-conflict-body'>
                    <div className='sync-conflict-tooltip'>
                      <span
                        ref='tooltipTarget'
                        className='sync-conflict-info'
                        onMouseEnter={this.showTooltip}
                        onMouseLeave={this.hideTooltip}
                      >
                        Why am I seeing this?
                      </span>

                      <Tooltip
                        immediate
                        placement='right'
                        show={this.state.isTooltipVisible}
                        target={this.refs.tooltipTarget}
                      >
                        <TooltipBody>
                          <span>
                            We found some conflicts between the local and synced version of this collection.
                            To finish syncing, resolve these conflicts.
                          </span>
                        </TooltipBody>
                      </Tooltip>
                    </div>
                    {_.map(this.filterConflictsByTimeline(this.state.conflictsInTimeline, this.state.activeTab || defaultActiveTabRef), (timelineConflicts, timeline) => {
                      if (!timelineConflicts) {
                        return null;
                      }

                      return (
                        <div
                          className='sync-conflict__conflict-wrapper'
                          key={timeline}
                        >
                          <SyncConflict
                            conflictArray={timelineConflicts.conflicts}
                            constructDiffObjectbyModelId={this.constructDiffObjectbyModelId}
                            isAllLocalValueSelected={timelineConflicts.isAllLocalValueSelected}
                            isAllServerValueSelected={timelineConflicts.isAllServerValueSelected}
                            storeMap={storeMap}
                            timeline={timeline}
                            onValueSelect={this.handleValueSelect.bind(this, timeline)}
                            onAllLocalValueSelected={() => this.handleAllLocalValueSelected(timeline)}
                            onAllServerValueSelected={() => this.handleAllServerValueSelected(timeline)}
                            onSubmit={() => this.handleResync(timeline)}
                          />
                        </div>
                      );
                    })}
                  </div> :

                  // show loading state when stores are hydrating
                  <div className='sync-conflict__isLoading'>
                    <LoadingIndicator />
                  </div>
                }
              </ModalContent>
              <ModalFooter>
                <SyncConflictFooter
                  isHydrated={isHydrated}
                  keymapRef={(ref) => { this.keymapRef = ref; }}
                  onAllServerValueSelected={() => this.handleAllServerValueSelected(this.state.activeTab || defaultActiveTabRef)}
                  onResyncClicked={() => this.handleResync(this.state.activeTab || defaultActiveTabRef)}
                />
            </ModalFooter>
          </SyncConflictErrorBoundary>
        </Modal>
    );
  }
}
