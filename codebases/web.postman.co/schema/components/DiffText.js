import React, { Component } from 'react';
import classnames from 'classnames';

export default class DiffText extends Component {
  constructor (props) {
    super(props);
  }

  getClasses (newline) {
    return classnames({
      'diff-text__line': true,
      'diff-text__line-added': newline.charAt(0) === '+',
      'diff-text__line-removed': newline.charAt(0) === '-'
    });
  }

  render () {
    let newDiff = this.props.diff && [...this.props.diff];

    // Removes the chunk identifier form the diff
    newDiff.shift();

    return (
      <div className='diff-text'>
        {
          _.map(newDiff, (newline, index) => {
            return (
              <div className={this.getClasses(newline)} key={index}>{newline}</div>
            );
          })
        }
      </div>
    );
  }
}
