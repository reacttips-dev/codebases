import React from 'react';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
const loadAceEditor = () => import('bundles/phoenix/models/AceEditor');

type Props = {
  value: string;
  language: string;
  readOnly?: boolean;
  maxLines?: number;
  minLines?: number;
  onChange?: (text: string) => void;
};

class CodeEditor extends React.Component<Props, {}> {
  static defaultProps = {
    value: '',
  };

  componentDidMount() {
    const { editor } = this;

    loadAceEditor().then((AceEditorModule) => {
      const AceEditor = AceEditorModule.default;
      const { value, language, readOnly, onChange, maxLines, minLines } = this.props;

      const aceEditor = new AceEditor({
        el: editor,
        value,
        language,
        readOnly,
        onChange,
        maxLines,
        minLines,
      });
      aceEditor.resizeHeight();
    });
  }

  editor: HTMLElement | null = null;

  render() {
    return (
      <div className="rc-CodeEditor">
        <pre
          ref={(container) => {
            this.editor = container;
          }}
        />
      </div>
    );
  }
}

export default CodeEditor;
