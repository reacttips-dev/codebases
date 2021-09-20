import React, { Fragment, Component } from 'react';
import _ from 'lodash';

import ConflictResolutionActions from './ConflictResolutionActions';

/**
 * ConflictedCodeBlock
 */
export function ConflictedCodeBlock (props) {
  if (!props.lines || !props.lines.length) {
    return null;
  }

  return (
    <div className={`pm-conflict pm-conflict--${props.type}`}>
      {props.lines.map((line, index) => {

        return (
          <div
            className='pm-diff-code__row'
            key={index}
          >
            {line.baseIndex && typeof line.baseIndex === 'number' && <div className='pm-diff-code__index'>{line.baseIndex}</div>}
            {line.sourceIndex && typeof line.sourceIndex === 'number' && <div className='pm-diff-code__index'>{line.sourceIndex}</div>}
            <div className='pm-diff-code__line'>
              <span>{line.value}</span>
            </div>
          </div>
        );
      })}
      <ConflictResolutionActions
        multiline
        conflictArray={props.conflictArray}
        handleValueSelect={props.handleValueSelect}
        originalId={props.originalId}
        type={props.type}
        onResolveConflicts={props.onResolveConflicts}
      />
    </div>
  );
}

/**
 * DiffCodeBlock
 */
export function DiffCodeBlock (props) {
  let lines;

  if (!props.lines) {
    return null;
  }

  if (Array.isArray(_.get(props, 'lines.value', ''))) {
    lines = props.lines.value;
  }
  else {
    lines = props.lines;
  }

  lines = Array.isArray(lines) ? lines : [lines];

  if (!lines.length) {
    return null;
  }

  return (
    <Fragment>
      {lines.map((line, index) => {
        return (
          <div
            className='pm-diff-code__row'
            key={index}
          >
            <div className='pm-diff-code__index'>{line.baseIndex}</div>
            <div className='pm-diff-code__index'>{line.sourceIndex}</div>
            <div className='pm-diff-code__line'>
              {line.value}
            </div>
          </div>
        );
      })}
    </Fragment>
  );
}

/**
 * CodeDiffView
 */
export default class CodeDiffView extends Component {
  constructor (props) {
    super(props);

    this.state = {
      diff: props.diff
    };

    this.handleConflictResolution = this.handleConflictResolution.bind(this);
  }

  handleConflictResolution (codeblock, diffCode) {
    this.setState({
      diff: this.state.diff.resolveConflict(codeblock.index, codeblock.type, diffCode)
    });

    this.props.updateConflictCount && this.props.updateConflictCount();
  }

  render () {
    let diffCode = this.state.diff && this.state.diff.getDiff() || [];

    return (
      <div className='pm-diff pm-diff-code'>
        {diffCode.map((codeblock, index) => {
          if (!codeblock) {
            return null;
          }

          if (codeblock.conflict) {
            return (
              <ConflictedCodeBlock
                conflictArray={this.props.conflictArray}
                disableConflictResolution={this.props.disableConflictResolution}
                handleValueSelect={this.props.onValueSelect}
                key={index}
                lines={codeblock.value}
                originalId={this.state.diff && this.state.diff.originalId}
                type={codeblock.type}
                onResolveConflicts={() => { this.handleConflictResolution(codeblock, diffCode); }}
              />
            );
          }

          return (
            <DiffCodeBlock
              key={index}
              lines={codeblock}
            />
          );
        })}
      </div>
    );
  }
}
