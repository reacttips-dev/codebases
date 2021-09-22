/* @jsx jsx */
import { jsx } from '@emotion/react';
import _ from 'lodash';
import _t from 'i18n!nls/discussions';
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'bundles/ui/components/Modal';
import { Button, Typography, useTheme } from '@coursera/cds-core';
import type { Theme } from '@coursera/cds-core';
import TrackedButton from 'bundles/page/components/TrackedButton';
import CMLUtils from 'bundles/cml/utils/CMLUtils';
import DiscussionsCMLUtils from 'bundles/discussions/utils/DiscussionsCMLUtils';
import ModerationReasons from 'bundles/discussions/components/ModerationReasons';
import NotifyOption from 'bundles/discussions/components/NotifyOption';
import { DTD_NAME } from 'bundles/discussions/constants';
import { editThread } from 'bundles/discussions/actions/DropdownActions';
import { TitleInput, ContentInput } from 'bundles/discussions/components/NewThreadFormComponents';
import RequiredField from 'bundles/discussions/components/RequiredField';
import 'css!../../../__styles__/forumsV2-NewThreadButton';

type Props = {
  courseId?: string;
  question: $TSFixMe;
  showReasons?: boolean;
  handleClose: () => void;
};

type InputProps = Props & { theme: Theme };

type State = {
  title: $TSFixMe;
  content: $TSFixMe;
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
  router: $TSFixMe;
};

class EditThreadModal extends React.Component<InputProps, State> {
  submitButton!: HTMLElement | null;

  editThreadModal!: Modal | null;

  titleElemRef!: HTMLElement | null;

  contentElemRef!: HTMLElement | null;

  reasons!: HTMLElement | null;

  cancel!: HTMLElement | null;

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  constructor(props: InputProps, context: Context) {
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

  closeModal = () => {
    const { handleClose } = this.props;
    handleClose();
  };

  handleSubmit = () => {
    const { title, content, selectedOption, dontNotify } = this.state;
    const { executeAction } = this.context;
    const { question } = this.props;
    const hasAnyErrors = _.some(this.state, (item) => item.hasError);

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
        handleSuccess: this.closeModal,
        handleFailure: this.handleSaveError,
        reason: selectedOption,
        dontNotify,
      });
    }
  };

  handleInputChange = (inputName: string, event: $TSFixMe) => {
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

  handleSelect = (event: $TSFixMe) => {
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

  toggleNotify = () => {
    const { dontNotify } = this.state;
    this.setState({ dontNotify: !dontNotify });
  };

  setTitleElemRef = (elem: $TSFixMe) => {
    this.titleElemRef = elem;
  };

  setContentElemRef = (elem: $TSFixMe) => {
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
    const { courseId, theme } = this.props;

    const contentLengthWarning = DiscussionsCMLUtils.generateContentLengthWarning(content.value);

    const saveErrorDisplay = <div className="c-error-text c-form-error-message">{saveErrorMessage}</div>;

    const inputError = <div className="c-error-text c-modal-error-message">{_t('Please select a reason')}</div>;

    let modalContents;
    if (showModerationReasons) {
      modalContents = (
        <div>
          <Typography variant="h2" className="c-modal-subtitle">
            {_t('Why do you want to edit this?')}
          </Typography>
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
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={this.closeModal}
                ref={(node) => {
                  this.cancel = node;
                }}
              >
                {_t('Cancel')}
              </Button>
              &nbsp;&nbsp;
              <Button
                variant="primary"
                size="small"
                type="submit"
                ref={(node) => {
                  this.submitButton = node;
                }}
                disabled={saving}
                onClick={this.handleReasonsSubmit}
                component={TrackedButton}
                trackingName="moderation_thread_edit"
                withVisibilityTracking={true}
                requireFullyVisible={false}
              >
                {_t('Edit Post')}
              </Button>
            </div>
          </div>
        </div>
      );
    } else {
      modalContents = (
        <div>
          <div className="c-input-area">
            <RequiredField fieldName={_t('Title')} />
            <br />
            <TitleInput
              id="title-input"
              hasError={showErrors && title.hasError}
              value={title.value}
              handleInputChange={this.handleInputChange}
              elemRefHook={this.setTitleElemRef}
            />
          </div>
          <div>
            <RequiredField fieldName={_t('Body')} />
            <br />
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
            <div className="horizontal-box align-items-right" css={{ margin: theme.spacing(48, 0, 0) }}>
              <Button variant="secondary" size="small" type="button" onClick={this.closeModal}>
                {_t('Cancel')}
              </Button>
              &nbsp;&nbsp;
              <Button
                variant="primary"
                size="small"
                type="submit"
                component={TrackedButton}
                ref={(node) => {
                  this.submitButton = node;
                }}
                disabled={saving}
                onClick={this.handleSubmit}
                trackingName="thread_edit"
                withVisibilityTracking={true}
                requireFullyVisible={false}
              >
                {_t('Submit')}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    const modal = (
      <Modal
        modalName={_t('Edit thread')}
        onRequestClose={this.closeModal}
        ref={(node) => {
          this.editThreadModal = node;
        }}
        className="rc-ForumsV2__NewThreadModal large"
      >
        <Typography component="h1" variant="h1semibold" className="c-modal-title">
          {_t('Edit thread')}
        </Typography>
        {modalContents}
      </Modal>
    );

    return <div className="rc-EditThreadForm">{modal}</div>;
  }
}

const EditThreadModalWrapper = (props: Props) => {
  const theme = useTheme();

  return <EditThreadModal {...props} theme={theme} />;
};

export default EditThreadModalWrapper;
