import React, { Component } from 'react';
import { Checkbox } from '../base/Inputs';
import KeyMaps from '../base/keymaps/KeyMaps';


import { SYNC_CONFLICT_HEADER_MODEL,
         SYNC_CONFLICT_HEADER_ID,
         SYNC_CONFLICT_HEADER_NAME,
         SYNC_CONFLICT_HEADER_KEY,
         SYNC_CONFLICT_HEADER_SERVER_VALUE,
         SYNC_CONFLICT_HEADER_LOCAL_VALUE,
         SYNC_CONFLICT_HEADER_IS_LOCAL_SELECTED,
         SYNC_CONFLICT_HEADER_IS_SERVER_SELECTED } from '../../constants/SyncConflictsHeaderKeys';

import SYNC_CONFLICT_HEADER_VALUE_MAP from '../../constants/SyncConflictsHeaderKeysMap';

export default class SyncConflictOld extends Component {
  constructor (props) {
    super(props);

    this.getUIConflictRows = this.getUIConflictRows.bind(this);
  }

  handleValueSelect (index, isLocalValue, value) {
    this.props.onValueSelect && this.props.onValueSelect(index, isLocalValue, value);
  }

  getKeyMapHandlers () {
    return { 'submit': pm.shortcuts.handle('submit', this.props.onSubmit) };
  }

  getConflictUIRow (conflictRow, index, valueIndex) {
    return (
      <div className='sync-conflict-wrapper' key={index}>
        <div className='sync-conflict-data-value'>
          {conflictRow.model}
        </div>
        <div className='sync-conflict-data-value'>
          {conflictRow.nameOrId}
        </div>
        <div className='sync-conflict-data-value'>
          {conflictRow.key}
        </div>
        <div className='sync-conflict-data-value'>
          <div className='sync-conflict-checkbox-wrapper'>
            <Checkbox
              checked={conflictRow.isLocalSelected}
              onChange={this.handleValueSelect.bind(this, { rowIndex: index, valueIndex }, 'local')}
              className='sync-conflict-checkbox'
            />
            <div className='sync-conflict-value'>
              {conflictRow.localText}
            </div>
          </div>
        </div>
        <div className='sync-conflict-data-value'>
          <div className='sync-conflict-checkbox-wrapper'>
            <Checkbox
              checked={conflictRow.isServerSelected}
              onChange={this.handleValueSelect.bind(this, { rowIndex: index, valueIndex }, 'server')}
              className='sync-conflict-checkbox'
            />
            <div className='sync-conflict-value'>
            {conflictRow.serverText}
            </div>
          </div>
        </div>
      </div>
    );
  }

  getUIConflictRows (conflictRows) {
    let conflictUI = conflictRows
      .map((conflictRow, rowIndex) => {
        return this.getConflictUIRow(conflictRow, rowIndex);
      });

    return _.flatten(conflictUI);
  }

  render () {
    let conflictArray = this.props.conflictArray;
    let isAllLocalValueSelected = this.props.isAllLocalValueSelected;
    let isAllServerValueSelected = this.props.isAllServerValueSelected;
    return (
      <KeyMaps keyMap={pm.shortcuts.getShortcuts()} handlers={this.getKeyMapHandlers()}>
        <div className='sync-conflict'>
          <div className='sync-conflict-wrapper'>
            <div className='sync-conflict-data-header'>
              Item Type
            </div>
            <div className='sync-conflict-data-header'>
              Item Id / Item Name
            </div>
            <div className='sync-conflict-data-header'>
              Property Name
            </div>
            <div className='sync-conflict-data-header'>
              <div className='sync-conflict-checkbox-wrapper'>
                <Checkbox
                  checked={isAllLocalValueSelected}
                  onChange={this.props.onAllLocalValueSelected}
                  className='sync-conflict-checkbox'
                />
                Local Value
              </div>
            </div>
            <div className='sync-conflict-data-header'>
              <div className='sync-conflict-checkbox-wrapper'>
                <Checkbox
                  checked={isAllServerValueSelected}
                  onChange={this.props.onAllServerValueSelected}
                  className='sync-conflict-checkbox'
                />
                Server Value
              </div>
            </div>
          </div>
          {this.getUIConflictRows(conflictArray)}
        </div>
      </KeyMaps>
    );
  }
}

SyncConflictOld.defaultProps = { conflictArray: [] };
