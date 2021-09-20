import React, { Fragment, Component } from 'react';
import _ from 'lodash';
import { Checkbox } from '../../components/base/Inputs';

import ConflictResolutionActions from './ConflictResolutionActions';

/**
 * DiffRow
 */
export function DiffRow (props) {
  const { row } = props;

  return (
    <tr className={props.className} >
      <td className='pm-diff-table__enabled'>
        <Checkbox
          disabled
          checked={_.get(row, 'value.enabled') || false}
          size='md'
        />
      </td>
      <td>
        <div className='pm-diff-table__key'>
          {_.get(row, 'value.key', '')}
        </div>
      </td>
      <td>
        <div className='pm-diff-table__value'>
          {_.get(row, 'value.value', '')}
        </div>
      </td>
      <td>
        <div className='pm-diff-table__description'>
          {_.get(row, 'value.description', '')}
        </div>
      </td>
    </tr>
  );
}

/**
 * ConflictedRow
 */
export function ConflictedRow (props) {
  const { row } = props,
    valueOfKey = _.get(row, 'value.key', []),
    valueOfDescription = _.get(row, 'value.description', []),
    valueOfValue = _.get(row, 'value.value', []);

  return (
    <tr className={row.conflict ? `pm-conflict--${row.type}` : ''} >
      {props.showEnabledColumn &&
        <td className='pm-diff-table__enabled'>
          <Checkbox
            disabled
            checked={_.get(row, 'value.enabled') || false}
            size='md'
          />
        </td>
      }
      <td className='pm-diff-table__key'>
        {valueOfKey.map((diff, index) => {
          if (!diff) {
            return null;
          }

          return (
            <span
              className='pm-diff-table__key'
              key={index}
            >
              {typeof diff === 'string' ? diff : diff.value}
            </span>
          );
        })}
      </td>
      <td className='pm-diff-table__value'>
        {valueOfValue.map((diff, index) => {
          if (!diff) {
            return null;
          }

          const diffClass = diff.added ? 'pm-diff--added' : diff.removed ? 'pm-diff--removed' : '';

          return (
            <span
              key={index}
            >
              {typeof diff === 'string' ? diff : diff.value}
            </span>
          );
        })}
      </td>
      {props.showDescriptionColumn &&
        <td className={`pm-diff-table__description ${row.conflict ? 'pm-conflict' : ''}`}>
          <Fragment>
            {valueOfDescription.map((diff, index) => {
              if (!diff) {
                return null;
              }

              return (
                <span
                  key={index}
                >
                  {typeof diff === 'string' ? diff : diff.value}
                </span>
              );
            })
            }
            {row.conflict &&
              <ConflictResolutionActions
                conflictArray={props.conflictArray}
                originalId={props.originalId}
                type={row.type}
                handleValueSelect={props.handleValueSelect}
                onResolveConflicts={() => {
                  props.onResolveConflicts(row.type, row.index);
                }}
              />
            }
          </Fragment>
        </td>
      }
    </tr>
  );
}

/**
 * TableDiffView
 */
export default class TableDiffView extends Component {
  constructor (props) {
    super(props);

    this.state = {
      diff: props.diff
    };

    this.handleConflictResolution = this.handleConflictResolution.bind(this);
  }

  handleConflictResolution (type, index) {
    this.setState({
      diff: this.state.diff.resolveConflict(type, index)
    });

    this.props.updateConflictCount && this.props.updateConflictCount();
  }

  render () {
    const diffRows = this.state.diff && this.state.diff.getDiff();

    if (!Array.isArray(diffRows)) {
      return null;
    }

    return (
      <table className='pm-diff pm-diff-table'>
        <tbody>
          <tr>
            {this.props.showEnabledColumn && <th />}

            <th className='pm-diff-table__key'><span>Key</span></th>

            <th className='pm-diff-table__value'><span>Value</span></th>

            {this.props.showDescriptionColumn &&
              <th className='pm-diff-table__description'><span>Description</span></th>
            }
          </tr>
          {diffRows.map((row, index) => {
            return (
              <Fragment key={index}>
                <ConflictedRow
                  conflictArray={this.props.conflictArray}
                  handleValueSelect={this.props.onValueSelect}
                  originalId={this.state.diff && this.state.diff.originalId}
                  row={row}
                  showDescriptionColumn={this.props.showDescriptionColumn}
                  showEnabledColumn={this.props.showEnabledColumn}
                  onResolveConflicts={(type, index) => {
                    this.handleConflictResolution(type, index);
                  }}
                />
              </Fragment>
            );
          })}
        </tbody>
      </table>
    );
  }
}
