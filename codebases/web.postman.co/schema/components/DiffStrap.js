import React, { Component } from 'react';
import DiffStrapNumbers from './DiffStrapNumbers';

export default class DiffStrap extends Component {
  constructor (props) {
    super(props);
  }

  pushIntoLineFeed (lineObj, newLine) {
    if (!(newLine.charAt(0) === '+' || newLine.charAt(0) === '-')) {
      lineObj.added.push(1);
      lineObj.removed.push(1);
    }
    else if (newLine.charAt(0) === '+') {
      lineObj.added.push(1);
      lineObj.removed.push(0);
    }
    else if (newLine.charAt(0) === '-') {
      lineObj.added.push(0);
      lineObj.removed.push(1);
    }

    return lineObj;
  }

  computeDiffLineArray (diff) {
    let lineObj = {
      added: [],
      removed: []
    };

    _.forEach(diff, (newLine) => {
      if (newLine.charAt(0) !== '@') {
        lineObj = this.pushIntoLineFeed(lineObj, newLine);
      }
    });

    return lineObj;
  }

  render () {
    const diffLineObj = this.computeDiffLineArray(this.props.diff);

    let negativeStartIndex,
      positiveStartIndex,
      diffChunkIdentifier;

    diffChunkIdentifier = _.get(this.props.diff, '0', '').split(' ');
    negativeStartIndex = _.get(diffChunkIdentifier, '1', '').split(',')[0].substring(1);
    positiveStartIndex = _.get(diffChunkIdentifier, '2', '').split(',')[0].substring(1);

    return (
      <div className='diff-strap-numbers-container'>
        <DiffStrapNumbers startIndex={negativeStartIndex} lineArray={diffLineObj.removed} />
        <DiffStrapNumbers startIndex={positiveStartIndex} lineArray={diffLineObj.added} />
      </div>
    );
  }
}
