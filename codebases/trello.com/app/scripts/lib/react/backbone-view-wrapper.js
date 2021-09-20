import $ from 'jquery';
import React from 'react';
import ReactDOM from '@trello/react-dom-wrapper';
import _ from 'underscore';

export class ReactWrapper extends React.Component {
  componentDidMount() {
    // Trigger a data load
    if (this.props.view.getData === 'function') {
      this.props.view.getData();
    }

    const node = ReactDOM.findDOMNode(this);

    const { el } = this.props.view.render();

    $(node).append(el);
  }

  render() {
    let passedProps;
    if (this.props.onClick) {
      passedProps = _.assign(_.pick(this.props, ['className']), {
        onClick: this.props.onClick,
      });
    } else {
      passedProps = _.pick(this.props, ['className']);
    }

    return <div {...passedProps} />;
  }
}
