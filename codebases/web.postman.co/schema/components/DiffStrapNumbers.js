import React, { Component } from 'react';

export default class DiffLineNumbers extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const lineArray = this.props.lineArray,
      startIndex = parseInt(this.props.startIndex);

    let lineIndex = 0;

    return (
      <div className='diff-strap-numbers__wrapper'>
        {
          !_.isEmpty(lineArray) &&
            _.map(lineArray, (cursor, index) => {
              let lineNumber = cursor === 1 ? ('' + (startIndex + lineIndex)) : '';

              if (cursor === 1) {
                lineIndex = lineIndex + 1;
              }

              return (
                <div
                  className='diff-strap-numbers'
                  key={index}
                >
                  {lineNumber}
                </div>
              );
            })
        }
      </div>
    );
  }
}
