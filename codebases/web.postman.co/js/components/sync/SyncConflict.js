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

import pmDiff from '../../utils/pmDiff/index';
import DiffViewByProperty from '../../components/diff';
import CollectionIcon from '../../components/base/Icons/CollectionIcon';
import EnvironmentIcon from '../../components/base/Icons/EnvironmentIcon';
import RequestIcon from '@@runtime-repl/request-http/RequestIcon';
import ResponseIcon from '../../components/base/Icons/ResponseIcon';
import FolderIcon from '../../components/base/Icons/FolderIcon';
import { getStore } from '../../stores/get-store';
import { observer } from 'mobx-react';
import collapsible from '../../utils/Collapsible';
import RightSolidIcon from '../../components/base/Icons/RightSolidIcon';
import DownSolidIcon from '../../components/base/Icons/DownSolidIcon';

const iconMap = {
  'collection': <CollectionIcon className='dropdown-menu-item-icon menu-icon--collection sync-conflict__model-icon' />,
  'environment': <EnvironmentIcon className='dropdown-menu-item-icon menu-icon--collection sync-conflict__model-icon' />,
  'response': <ResponseIcon className='dropdown-menu-item-icon menu-icon--collection sync-conflict__model-icon' />,
  'folder': <FolderIcon className='dropdown-menu-item-icon menu-icon--collection sync-conflict__model-icon' />
},
CollapsibleDiff = collapsible(({ pmConvertedDiff, conflictArray, index, itemMeta, handleValueSelect, expanded, toggleExpanded }) => {
  return (
    <div key={index}>
      <h3 id={index}>
      {expanded ?
        <DownSolidIcon
          className='pm-diff-body__toggle'
          onClick={toggleExpanded}
        /> :
        <RightSolidIcon
          className='pm-diff-body__toggle'
          onClick={toggleExpanded}
        />
      }
      {pmConvertedDiff[0] && pmConvertedDiff[0].itemType === 'request' ?
        <RequestIcon
          className='sync-conflict-item__request'
          methodClassname='sync-conflict-item__request-method'
          method={itemMeta.method}
        /> :
        iconMap[pmConvertedDiff[0] && pmConvertedDiff[0].itemType]
      }
      <span
        className='sync-conflict-item-name'
        title={itemMeta.name}
      >
        {itemMeta.name}
      </span>
    </h3>

      {expanded &&
        <div className='sync-conflict-item-body'>
          {pmConvertedDiff.map((diff, index) => {
            return (
              <div key={index}>
                <div className='sync-conflict-item__property'>{(diff.propertyName || '').toUpperCase()}</div>
                <span className='sync-conflict__conflict-badge'>CONFLICT</span>
                <DiffViewByProperty
                  key={index}
                  conflictArray={conflictArray}
                  diff={diff}
                  onValueSelect={handleValueSelect}
                />
              </div>
            );
          })}
        </div>
      }
    </div>
  );
});

@observer
export default class SyncConflict extends Component {
  constructor (props) {
    super(props);

    this.handleValueSelect = this.handleValueSelect.bind(this);
    this.getItemMeta = this.getItemMeta.bind(this);
  }

  handleValueSelect (index, isLocalValue, value) {
    this.props.onValueSelect && this.props.onValueSelect(index, isLocalValue, value);
  }

  getKeyMapHandlers () {
    return { 'submit': pm.shortcuts.handle('submit', this.props.onSubmit) };
  }

  getItemMeta (item, itemId) {
    return getStore(this.props.storeMap[item]).find(itemId);
  }

  render () {

    let conflictArray = this.props.conflictArray;
    let isAllLocalValueSelected = this.props.isAllLocalValueSelected;
    let isAllServerValueSelected = this.props.isAllServerValueSelected;
    let result = this.props.constructDiffObjectbyModelId(this.props.conflictArray);

    return (
      <React.Fragment>
        {_.map(result, (timelineConflicts, timeline) => {
          if (!timelineConflicts) {
            return null;
          }

        let changedProperties = Object.keys(timelineConflicts.localValues),
          normalisedDiff = changedProperties.reduce((acc, property) => {
            acc[property] = {
              to: timelineConflicts && timelineConflicts.localValues && timelineConflicts.localValues[property] && timelineConflicts.localValues[property].value,
              from: timelineConflicts && timelineConflicts.serverValues && timelineConflicts.serverValues[property] && timelineConflicts.serverValues[property].value,
              originalId: timelineConflicts && timelineConflicts.localValues && timelineConflicts.localValues[property] && timelineConflicts.localValues[property].id
            };

            return acc;
          }, {});

        // API doesn't support the diff for created/deleted/transferred so only allowing modified
        const pmConvertedDiff = pmDiff(timelineConflicts.model, 'modified', normalisedDiff);

        return (
          <div className='sync-conflict-item-wrapper' key={timeline}>
            <CollapsibleDiff
              pmConvertedDiff={pmConvertedDiff}
              index={timeline}
              conflictArray={conflictArray}
              itemMeta={this.getItemMeta(
                pmConvertedDiff && pmConvertedDiff[0] && pmConvertedDiff[0].itemType,
                conflictArray[pmConvertedDiff[0] && pmConvertedDiff[0].originalId] &&
                conflictArray[pmConvertedDiff[0] && pmConvertedDiff[0].originalId].modelId) || {}
              }
              handleValueSelect={this.handleValueSelect}
            />
          </div>
        );
        })}
      </React.Fragment>
    );
  }
}

SyncConflict.defaultProps = { conflictArray: [] };
