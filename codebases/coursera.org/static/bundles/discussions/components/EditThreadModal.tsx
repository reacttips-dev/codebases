import _ from 'underscore';
import _t from 'i18n!nls/discussions';
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'bundles/phoenix/components/Modal';
import CMLUtils from 'bundles/cml/utils/CMLUtils';
import DiscussionsCMLUtils from 'bundles/discussions/utils/DiscussionsCMLUtils';
import ModerationReasons from 'bundles/discussions/components/ModerationReasons';
import NotifyOption from 'bundles/discussions/components/NotifyOption';
import { DTD_NAME } from 'bundles/discussions/constants';
import { editThread } from 'bundles/discussions/actions/DropdownActions';
import { TitleInput, ContentInput } from 'bundles/discussions/components/NewThreadFormComponents';
import RequiredField from 'bundles/discussions/components/RequiredField';
import 'css!./__styles__/NewThreadButton';

type Props = {
  courseId?: string;
  question: any;
  showReasons?: boolean;
  handleClose: () => void;
};

type State = {
  title: any;
  content: any;
  showErrors: boolean;
  saving: boolean;
  saveError: boolean;
  saveErrorMessage: string;
  showModerationReasons: boolean;
  selectedOption: '';
  showInputError: boolean;
  dontNotify: boolean;
};

type Context = {
  router: any;
};

class EditThreadModal extends React.Component<Props, State> {
  submitButton!: HTMLElement | null;

  editThreadModal!: Modal | null;

  titleElemRef!: HTMLElement | null;

  contentElemRef!: HTMLElement | null;

  reasons!: HTMLElement | null;

  cancel!: HTMLElement | null;

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  constructor(props: Props, context: Context) {
    super(props, context);
    const modelContent = props.question.content;

    // convert non-cml post into cml
    // can be removed if all posts are cml
    let cml = modelContent.details;
    if (!modelContent.details || !modelContent.details.typeName) {
      const value = '<co-content><text>' + (modelContent.details || '') + '</text></co-content>';
      cml = CMLUtils.create(value, DTD_NAME);
    }

    // Use the new dtdId. Can be removed once all posts have the current dtdId
    cml.definition.dtdId = DTD_NAME;

    this.state = {
      title: {
        value: modelContent.question || '',
        hasError: false,
      },
      content: {
        value: cml,
        hasError: false,
      },
      showErrors: false,
      saving: false,
      saveError: false,
      saveErrorMessage: '',
      showModerationReasons: false,
      selectedOption: '',
      showInputError: false,
      dontNotify: false,
    };

    // @ts-expect-error TSMIGRATION
    this.titleElemRef = {};
  }

  componentWillMount() {
    const { showReasons } = this.props;
    this.setState({
      showModerationReasons: !!showReasons,
    });
  }

  handleSuccess = () => {
    this.closeModal();
  };

  handleSubmit = () => {
    const { title, content, selectedOption, dontNotify } = this.state;
    const { executeAction } = this.context;
    const { question } = this.props;
    const hasAnyErrors = _(this.state).any((item) => item.hasError);

    if (hasAnyErrors) {
      if (title.hasError) {
        // @ts-expect-error TSMIGRATION
        this.titleElemRef.focus();
      } else if (content.hasError) {
        // @ts-expect-error TSMIGRATION
        this.contentElemRef.focus();
      }
      this.setState({ showErrors: true });
    } else {
      this.setState({ saving: true });

      executeAction(editThread, {
        id: question.id,
        questionId: question.questionId,
        forumType: question.forumType,
        question: title.value,
        details: content.value,
        handleSuccess: this.handleSuccess,
        handleFailure: this.handleSaveError,
        reason: selectedOption,
        dontNotify,
      });
    }
  };

  handleInputChange = (inputName: string, event: any) => {
    // @ts-expect-error TSMIGRATION
    const { [inputName]: field } = this.state;

    field.value = event.value;
    field.hasError = !event.isValid;
    this.setState((prevState) => prevState);
  };

  handleSaveError = () => {
    this.setState({
      saveError: true,
      saveErrorMessage: _t('Something went wrong. Please reload the page and try again.'),
      saving: false,
    });
  };

  handleSelect = (event: any) => {
    this.setState({
      selectedOption: event.target.value,
    });
  };

  handleReasonsSubmit = () => {
    const { selectedOption } = this.state;
    if (!selectedOption) {
      this.setState({
        showInputError: true,
      });
    } else {
      this.setState({
        showModerationReasons: false,
      });
    }
  };

  handleReasonsCancel = () => {
    this.closeModal();
  };

  handleCloseModal = () => {
    this.closeModal();
  };

  handleCancel = () => {
    this.closeModal();
  };

  toggleNotify = () => {
    const { dontNotify } = this.state;
    this.setState({ dontNotify: !dontNotify });
  };

  closeModal() {
    const { handleClose } = this.props;
    handleClose();
  }

  setTitleElemRef = (elem: any) => {
    this.titleElemRef = elem;
  };

  setContentElemRef = (elem: any) => {
    this.contentElemRef = elem;
  };

  render() {
    const {
      showErrors,
      title,
      content,
      saveErrorMessage,
      showModerationReasons,
      dontNotify,
      showInputError,
      saving,
      saveError,
    } = this.state;
    const { courseId } = this.props;

    const contentLengthWarning = DiscussionsCMLUtils.generateContentLengthWarning(content.value);

    const saveErrorDisplay = <div className="c-error-text c-form-error-message">{saveErrorMessage}</div>;

    const inputError = <div className="c-error-text c-modal-error-message">{_t('Please select a reason')}</div>;

    let modalContents;
    if (showModerationReasons) {
      modalContents = (
        <div>
          <div className="c-modal-subtitle">
            <span>{_t('Why do you want to edit this? ')}</span>
          </div>
          <ModerationReasons
            ref={(node) => {
              this.reasons = node;
            }}
            handleSelect={this.handleSelect}
          />
          <NotifyOption dontNotify={dontNotify} toggleNotify={this.toggleNotify} />
          <div>
            {showInputError && inputError}
            <div className="horizontal-box align-items-right">
              <button
                type="button"
                ref={(node) => {
                  this.cancel = node;
                }}
                className="passive"
                onClick={this.handleReasonsCancel}
              >
                {_t('Cancel')}
              </button>
              &nbsp;&nbsp;
              <button
                ref={(node) => {
                  this.submitButton = node;
                }}
                disabled={saving}
                className="secondary"
                type="submit"
                onClick={this.handleReasonsSubmit}
              >
                {_t('Edit Post')}
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      modalContents = (
        <div>
          <div className="c-input-area">
            <RequiredField fieldName={_t('Title')} />
            <TitleInput
              id="title-input"
              hasError={showErrors && title.hasError}
              value={title.value}
              handleInputChange={this.handleInputChange}
              elemRefHook={this.setTitleElemRef}
            />
          </div>
          <div className="c-input-area">
            <RequiredField fieldName={_t('Body')} />
            <ContentInput
              id="content-body"
              courseId={courseId}
              hasError={showErrors && content.hasError}
              handleInputChange={this.handleInputChange}
              cml={content.value}
              elemRefHook={this.setContentElemRef}
            />
          </div>
          <div>
            {contentLengthWarning}
            {saveError && saveErrorDisplay}
            <div className="horizontal-box align-items-right">
              <button type="button" className="passive" onClick={this.handleCancel}>
                {_t('Cancel')}
              </button>
              &nbsp;&nbsp;
              <button
                ref={(node) => {
                  this.submitButton = node;
                }}
                disabled={saving}
                className="secondary"
                type="submit"
                onClick={this.handleSubmit}
              >
                {_t('Submit')}
              </button>
            </div>
          </div>
        </div>
      );
    }

    const modal = (
      <Modal
        ref={(node) => {
          this.editThreadModal = node;
        }}
        modalName={_t('Edit thread')}
        handleClose={this.handleCloseModal}
      >
        <h1 className="c-modal-title display-1-text">{_t('Edit thread')}</h1>
        {modalContents}
      </Modal>
    );

    return <div className="rc-EditThreadForm">{modal}</div>;
  }
}

export default EditThreadModal;
