import React from 'react';
import ReactDOM from 'react-dom';

import CodeBlockV2 from 'bundles/code-evaluator/components/CodeBlockV2';

import type { LanguageType } from 'bundles/cml/constants/codeLanguages';

type Props = {
  children: JSX.Element;
  useUserExpression?: boolean;
};

/**
 * Wrapper that replaces all child 'code' nodes with an interactive CodeBlock component
 * This is same as CMLCode but uses CodeBlockV2 directly (Monaco editor) since that is rolled out already
 */
class CMLCodeV2 extends React.Component<Props, {}> {
  static defaultProps = {
    useUserExpression: true,
  };

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    const dom = ReactDOM.findDOMNode(this);
    if (!dom) {
      return;
    }
    const codeBlocks: NodeListOf<HTMLElement> = (dom as Element).querySelectorAll('code');
    codeBlocks.forEach((codeBlock) => {
      // hide codeblock until the react component is rendered into the DOM below
      codeBlock.style.opacity = '0'; // eslint-disable-line no-param-reassign
      const codeLanguage = codeBlock.getAttribute('language') as LanguageType;
      const evaluatorId = codeBlock.getAttribute('evaluatorId');
      const expression = codeBlock.textContent;

      ReactDOM.render(
        <CodeBlockV2
          codeLanguage={codeLanguage}
          evaluatorId={evaluatorId || undefined}
          expression={expression || undefined}
          useUserExpression={this.props.useUserExpression}
        />,
        codeBlock
      );

      // show codeblock after rendering into the DOM
      codeBlock.style.opacity = '1'; // eslint-disable-line no-param-reassign
      // always use LTR for code blocks even if the content direction itself is determined to be RTL
      codeBlock.setAttribute('dir', 'ltr');
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

export default CMLCodeV2;
