import PropTypes from 'prop-types';
import React from 'react';

import CodeEditor from 'bundles/phoenix/components/CodeEditor';
import CodeBlockV2 from 'bundles/code-evaluator/components/CodeBlockV2';
import StarterCode from 'bundles/author-code-evaluator/models/StarterCode';
import AuthorEvaluatorSectionHeader from 'bundles/author-code-evaluator/components/AuthorEvaluatorSectionHeader';
import AuthorEvaluatorSectionCaption from 'bundles/author-code-evaluator/components/AuthorEvaluatorSectionCaption';
import { isMonacoEnabled } from 'bundles/cml/utils/FeatureUtils';
import _t from 'i18n!nls/author-code-evaluator';

class SimpleStarterCodeEditor extends React.Component {
  useMonacoEditor = isMonacoEnabled();

  static propTypes = {
    starterCode: PropTypes.instanceOf(StarterCode).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  handleChange = (expression: $TSFixMe) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'starterCode' does not exist on type 'Rea... Remove this comment to see the full error message
    const { language } = this.props.starterCode;
    const starterCode = new StarterCode({ expression, language });

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onChange' does not exist on type 'Readon... Remove this comment to see the full error message
    this.props.onChange(starterCode);
  };

  render() {
    const {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'starterCode' does not exist on type 'Rea... Remove this comment to see the full error message
      starterCode: { expression, language },
    } = this.props;

    return (
      <div className="rc-SimpleStarterCodeEditor">
        <AuthorEvaluatorSectionHeader style={{ paddingTop: 20, paddingBottom: 5, display: 'inline-block' }}>
          {_t('Starter Code')}
        </AuthorEvaluatorSectionHeader>
        <AuthorEvaluatorSectionCaption style={{ marginLeft: 20, display: 'inline-block' }}>
          {_t('Visible to learners')}
        </AuthorEvaluatorSectionCaption>

        {this.useMonacoEditor ? (
          <CodeBlockV2 codeLanguage={language} expression={expression} onChange={this.handleChange} readOnly={false} />
        ) : (
          <CodeEditor value={expression} language={language} onChange={this.handleChange} />
        )}
      </div>
    );
  }
}

export default SimpleStarterCodeEditor;
