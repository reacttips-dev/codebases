/* @jsx jsx */
import { jsx, css } from '@emotion/react';
import { Button } from '@coursera/cds-core';
import { stringKeyToTuple } from 'js/lib/stringKeyTuple';

import _t from 'i18n!nls/discussions';
import PropTypes from 'prop-types';
import React from 'react';
import CMLUtils from 'bundles/cml/utils/CMLUtils';
import { DTD_NAME } from 'bundles/discussions/constants';
import DiscussionsCMLUtils from 'bundles/discussions/utils/DiscussionsCMLUtils';

import { hideReplyEditor, editReply } from 'bundles/discussions/actions/DropdownActions';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import 'css!bundles/discussions/components/__styles__/NewThreadFormComponents';
import { getShouldLoadRaven } from 'js/lib/sentry';
import { CmlContent } from 'bundles/cml/types/Content';
import raven from 'raven-js/dist/raven.min';
import logger from 'js/app/loggerSingleton';
import ForumsCmlEditor from 'bundles/discussions/components/ForumsCmlEditor';

import { ForumPostWithCreator } from '../../__providers__/ForumPostDataProvider/__types__';

type PropsFromCaller = {
  reply: ForumPostWithCreator;
  ariaLabel?: string;
  ariaDescribedBy?: string;
};

type PropsFromStore = {
  courseId: string;
};

type PropsToComponent = PropsFromCaller & PropsFromStore;

type State = {
  initialValue: string;
  cml: CmlContent;
  hasErrors: boolean;
  submitError: boolean;
  lengthError: boolean;
  submitEnabled: boolean;
};

class ReplyCMLEdit extends React.Component<PropsToComponent, State> {
  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  editorElemRef: any;

  constructor(props, context) {
    super(props, context);
    const modelContent = props.reply.content.details;
    let cml = modelContent;

    // convert non-cml post into cml
    // can be removed if all posts are cml
    if (!modelContent || !modelContent.typeName) {
      const value = '<co-content><text>' + (modelContent || '') + '</text></co-content>';
      cml = CMLUtils.create(value, DTD_NAME);
    }

    // Use the new dtdId. Can be removed once all posts have the current dtdId
    cml.definition.dtdId = DTD_NAME;

    this.state = {
      initialValue: cml.definition.value,
      cml,
      hasErrors: false,
      submitError: false,
      lengthError: false,
      submitEnabled: false,
    };

    this.editorElemRef = null;
  }

  logError = (error) => {
    let sentryErrorMsg;

    if (error && typeof error === 'string') {
      sentryErrorMsg = error;
    } else if (error && error.typeof(Error) === true) {
      sentryErrorMsg = error.toString();
    }

    // `consoleErrorMsg` will show up in the console when LearnerServices requests the user to take a screenshot of their console.
    const consoleErrorMsg = `${sentryErrorMsg} for discussion forum ReplyCMLEdit.jsx`;

    logger.error(consoleErrorMsg);

    if (getShouldLoadRaven()) {
      raven.captureException(new Error(sentryErrorMsg));
    }
  };

  handleSubmit = () => {
    if (this.state.hasErrors) {
      return;
    }

    this.setState({
      submitEnabled: false,
    });

    this.context.executeAction(editReply, {
      reply: this.props.reply,
      content: this.state.cml,
      handleFailure: this.onSubmitError,
      onSuccess: this.onSubmitSuccess,
    });
  };

  handleCancel = () => {
    this.hideEdit();
  };

  handleInputChange = (cml) => {
    this.setState({
      cml,
      hasErrors: !DiscussionsCMLUtils.validateLength(cml),
      submitEnabled: cml.definition.value !== this.state.initialValue,
    });
  };

  onSubmitError = (error) => {
    this.setState({
      submitError: true,
      submitEnabled: true,
    });
  };

  onSubmitSuccess = () => {};

  hideEdit() {
    this.context.executeAction(hideReplyEditor, { reply: this.props.reply });
  }

  setEditorElemRef = (elem) => {
    this.editorElemRef = elem;
  };

  render() {
    const { reply, courseId, ariaLabel, ariaDescribedBy } = this.props;
    const { cml, submitError, submitEnabled, hasErrors } = this.state;
    const contentLengthWarning = DiscussionsCMLUtils.generateContentLengthWarning(cml);

    const submitErrorMessage = (
      <div className="c-error-text c-form-error-message">
        {_t('Something went wrong. Please reload the page and try again.')}
      </div>
    );

    const questionIdParts = stringKeyToTuple(reply.questionId || '');
    const questionId = questionIdParts[questionIdParts.length - 1];
    const imageUploadOptions = DiscussionsCMLUtils.getImageUploadOptions(courseId, questionId);

    return (
      <div className="rc-ReplyCML" data-rc="ReplyCML">
        <div className="editor-container">
          <ForumsCmlEditor
            cml={cml}
            placeholder={_t('Reply')}
            imageUploadOptions={imageUploadOptions}
            ariaLabel={ariaLabel || _t('Edit Reply')}
            ariaDescribedBy={ariaDescribedBy}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="horizontal-box align-items-right">
          <div className="flex-2">
            {contentLengthWarning}
            {submitError && submitErrorMessage}
          </div>
          <Button variant="primary" className="passive cancel" onClick={this.handleCancel}>
            {_t('Cancel')}
          </Button>
          <Button
            variant="secondary"
            className="secondary"
            onClick={this.handleSubmit}
            disabled={!submitEnabled || hasErrors}
          >
            {_t('Save')}
          </Button>
        </div>
      </div>
    );
  }
}

export default connectToStores<PropsToComponent, PropsFromCaller>(['CourseStore'], ({ CourseStore }) => {
  return {
    courseId: CourseStore.getCourseId(),
  };
})(ReplyCMLEdit);
