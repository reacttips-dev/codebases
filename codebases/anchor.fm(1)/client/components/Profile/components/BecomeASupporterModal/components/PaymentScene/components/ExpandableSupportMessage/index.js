import React from 'react';
import TextTruncate from 'react-text-truncate';

// similar to TextExpander component, but that one requires a specific icon
// and is not fully clickable
class ExpandableSupportMessage extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isExpandable: false,
      isExpanded: false,
    };
  }

  handleClickExpander = e => {
    const { isExpandable } = this.state;
    e.preventDefault();
    if (isExpandable) {
      this.setState(({ isExpanded }) => ({
        isExpanded: !isExpanded,
      }));
    }
  };

  handleTruncated = () => {
    this.setState(() => ({
      isExpandable: true,
    }));
  };

  render() {
    const { className = '', line, text } = this.props;
    const { isExpanded, isExpandable } = this.state;
    const decoratedText = `“${text}”`;
    return (
      <div className={className} onClick={this.handleClickExpander}>
        {isExpanded ? (
          <div>{decoratedText}</div>
        ) : (
          <TextTruncate
            line={line}
            onTruncated={this.handleTruncated}
            truncateText="…”"
            text={decoratedText}
          />
        )}
        {isExpandable && (
          <strong>{isExpanded ? 'Read less' : 'Read more'}</strong>
        )}
      </div>
    );
  }
}

export default ExpandableSupportMessage;
