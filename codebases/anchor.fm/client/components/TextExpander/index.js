import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import TextTruncate from 'react-text-truncate';
import styles from './styles.sass';

class TextExpander extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isExpanded: false,
    };
  }

  handleClickExpander = e => {
    e.preventDefault();
    this.setState({
      isExpanded: true,
    });
  };

  render() {
    const {
      className,
      expandedText,
      line,
      text,
      expanderIconStyle = 'dark',
    } = this.props;
    const expanderClass = `${styles.expander} ${
      styles[`expander--${expanderIconStyle}`]
    }`;
    return this.state.isExpanded ? (
      <div className={`${className || ''} `}>{expandedText || text}</div>
    ) : (
      <div className={`${className || ''} `} onClick={this.handleClickExpander}>
        <TextTruncate
          containerClassName={expanderClass}
          line={line}
          text={text}
          truncateText=" "
        />
        {/*
          truncateText should be occluded by the :after element,
          but take up some space (for plugin calculation)
        */}
      </div>
    );
  }
}

export default TextExpander;
