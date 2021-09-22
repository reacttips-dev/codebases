import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import CMLCodeEvaluator from 'bundles/cml/components/CMLCodeEvaluator';
import EvaluatorAPIUtils from 'bundles/code-evaluator/utils/EvaluatorAPIUtils';
import EvaluatorSummary from 'bundles/code-evaluator/models/EvaluatorSummary';
import _t from 'i18n!nls/cml';
import 'css!./__styles__/CodeBlock';

import type { LanguageType } from 'bundles/cml/constants/codeLanguages';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
const loadAceEditor = () => import('bundles/phoenix/models/AceEditor');

type Props = {
  codeLanguage: LanguageType;
  evaluatorId?: string | null;
  expression: string;
  onUpdate?: (answer: string) => void;
  useUserExpression?: boolean;
  hideCodeEvaluator?: boolean;
  onClick?: () => void;
  onKeyPress?: () => void;
};

type State = {
  showEscapeInstruction: boolean;
};

class CodeBlock extends React.Component<Props, State> {
  static defaultProps = {
    expression: '',
    useUserExpression: true,
    onClick: () => {},
    onKeyPress: () => {},
    hideCodeEvaluator: false,
  };

  state = {
    showEscapeInstruction: false,
  };

  componentDidMount() {
    const { codeLanguage, evaluatorId, expression, onUpdate, useUserExpression, hideCodeEvaluator } = this.props;
    const readOnly = !evaluatorId;
    const minLines = evaluatorId ? 5 : 3;
    const { container } = this;
    if (container) {
      container.className = classNames('rc-CodeBlock', container.className);
    }

    loadAceEditor().then((AceEditorModule) => {
      const AceEditor = AceEditorModule.default;
      if (evaluatorId) {
        EvaluatorAPIUtils.getSummary(evaluatorId)
          .then((response: $TSFixMe /* TODO: type EvaluatorAPIUtils */) => {
            const evaluatorSummary = new EvaluatorSummary(response);
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'latestUserExpression' does not exist on ... Remove this comment to see the full error message
            const value = (useUserExpression && evaluatorSummary.latestUserExpression) || expression;
            const aceEditor = new AceEditor({
              el: container,
              language: codeLanguage,
              value,
              readOnly,
              minLines,
            });
            aceEditor.resizeHeight();

            if (onUpdate && value !== expression) {
              onUpdate(value);
            }

            if (hideCodeEvaluator) {
              return;
            }

            const evaluatorContainer = document.createElement('div');
            evaluatorContainer.setAttribute('class', 'cml-code-evaluator');
            if (container?.parentNode) {
              container.parentNode.insertBefore(evaluatorContainer, container.nextSibling);
            }

            ReactDOM.render(
              <CMLCodeEvaluator
                aceEditor={aceEditor}
                evaluatorId={evaluatorId}
                // @ts-expect-error ts-migrate(2741) FIXME: Property 'prototype' is missing in type 'Evaluator... Remove this comment to see the full error message
                evaluatorSummary={evaluatorSummary}
                onUpdate={onUpdate}
                originalValue={expression}
              />,
              evaluatorContainer
            );
          })
          .fail(() => {
            const errorContainer = document.createElement('div');
            errorContainer.setAttribute('class', 'color-warn-dark');
            errorContainer.innerHTML = _t('Error loading runnable code block');
            if (container?.parentNode) {
              container.parentNode.insertBefore(errorContainer, container.nextSibling);
            }
          });
      } else {
        const value = expression;
        const aceEditor = new AceEditor({
          el: container,
          language: codeLanguage,
          value,
          readOnly,
          minLines,
        });
        aceEditor.resizeHeight();
      }
    });
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { showEscapeInstruction } = this.state;

    if (showEscapeInstruction !== nextState.showEscapeInstruction) {
      return true;
    }
    return false;
  }

  onFocus = () => {
    this.setState(() => ({ showEscapeInstruction: true }));
  };

  onBlur = () => {
    this.setState(() => ({ showEscapeInstruction: false }));
  };

  container: HTMLElement | null = null;

  render() {
    const { onClick, onKeyPress } = this.props;
    const { showEscapeInstruction } = this.state;

    return (
      <div>
        <div
          aria-label={_t('Code Block: use the Escape key to exit the block')}
          role="textbox"
          tabIndex={-1}
          ref={(container) => {
            this.container = container;
          }}
          onClick={onClick}
          onKeyPress={onKeyPress}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          className="code-container"
        />
        {showEscapeInstruction && (
          <span className="escape-instruction">{_t('Press ESC to exit the code block at any time')}</span>
        )}
      </div>
    );
  }
}

export default CodeBlock;
