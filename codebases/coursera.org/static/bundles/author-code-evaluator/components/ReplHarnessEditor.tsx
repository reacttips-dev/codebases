import PropTypes from 'prop-types';
import React from 'react';
import PreambleEditor from 'bundles/author-code-evaluator/components/PreambleEditor';
import ReplHarness from 'bundles/author-code-evaluator/models/ReplHarness';

class ReplHarnessEditor extends React.Component {
  static propTypes = {
    harness: PropTypes.instanceOf(ReplHarness),
    language: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    useMonacoEditor: PropTypes.bool,
  };

  handleChange = (preamble: $TSFixMe) => {
    const harness = new ReplHarness({ preamble });
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onChange' does not exist on type 'Readon... Remove this comment to see the full error message
    this.props.onChange(harness.toJSON());
  };

  render() {
    const {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'harness' does not exist on type 'Readonl... Remove this comment to see the full error message
      harness: { preamble },
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'language' does not exist on type 'Readon... Remove this comment to see the full error message
      language,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'useMonacoEditor' does not exist on type ... Remove this comment to see the full error message
      useMonacoEditor,
    } = this.props;

    return (
      <div className="rc-ReplHarnessEditor">
        <PreambleEditor
          preamble={preamble}
          language={language}
          useMonacoEditor={useMonacoEditor}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default ReplHarnessEditor;
