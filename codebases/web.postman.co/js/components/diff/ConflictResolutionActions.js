import React from 'react';
import { RadioGroup, Radio } from 'react-radio-group';

import classnames from 'classnames';

/**
 * Helper function which returns the actions to resolve the conflict based on type
 *
 * @param {Object} props - props
 * @param {String} props.type - type of conflict
 * @param {Function} props.onResolveConflicts - function to resolve conflicts
 * @returns {JSX} actions to resolve conflicts
 */
export default function ConflictResolutionActions (props) {
  const type = props.type === 'source' ? 'local' : 'server',

    // checkbox should only be checked when both type and conflict item matches
    checkboxSelect = props.type === 'source' && props.conflictArray[props.originalId] &&
      props.conflictArray[props.originalId].isLocalSelected ||
      props.type === 'dest' && props.conflictArray[props.originalId] &&
      props.conflictArray[props.originalId].isServerSelected,
      radioValue = props.type;

  return (
    <div
      className={classnames(`pm-conflict-actions pm-conflict-actions__${props.type}`, { 'is-multiline': props.multiline })}
      onClick={() => { props.handleValueSelect({ rowIndex: props.originalId }, type); }}
    >
      <span>{(props.type === 'source' ? 'Local changes' : 'Server changes' || '')}</span>
      <span>
        <RadioGroup
          className='sync-conflict-radio-selector'
          selectedValue={checkboxSelect && radioValue}
          onChange={() => { props.handleValueSelect({ rowIndex: props.originalId }, type); }}
        >
          <Radio
            value={radioValue}
            className='sync-conflict-radio-button radio-button'
          />
        </RadioGroup>
      </span>
    </div>)
  ;
}
