import React from 'react';
import cx from 'classnames';

import CMLCodeEditorToolbar from 'bundles/authoring/content-authoring/components/CodeEditor/CMLCodeEditorToolbar';
import CMLCodeEditorRemoveButton from 'bundles/authoring/content-authoring/components/CodeEditor/CMLCodeEditorRemoveButton';
import CodeBlockV2 from 'bundles/code-evaluator/components/CodeBlockV2';
import { CodeBlockOptions } from 'bundles/cml/types/Content';

import _t from 'i18n!nls/authoring';
import { getAttributes } from '../utils/slateUtils';
import { SlateChange, SlateRenderNodeProps } from '../types';

import 'css!./__styles__/Code';

const getIsUsingFirefox = () => typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Firefox') !== -1;

export type CodeV2Props = SlateRenderNodeProps & {
  isFocused?: boolean;
  codeBlockOptions?: CodeBlockOptions;
  toggleEcbConfigModal: (showEcbConfigModal: boolean, ecbModalComponent: React.ReactElement | null) => void;
  attributes: {
    language: string;
    evaluatorId?: string;
    value: string;
  };
};

type State = {
  wasBlurred: boolean;
  isPreview: boolean;
};

class Code extends React.Component<CodeV2Props, State> {
  state = {
    wasBlurred: false,
    isPreview: true,
  };

  componentDidUpdate(prevProps: CodeV2Props) {
    const { isSelected, isFocused } = this.props;
    const { wasBlurred } = this.state;
    const { monacoNode } = this;
    const isUsingFirefox = getIsUsingFirefox();

    // NOTE: Firefox has different behavior for focusing/blurring than Chrome/Safari and needs special handling
    if (isSelected && isFocused && !!monacoNode) {
      if (!isUsingFirefox || wasBlurred) {
        // wait for monacoNode (Monaco Editor) to be rendered
        setTimeout(() => {
          // force keep the monaco editor focused when Code is selected + focused
          this.timeoutID = monacoNode?.monacoEditor?.focus() || null;
        }, 0);
      }
    }

    if (isUsingFirefox && (!isSelected || !isFocused) && wasBlurred && !!monacoNode) {
      this.setState({ wasBlurred: false });

      if (monacoNode.container) {
        monacoNode.container.blur();
      }
    }

    // reset to preview mode after user focuses out of this block
    if (prevProps.isSelected && prevProps.isFocused && !isSelected && !isFocused) {
      this.setState({ isPreview: true });
    }
  }

  componentWillUnmount() {
    const { timeoutID } = this;
    if (timeoutID) clearTimeout(timeoutID);
  }

  handleEvaluatorChange = (evaluatorId: string, newValue?: string) => {
    const { editor, node } = this.props;
    editor.change((c: SlateChange) => {
      return c.setNodeByKey(node.key, {
        data: node.data.set('codeText', newValue).setIn(['attributes', 'evaluatorId'], evaluatorId),
        type: node.type,
      });
    });
  };

  handleRemove = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const { editor, node } = this.props;

    // eslint-disable-next-line no-alert
    if (window.confirm(_t('Are you sure you want to remove this code block?'))) {
      editor.change((c: SlateChange) => c.removeNodeByKey(node.key));
    }
  };

  handleBlur = () => {
    const { isSelected, isFocused } = this.props;
    const { wasBlurred } = this.state;
    if (getIsUsingFirefox() && isSelected && isFocused && !wasBlurred && !!this.monacoNode) {
      this.setState({ wasBlurred: true });
    }
  };

  handlePreviewClick = () => this.setState({ isPreview: false });

  onChange = (newValue: string) => {
    const { editor, node } = this.props;
    editor.change((c: SlateChange) => {
      return c.setNodeByKey(node.key, {
        data: node.data.set('codeText', newValue),
        type: node.type,
      });
    });
  };

  monacoNode: CodeBlockV2 | null = null;

  timeoutID: number | null = null;

  render() {
    const { node, attributes, isSelected, codeBlockOptions, toggleEcbConfigModal } = this.props;
    const { isPreview } = this.state;
    const { language, evaluatorId } = getAttributes(node) || {};

    const codeText = node.data.get('codeText') || '';
    const codeBlockId = `codeblock-${node.key}`;

    return (
      <div {...attributes} className={cx('rc-Code', { active: isSelected, preview: isPreview })}>
        <div className="code-header horizontal-box align-items-spacebetween">
          <CMLCodeEditorToolbar
            value={codeText}
            evaluatorId={evaluatorId}
            codeBlockOptions={codeBlockOptions}
            languageValue={language}
            onEvaluatorChange={this.handleEvaluatorChange}
            toggleEcbConfigModal={toggleEcbConfigModal}
          />

          <CMLCodeEditorRemoveButton onClick={this.handleRemove} />
        </div>
        {isPreview && (
          <CodeBlockV2
            codeLanguage={language}
            evaluatorId={evaluatorId}
            expression={codeText}
            minLines={6}
            onClick={this.handlePreviewClick}
            hideCodeEvaluator={true}
          />
        )}

        {!isPreview && (
          <CodeBlockV2
            codeLanguage={language}
            readOnly={false}
            expression={codeText}
            minLines={6}
            onChange={this.onChange}
            onBlur={this.handleBlur}
            codeBlockId={codeBlockId}
            ref={(n) => {
              this.monacoNode = n;
            }}
          />
        )}
      </div>
    );
  }
}

export default Code;
