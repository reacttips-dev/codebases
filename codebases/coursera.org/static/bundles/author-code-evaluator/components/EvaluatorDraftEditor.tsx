import type { RawEvaluatorDraft, RawHarness } from 'bundles/author-code-evaluator/models/EvaluatorDraft';
import EvaluatorDraft from 'bundles/author-code-evaluator/models/EvaluatorDraft';

import React from 'react';
import HarnessEditor from 'bundles/author-code-evaluator/components/HarnessEditor';

import user from 'js/lib/user';
import _t from 'i18n!nls/author-code-evaluator';

type Props = {
  language: string;
  evaluatorDraft: EvaluatorDraft;
  onChange: (draft: RawEvaluatorDraft) => void;
};

class EvaluatorDraftEditor extends React.Component<Props> {
  handleHarnessChange = (harness: RawHarness) => {
    const { id, isPublished, versionedEngineId } = this.props.evaluatorDraft;
    const evaluator = { harness, versionedEngineId };
    const evaluatorDraft = new EvaluatorDraft({ id, evaluator, isPublished });

    this.props.onChange(evaluatorDraft.toJSON());
  };

  onChangeVersionedEngineId = (event: React.ChangeEvent<HTMLElement>) => {
    if (event.target instanceof HTMLInputElement) {
      const versionedEngineId = event.target.value;

      const { id, isPublished } = this.props.evaluatorDraft;
      const harness = this.props.evaluatorDraft.harness.toJSON();
      const evaluator = { harness, versionedEngineId };
      const evaluatorDraft = new EvaluatorDraft({ id, evaluator, isPublished });

      this.props.onChange(evaluatorDraft.toJSON());
    }
  };

  render() {
    const { evaluatorDraft, language } = this.props;
    const { versionedEngineId } = evaluatorDraft;
    const { harness } = evaluatorDraft;
    const isSuperuser = user.isSuperuser();

    return (
      <div className="rc-EvaluatorDraftEditor">
        <div className="horizontal-box align-items-vertical-center">
          <h3 className="body-2-text">{_t('Versioned Engine Id:')}</h3>

          {!isSuperuser && <p style={{ paddingLeft: 20 }}>{versionedEngineId}</p>}

          {isSuperuser && (
            <input
              size={30}
              maxLength={68}
              style={{ marginLeft: 20 }}
              value={versionedEngineId}
              onChange={this.onChangeVersionedEngineId}
            />
          )}
        </div>

        <HarnessEditor harness={harness} language={language} onChange={this.handleHarnessChange} />
      </div>
    );
  }
}

export default EvaluatorDraftEditor;
