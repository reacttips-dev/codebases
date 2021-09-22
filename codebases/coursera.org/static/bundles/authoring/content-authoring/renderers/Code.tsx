import React from 'react';

import CMLCodeEditorToolbar from 'bundles/authoring/content-authoring/components/CodeEditor/CMLCodeEditorToolbar';
import CMLCodeEditorRemoveButton from 'bundles/authoring/content-authoring/components/CodeEditor/CMLCodeEditorRemoveButton';
import CodeBlock from 'bundles/code-evaluator/components/CodeBlock';

import AceEditor from 'react-ace';
import { CodeBlockOptions } from 'bundles/cml/types/Content';

import cx from 'classnames';
import _t from 'i18n!nls/authoring';
import { getAttributes } from '../utils/slateUtils';
import { SlateChange, SlateRenderNodeProps } from '../types';

import 'css!./__styles__/Code';

const getIsUsingFirefox = () => typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Firefox') !== -1;

export type CodeProps = SlateRenderNodeProps & {
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

class Code extends React.Component<CodeProps, State> {
  // eslint-disable-next-line react/sort-comp
  aceNode: (AceEditor & { editor: HTMLInputElement }) | null = null;

  state = {
    wasBlurred: false,
    isPreview: true,
  };

  componentDidUpdate(prevProps: CodeProps) {
    const { isSelected, isFocused } = this.props;
    const { wasBlurred } = this.state;
    const isUsingFirefox = getIsUsingFirefox();
    // NOTE: Firefox has different behavior for focusing/blurring than Chrome/Safari and needs special handling

    if (isSelected && isFocused && !!this.aceNode) {
      if (!isUsingFirefox || wasBlurred) {
        // force keep the aceeditor focused when Code is selected + focused
        this.aceNode.editor.focus();
      }
    }
    if (isUsingFirefox && (!isSelected || !isFocused) && wasBlurred) {
      this.setState({ wasBlurred: false });

      if (this.aceNode) {
        this.aceNode.editor.blur();
      }
    }

    // reset to preview mode after user focuses out of this block
    if (prevProps.isSelected && prevProps.isFocused && !isSelected && !isFocused) {
      this.setState({ isPreview: true });
    }
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
    if (getIsUsingFirefox() && isSelected && isFocused && !wasBlurred && !!this.aceNode) {
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
          <CodeBlock
            codeLanguage={language}
            evaluatorId={evaluatorId}
            expression={codeText}
            onClick={this.handlePreviewClick}
            hideCodeEvaluator={true}
          />
        )}
        {!isPreview && (
          <AceEditor
            mode={language}
            theme="tomorrow"
            value={codeText}
            onChange={this.onChange}
            onBlur={this.handleBlur}
            name={codeBlockId}
            width="100%"
            minLines={3}
            maxLines={Infinity}
            ref={(n) => {
              this.aceNode = n as AceEditor & { editor: HTMLInputElement };
            }}
            editorProps={{
              $blockScrolling: true,
              // @ts-expect-error TSMIGRATION
              minLines: 3,
            }}
          />
        )}
      </div>
    );
  }
}

export default Code;
