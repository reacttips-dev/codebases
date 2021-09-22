/*
 * This uses mathjax as a fallback and is needed when the katexify() at `CMLToHTMLConverter.js` fails.
 */

import React from 'react';
import ReactDOM from 'react-dom';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
const loadMathJax = () => import('js/lib/coursera.mathjax');

type Props = {
  children: React.ReactNode;
  forceRender: boolean;
  renderCallback?: () => void;
};

class Tex extends React.Component<Props> {
  _isMounted = false;

  static defaultProps = {
    forceRender: false,
    renderCallback: () => {},
  };

  componentDidMount() {
    const { renderCallback } = this.props;
    this._isMounted = true;

    loadMathJax().then((mathJaxModule) => {
      const mathJax = mathJaxModule.default;
      if (this._isMounted) {
        /*
          Use findDOMNode instead of refs as a way to find the root DOM node of the prop `children`
          even if the prop is a react component. Component children refs are the mounted component
          instances which are not parsable by MathJax.
        */
        const domNode = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node
        if (domNode) {
          mathJax.render(domNode, renderCallback);
        } else {
          mathJax.render(null, renderCallback);
        }
      }
    });
  }

  shouldComponentUpdate(nextProps: Props) {
    return nextProps.forceRender;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { children } = this.props;
    return React.isValidElement(children) ? children : <span>{children}</span>;
  }
}

export default Tex;
