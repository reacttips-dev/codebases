import React, { Component, Fragment } from 'react';

import ConflictResolutionActions from './ConflictResolutionActions';

/**
 * StringDiff
 */
export function StringDiff (props) {
  const { diffString } = props;

  if (!Array.isArray(diffString)) {
    return null;
  }

  return (
    <Fragment>
      {
        diffString.map((diff, index) => {

          return (
            <span
              key={index}
            >
              {diff.value}
            </span>
          );
        })
      }
    </Fragment>
  );
}

/**
 * StringDiffView
 */
export default class StringDiffView extends Component {
  constructor (props) {
    super(props);

    this.state = {
      diff: props.diff
    };

    this.handleConflictResolution = this.handleConflictResolution.bind(this);
  }

  handleConflictResolution (type) {
    this.setState({ diff: this.state.diff.resolveConflict(type) });

    this.props.updateConflictCount && this.props.updateConflictCount();
  }

  render () {
    const diffValue = this.state.diff.getDiff(),
      diff = Array.isArray(diffValue) ? diffValue : [diffValue];

    return (
      <div className='pm-diff pm-diff-words'>
        {diff.map((diffValue, index) => {
          const conflictClass = `pm-conflict pm-conflict--${diffValue.type}`;

          return (
            <div
              className={`${conflictClass}`}
              key={index}
            >
              <StringDiff diffString={diffValue.diff} />

              <ConflictResolutionActions
                conflictArray={this.props.conflictArray}
                disableConflictResolution={this.props.disableConflictResolution}
                handleValueSelect={this.props.onValueSelect}
                originalId={this.state.diff && this.state.diff.originalId}
                type={diffValue.type}
                onResolveConflicts={() => { this.handleConflictResolution(diffValue.type); }}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
