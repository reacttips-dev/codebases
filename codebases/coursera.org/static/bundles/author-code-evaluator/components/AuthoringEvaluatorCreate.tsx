import PropTypes from 'prop-types';
import React from 'react';
import _t from 'i18n!nls/author-code-evaluator';

class AuthoringEvaluatorCreate extends React.Component {
  static propTypes = {
    onClickCreate: PropTypes.func.isRequired,
  };

  state = { evaluatorId: '', createInProgress: false };

  handleCreate = () => {
    const { evaluatorId } = this.state;

    this.setState({ createInProgress: true });

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onClickCreate' does not exist on type 'R... Remove this comment to see the full error message
    this.props.onClickCreate(evaluatorId);
  };

  render() {
    const { createInProgress } = this.state;

    return (
      <div className="rc-AuthoringEvaluatorCreate">
        <h3 style={{ paddingTop: 20, paddingBottom: 5 }} className="headline-1-text">
          {_t('Evaluator Id')}
        </h3>

        <div className="caption-text" style={{ paddingBottom: 10 }}>
          {_t('Enter an existing evaluator id to clone')}
        </div>

        <input
          type="text"
          style={{ width: 300, padding: 8 }}
          onChange={(event) => this.setState({ evaluatorId: event.target.value })}
        />

        <div style={{ paddingTop: 40 }}>
          <button disabled={createInProgress} className="primary" onClick={this.handleCreate}>
            {createInProgress ? _t('Creating...') : _t('Create Evaluator')}
          </button>
        </div>
      </div>
    );
  }
}

export default AuthoringEvaluatorCreate;
