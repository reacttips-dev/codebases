import React from 'react';
import ReactDOM from 'react-dom';
import CodeBlock from 'bundles/code-evaluator/components/CodeBlock';
import CodeBlockV2 from 'bundles/code-evaluator/components/CodeBlockV2';

import type { LanguageType } from 'bundles/cml/constants/codeLanguages';

type Props = {
  children: JSX.Element;
  useUserExpression?: boolean;
  useMonacoEditor?: boolean;
};

/**
 * Wrapper that replaces all child `pre` nodes with an interactive CodeBlock component
 */
class CMLCode extends React.Component<Props, {}> {
  static defaultProps = {
    useUserExpression: true,
    useMonacoEditor: false,
  };

  componentDidMount() {
    const { useMonacoEditor } = this.props;
    // eslint-disable-next-line react/no-find-dom-node
    const dom = ReactDOM.findDOMNode(this);
    if (!dom) {
      return;
    }
    const codeBlocks = (dom as Element).querySelectorAll('pre');
    codeBlocks.forEach((codeBlock) => {
      // eslint-disable-next-line no-param-reassign
      codeBlock.style.opacity = '0';
      const codeLanguage = codeBlock.dataset.language as LanguageType;
      const evaluatorId = codeBlock.dataset.evaluatorId;
      const expression = codeBlock.textContent;
      if (useMonacoEditor) {
        ReactDOM.render(
          <CodeBlockV2
            codeLanguage={codeLanguage}
            evaluatorId={evaluatorId}
            expression={expression || undefined}
            useUserExpression={this.props.useUserExpression}
          />,
          codeBlock
        );
      } else {
        codeBlock.setAttribute('tabindex', '0');
        ReactDOM.render(
          <CodeBlock
            codeLanguage={codeLanguage}
            evaluatorId={evaluatorId}
            expression={expression || undefined}
            useUserExpression={this.props.useUserExpression}
          />,
          codeBlock
        );
      }
      // eslint-disable-next-line no-param-reassign
      codeBlock.style.opacity = '1';
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

export default CMLCode;
