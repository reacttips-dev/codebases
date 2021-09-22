import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import type monaco from 'monaco-editor';

import CMLCodeEvaluatorV2 from 'bundles/cml/components/CMLCodeEvaluatorV2';
import EvaluatorAPIUtils from 'bundles/code-evaluator/utils/EvaluatorAPIUtils';
import EvaluatorSummary from 'bundles/code-evaluator/models/EvaluatorSummary';
import TabTrappingMessage from 'bundles/code-evaluator/components/TabTrappingMessage';
import type { LanguageType } from 'bundles/cml/constants/codeLanguages';
import { languageMapper } from 'bundles/cml/constants/codeLanguages';
import _t from 'i18n!nls/cml';
import 'css!./__styles__/CodeBlock';
import {
  registerLanguage,
  tokenizedLanguages,
} from 'bundles/code-evaluator/utils/language-definitions/registerLanguages';
import localStorageEx from 'bundles/common/utils/localStorageEx';

const loadMonacoEditor = () => import('monaco-editor/esm/vs/editor/editor.main');

export type Props = {
  codeLanguage: LanguageType;
  expression: string;
  evaluatorId?: string;
  onUpdate?: (answer: string) => void;
  useUserExpression?: boolean;
  hideCodeEvaluator?: boolean;
  className?: string;
  codeBlockId?: string;
  ariaLabel?: string;
  minLines?: number;
  maxLines?: number;
  onClick?: () => void;
  onChange?: (value: string, event: monaco.editor.IModelContentChangedEvent) => void;
  onBlur?: () => void;
  onKeyPress?: () => void;
  readOnly?: boolean;
  isControlled?: boolean;
  monacoCreateOptions?: monaco.editor.IStandaloneEditorConstructionOptions;
};

type State = {
  prevHeight: number;
};

/**
 * @class CodeBlock
 *
 * CodeBlock based on monaco editor as opposed to ace editor.
 *
 */
class CodeBlock extends React.Component<Props, State> {
  static defaultProps = {
    expression: '',
    useUserExpression: true,
    hideCodeEvaluator: false,
    maxLines: 40,
    isControlled: false,
  };

  state = {
    prevHeight: 0,
  };

  componentDidUpdate(prevProps: Props) {
    if (this.props.isControlled && this.props.expression !== prevProps.expression) {
      this.monacoEditor?.setValue(this.props.expression);
    }
  }

  componentDidMount() {
    const {
      codeLanguage,
      evaluatorId,
      expression,
      onUpdate,
      useUserExpression,
      hideCodeEvaluator,
      readOnly,
      monacoCreateOptions,
    } = this.props;
    this.isECB = !!evaluatorId;
    const isReadOnly = typeof readOnly === 'boolean' ? readOnly : !this.isECB;
    const { container } = this;
    this.accessibilitySupport = localStorageEx.getItem('codeBlockAccessibilityEnabled', JSON.parse, 'auto');

    loadMonacoEditor().then((monacoInstance) => {
      const monacoEditorLanguage = languageMapper[codeLanguage] || codeLanguage;

      // check if language support does not come bundled with monaco editor
      if (monacoEditorLanguage in tokenizedLanguages) {
        // @ts-expect-error TODO: We already know that language is correct. I think it is better to move this check to registerLanguage
        registerLanguage(monacoInstance, monacoEditorLanguage);
      }

      const defaultEditorConfig: monaco.editor.IStandaloneEditorConstructionOptions = {
        language: monacoEditorLanguage,
        readOnly: isReadOnly,
        accessibilitySupport: this.accessibilitySupport,
        minimap: {
          enabled: false,
        },
      };

      if (evaluatorId) {
        // render CML Code Evaluator if it's an executable code block
        EvaluatorAPIUtils.getSummary(evaluatorId)
          .then((response: $TSFixMe /* TODO: type EvaluatorAPIUtils */) => {
            if (container?.parentNode) {
              const evaluatorSummary = new EvaluatorSummary(response);
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'latestUserExpression' does not exist on ... Remove this comment to see the full error message
              const value = (useUserExpression && evaluatorSummary.latestUserExpression) || expression;
              this.monacoEditor = monacoInstance.editor.create(container, {
                ...defaultEditorConfig,
                ...monacoCreateOptions,
                value,
                scrollBeyondLastLine: false,
                glyphMargin: true, // Enable rendering of the glyph margin
              });
              if (onUpdate && value !== expression) {
                onUpdate(value);
              }

              if (hideCodeEvaluator) {
                return;
              }

              const evaluatorContainer = document.createElement('div');
              evaluatorContainer.setAttribute('class', 'cml-code-evaluator');
              container.parentNode.insertBefore(evaluatorContainer, container.nextSibling);
              ReactDOM.render(
                <CMLCodeEvaluatorV2
                  monacoEditor={this.monacoEditor}
                  monacoInstance={monacoInstance}
                  evaluatorId={evaluatorId}
                  // @ts-expect-error ts-migrate(2741) FIXME: Property 'prototype' is missing in type 'Evaluator... Remove this comment to see the full error message
                  evaluatorSummary={evaluatorSummary}
                  onUpdate={onUpdate}
                  originalValue={expression}
                />,
                evaluatorContainer
              );
              this.updateEditorLayout();
              this.initializeMonacoChangeListener();
            }
          })
          .fail(() => {
            const errorContainer = document.createElement('div');
            errorContainer.setAttribute('class', 'color-warn-dark');
            errorContainer.innerHTML = _t('Error loading runnable code block');
            if (container?.parentNode) {
              container.parentNode.insertBefore(errorContainer, container.nextSibling);
            }
          });
      } else if (container) {
        this.monacoEditor = monacoInstance.editor.create(container, {
          ...defaultEditorConfig,
          ...monacoCreateOptions,
          value: expression,
        });
        this.updateEditorLayout();
        this.initializeMonacoChangeListener();
      }

      window.addEventListener('resize', this.updateDimensions);
      window.addEventListener('storage', this.initializeStorageListener);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
    window.removeEventListener('storage', this.initializeStorageListener);
    this.editorDidChangeModelContentListener?.dispose();
    this.editorDidChangeConfigurationListener?.dispose();
  }

  handleChange = (event: monaco.editor.IModelContentChangedEvent) => {
    const { monacoEditor } = this;
    const { onChange } = this.props;

    if (!monacoEditor) {
      return;
    }

    if (onChange && !this.isECB) {
      const value = monacoEditor.getValue();
      onChange(value, event);
    }

    this.updateEditorLayout();
  };

  assignRef = (component: HTMLElement | null) => {
    this.container = component;
  };

  initializeMonacoChangeListener() {
    const { monacoEditor } = this;

    if (!monacoEditor) {
      return;
    }

    this.editorDidChangeModelContentListener = monacoEditor.onDidChangeModelContent(this.handleChange);

    this.editorDidChangeConfigurationListener = monacoEditor.onDidChangeConfiguration((event) => {
      // check if the change occurred with the accessibilitySupport setting
      if (event.hasChanged(2)) {
        this.accessibilitySupport = this.accessibilitySupport === 'on' ? 'off' : 'on';
        localStorageEx.setItem('codeBlockAccessibilityEnabled', this.accessibilitySupport, JSON.stringify);
      }
    });
  }

  initializeStorageListener = (event: StorageEvent) => {
    const { monacoEditor } = this;

    if (!monacoEditor || event.key !== 'codeBlockAccessibilityEnabled') {
      return;
    }

    if (event.newValue) {
      const nextAccessibilitySetting = JSON.parse(event.newValue);
      monacoEditor.updateOptions({ accessibilitySupport: nextAccessibilitySetting });
    }
  };

  updateEditorLayout() {
    const { monacoEditor } = this;
    const { minLines, maxLines } = this.props;
    const { prevHeight } = this.state;
    const editorElement = monacoEditor?.getDomNode();

    if (!monacoEditor || !editorElement) {
      return;
    }

    // TODO(wbowers): Using the `monaco.editor.EditorOption.lineHeight` constant here breaks the app,
    // giving `[error] InherentError: { Error: Cannot find module 'monaco-editor'`. Seems like
    // something is calling this function before the module is loaded.
    const lineHeight = monacoEditor.getOption(49);
    const lineCount = monacoEditor.getModel()?.getLineCount() || 1; // get the number of lines of code in the editor
    const paddedLineCount = lineCount + 1; // Makes room for an area at the bottom of the editor.
    const actualMinLines = this.isECB ? minLines || 5 : minLines;
    const requestedLineCount = Math.min(
      Math.max(paddedLineCount, actualMinLines || paddedLineCount),
      maxLines || paddedLineCount
    );

    const height = requestedLineCount * lineHeight;

    if (prevHeight !== height) {
      this.setState({ prevHeight: height });
      editorElement.style.height = `${height}px`; // update monaco container element height
      monacoEditor.layout(); // Instruct monaco editor to remeasure its container
    }
  }

  updateDimensions = () => {
    this.monacoEditor?.layout();
  };

  container: HTMLElement | null = null;

  isECB = false;

  accessibilitySupport: 'auto' | 'on' | 'off' = 'auto';

  monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null;

  editorDidChangeModelContentListener: monaco.IDisposable | null = null;

  editorDidChangeConfigurationListener: monaco.IDisposable | null = null;

  render() {
    const { onClick, onBlur, onKeyPress, className, codeBlockId, ariaLabel } = this.props;

    return (
      <React.Fragment>
        <div
          ref={this.assignRef}
          id={codeBlockId}
          className={classNames('rc-CodeBlock', 'rc-CodeBlockV2', className)}
          onClick={onClick}
          onBlur={onBlur}
          onKeyPress={onKeyPress}
          role="presentation"
          aria-label={ariaLabel || _t('Code block')}
          tabIndex={-1}
        />

        <TabTrappingMessage editor={this.monacoEditor} />
      </React.Fragment>
    );
  }
}

export default CodeBlock;
