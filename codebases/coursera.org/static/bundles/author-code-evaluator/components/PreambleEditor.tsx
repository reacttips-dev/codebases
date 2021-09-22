import React from 'react';

import CodeEditor from 'bundles/phoenix/components/CodeEditor';
import CodeBlockV2 from 'bundles/code-evaluator/components/CodeBlockV2';
import AuthorEvaluatorSectionHeader from 'bundles/author-code-evaluator/components/AuthorEvaluatorSectionHeader';
import AuthorEvaluatorSectionCaption from 'bundles/author-code-evaluator/components/AuthorEvaluatorSectionCaption';
import type { LanguageType } from 'bundles/cml/constants/codeLanguages';
import _t from 'i18n!nls/author-code-evaluator';

type Props = {
  preamble: string;
  language: LanguageType;
  useMonacoEditor?: boolean;
  onChange: (value: string) => void;
};

class PreambleEditor extends React.Component<Props, {}> {
  render() {
    const { preamble, language, onChange, useMonacoEditor = false } = this.props;

    return (
      <div className="rc-PreambleEditor">
        <AuthorEvaluatorSectionHeader style={{ paddingTop: 20, paddingBottom: 5 }}>
          {_t('Preamble Code')}
        </AuthorEvaluatorSectionHeader>

        <AuthorEvaluatorSectionCaption style={{ paddingBottom: 10 }}>
          {_t("This code will be executed as a pre-requisite before the learner's code gets executed.")}
        </AuthorEvaluatorSectionCaption>

        {useMonacoEditor ? (
          <CodeBlockV2 readOnly={false} codeLanguage={language} expression={preamble} onChange={onChange} />
        ) : (
          <CodeEditor value={preamble} language={language} onChange={onChange} />
        )}
      </div>
    );
  }
}

export default PreambleEditor;
