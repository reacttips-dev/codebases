import React from 'react';
import classNames from 'classnames';
// TODO(riwong/wbowers/aahuja): Migrate to react-bootstrap-33 and handle DropdownMenu's `children`
import { DropdownMenu, MenuItem } from 'react-bootstrap';
import ValidationErrorText from 'bundles/author-common/components/ValidationErrorText';
import AuthoringEvaluatorCreate from 'bundles/author-code-evaluator/components/AuthoringEvaluatorCreate';
import Modal from 'bundles/phoenix/components/Modal';
import AuthoringEvaluatorApiUtils, {
  AuthoringEvaluatorResponse,
} from 'bundles/author-code-evaluator/utils/AuthoringEvaluatorAPIUtils';
import { LanguageType } from 'bundles/cml/constants/codeLanguages';
import {
  Evaluator,
  EvaluatorTemplatesResponse,
  getEvaluatorTemplatesForTag,
} from 'bundles/authoring/content-authoring/api/authoringEvaluatorTemplates';
import _t from 'i18n!nls/authoring';
import 'css!./__styles__/CMLCodeEditorEvaluatorDropdown';

const CUSTOM_EVALUATOR_ID = 'CUSTOM_EVALUATOR_ID';

type Props = {
  language: LanguageType;
  courseId: string;
  branchId: string;
  itemId: string;
  evaluatorId?: string;
  value: string;
  onSave: (evaluatorId: string, value: string) => void;
  handleOpen: () => void;
  toggleEcbConfigModal?: (showEcbConfigModal: boolean, ecbModalComponent: React.ReactElement | null) => void;
};

type State = {
  loading: boolean;
  isDropdownOpen: boolean;
  isModalOpen: boolean;
  errorMessage?: string;
  evaluators: Array<Evaluator>;
};

class CMLCodeEditorEvaluatorDropdown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: false,
      isDropdownOpen: false,
      isModalOpen: false,
      errorMessage: undefined,
      evaluators: [],
    };
  }

  handleCreate = (templateEvaluatorId: string) => {
    const { courseId, branchId, itemId } = this.props;

    this.setState({
      loading: true,
      isDropdownOpen: false,
      errorMessage: undefined,
    });

    AuthoringEvaluatorApiUtils.create({
      courseId,
      branchId,
      itemId,
      evaluatorId: templateEvaluatorId,
    })
      .then((createdEvaluator: AuthoringEvaluatorResponse) => {
        this.props.onSave(createdEvaluator.id, this.props.value);
        this.setState({
          loading: false,
          isModalOpen: false,
        });
        this.props.handleOpen();
      })
      .catch(() => {
        this.setState({
          loading: false,
          isModalOpen: false,
          errorMessage: _t('Error while cloning evaluator.'),
        });
      })
      .done();
  };

  handleSelect = (evaluatorKey: string) => {
    const { toggleEcbConfigModal } = this.props;

    if (evaluatorKey === CUSTOM_EVALUATOR_ID) {
      this.setState({
        isModalOpen: true,
        isDropdownOpen: false,
        loading: false,
      });

      if (typeof toggleEcbConfigModal === 'function') {
        // pass up the modal component to render for parent CMLEditorV2
        toggleEcbConfigModal(true, this.renderCreationModal());
        this.setState({ isModalOpen: false }); // since the parent will render the modal instead
      }
    } else {
      this.handleCreate(evaluatorKey);
    }
  };

  handleClick = () => {
    if (this.props.evaluatorId) {
      this.props.handleOpen();
    } else if (this.state.isDropdownOpen) {
      this.setState({
        isDropdownOpen: false,
      });
    } else {
      this.setState({
        errorMessage: undefined,
        loading: true,
      });
      getEvaluatorTemplatesForTag(this.props.language, this.props.courseId)
        .then((response: EvaluatorTemplatesResponse) => {
          this.setState({
            evaluators: response.elements,
            isDropdownOpen: true,
            loading: false,
          });
        })
        .catch(() => {
          this.setState({
            errorMessage: _t('An unknown error has occurred.'),
            isDropdownOpen: false,
            loading: false,
          });
        })
        .done();
    }
  };

  onCloseModal = () => {
    const { toggleEcbConfigModal } = this.props;

    if (typeof toggleEcbConfigModal === 'function') {
      toggleEcbConfigModal(false, null);
    } else {
      this.setState({
        isModalOpen: false,
      });
    }
  };

  renderButton() {
    const { evaluatorId } = this.props;
    const { loading } = this.state;

    const buttonClasses = classNames('evaluator-config-link', {
      'button-link': !evaluatorId,
    });

    return (
      <button type="button" onClick={this.handleClick} className={buttonClasses}>
        {!loading && (evaluatorId ? _t('Interactive Settings') : _t('Make it interactive'))}
        {loading && <span className="cif-spin cif-spinner" style={{ marginLeft: 32 }} />}
      </button>
    );
  }

  renderDropdown() {
    const { evaluators, loading } = this.state;

    // TODO(riwong/wbowers/aahuja): Make the children work with react-bootstrap-33
    return (
      <DropdownMenu
        id="code-editor-dropdown"
        // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
        defaultOpen={true}
        noCaret={true}
        onSelect={this.handleSelect}
        rootCloseEvent="click"
      >
        {!loading &&
          evaluators.map((evaluator) => {
            return (
              <MenuItem key={evaluator.id} eventKey={evaluator.id}>
                {evaluator.name}
              </MenuItem>
            );
          })}
        {!loading && (
          <MenuItem key={CUSTOM_EVALUATOR_ID} eventKey={CUSTOM_EVALUATOR_ID}>
            <span className="">{_t('Enter a custom evaluator')}</span>
          </MenuItem>
        )}
      </DropdownMenu>
    );
  }

  renderCreationModal() {
    return (
      <Modal modalName={_t('Clone a custom evaluator')} handleClose={this.onCloseModal}>
        <AuthoringEvaluatorCreate onClickCreate={this.handleCreate} />
      </Modal>
    );
  }

  render() {
    const { isDropdownOpen, isModalOpen, errorMessage } = this.state;

    return (
      <div className="rc-CMLCodeEditorEvaluatorDropdown">
        {this.renderButton()}

        {isDropdownOpen && this.renderDropdown()}

        {isModalOpen && this.renderCreationModal()}

        {errorMessage && (
          <ValidationErrorText style={{ display: 'inline-block', marginLeft: 16 }}>{errorMessage}</ValidationErrorText>
        )}
      </div>
    );
  }
}

export default CMLCodeEditorEvaluatorDropdown;
