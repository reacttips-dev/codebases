import React, { Component, Fragment } from 'react';

import ConflictResolutionActions from './ConflictResolutionActions';

/**
 * SentencesDiffView
 */
export function SentencesDiffView (props) {
  const { diffString } = props;

  if (!Array.isArray(diffString)) {
    return null;
  }

  return (
    <Fragment>
      {
        diffString.map((diff, index) => {

          if (props.conflict) {
            return (
              <div
                className='pm-diff-body'
                key={index}
              >
                <span className='pm-diff--scrollable'>
                  {diff.value === '' ? 'No changes' : diff.value}
                </span>
              </div>
            );
          }

          return (
            <div
              className='soft-half--ends soft--sides'
              key={index}
            >
              {diff.value}
            </div>
          );
        })
      }
    </Fragment>
  );
}

/**
 * SentencesDiff
 */
export default class SentencesDiff extends Component {
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
      <div className='pm-diff pm-diff-sentences'>
        {diff.map((diffValue, index) => {
          const conflictClass = diffValue.conflict ? `pm-conflict pm-conflict--${diffValue.type}` : '';

          return (
            <div
              className={`${conflictClass}`}
              key={index}
            >
              <SentencesDiffView
                conflict={diffValue.conflict}
                diffString={diffValue.diff}
              />

              {diffValue.conflict &&
                <ConflictResolutionActions
                  multiline
                  conflictArray={this.props.conflictArray}
                  handleValueSelect={this.props.onValueSelect}
                  originalId={this.state.diff && this.state.diff.originalId}
                  type={diffValue.type}
                  onResolveConflicts={() => { this.handleConflictResolution(diffValue.type); }}
                />
              }
            </div>
          );
        })
        }
      </div>
    );
  }
}
