import React from 'react';
import classNames from 'classnames';
import _t from 'i18n!nls/discussions';

import { questions } from 'bundles/discussions/constants';
import DiscussionsCMLUtils from 'bundles/discussions/utils/DiscussionsCMLUtils';
import { CmlContent } from 'bundles/cml/types/Content';
import ForumsCmlEditor from 'bundles/discussions/components/ForumsCmlEditor';

import 'css!./__styles__/NewThreadFormComponents';

type ForumObject = {
  id: string;
  title: string;
  parentForumId?: string;
};

type ChangeEvent = {
  value: string | CmlContent | ForumObject;
  isValid: boolean;
};

type TitleInputProps = {
  id?: string;
  handleInputChange: (type: string, event: ChangeEvent) => void;
  value: string;
  hasError: boolean;
  elemRefHook?: (elem: HTMLElement | null) => void;
};

const MIN_TITLE_LEN = questions.thought.minChars;
const MAX_TITLE_LEN = questions.thought.maxChars;
const EMPTY_FORUM_ID = 'empty';

// note: necessary to avoid caching translated title
const getEmptyForumObject = () => {
  return {
    id: EMPTY_FORUM_ID,
    title: _t('Please select a forum'),
  };
};

class TitleInput extends React.Component<TitleInputProps> {
  elemRef!: HTMLElement | null;

  componentDidMount() {
    // This is a hack because the CML editor partially steals focus
    setTimeout(() => this.elemRef && this.elemRef.focus(), 0);
  }

  handleInputChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const { handleInputChange } = this.props;
    if (e.currentTarget.value.length <= MAX_TITLE_LEN) {
      const event = {
        value: e.currentTarget.value,
        isValid: this.validate(e.currentTarget.value),
      };
      handleInputChange('title', event);
    }
  };

  getErrorMessage = (key: string | null) => {
    const translatedStrings = {
      TOO_SHORT: _t('Error: Please enter a longer title'),
    };
    return key ? translatedStrings[key] : '';
  };

  checkForErrors = (newValue: string) => {
    if (newValue.length <= MIN_TITLE_LEN) {
      return 'TOO_SHORT';
    }
    return null;
  };

  validate(newValue: string) {
    return this.checkForErrors(newValue) === null;
  }

  setElemRef = (elem: HTMLElement | null) => {
    const { elemRefHook } = this.props;
    this.elemRef = elem;
    if (typeof elemRefHook === 'function') {
      elemRefHook(elem);
    }
  };

  renderError = (errorMessage?: string) => {
    const { value, id } = this.props;
    return (
      <div className="c-form-error-message color-danger" id={`${id}-error-message`}>
        {errorMessage || this.getErrorMessage(this.checkForErrors(value))}
      </div>
    );
  };

  render() {
    const { id, value, hasError } = this.props;
    const classes = classNames({
      'c-form-input': true,
      'c-has-error': hasError,
    });

    return (
      <div className="c-form">
        <input
          aria-required={true}
          aria-invalid={hasError}
          aria-describedby={`${id}-error-message`}
          ref={this.setElemRef}
          id={id}
          className={classes}
          onChange={this.handleInputChange}
          placeholder={_t('Write a descriptive title')}
          required={true}
          title={_t('Title')}
          value={value}
        />
        {hasError && this.renderError()}
      </div>
    );
  }
}

type ContentInputProps = {
  id?: string;
  courseId?: string;
  handleInputChange: (type: string, event: ChangeEvent) => void;
  cml: CmlContent;
  hasError: boolean;
  elemRefHook?: (elem: HTMLElement | null) => void;
};

class ContentInput extends React.Component<ContentInputProps> {
  handleInputChange = (cml: CmlContent) => {
    const { handleInputChange } = this.props;
    const event = {
      value: cml,
      isValid: DiscussionsCMLUtils.validateLength(cml),
    };
    handleInputChange('content', event);
  };

  getErrorMessage = (key?: string) => {
    const translatedStrings = {
      TOO_SHORT: _t('Error: Please enter a longer thread description'),
      TOO_LONG: _t('Error: Please enter a shorter thread description'),
    };
    return key ? translatedStrings[key] : '';
  };

  renderError = (errorMessage?: string) => {
    const { cml, id } = this.props;
    return (
      <div className="c-form-error-message color-danger" id={`${id}-error-message`}>
        {errorMessage || this.getErrorMessage(DiscussionsCMLUtils.checkForErrors(cml))}
      </div>
    );
  };

  render() {
    const { id, cml, elemRefHook, hasError, courseId } = this.props;
    const classes = classNames({
      'c-form': true,
      'c-form-textarea': true,
      'c-has-error': hasError,
    });
    const contentLengthWarning = DiscussionsCMLUtils.generateContentLengthWarning(cml);

    return (
      <div className={classes} aria-required={true} aria-invalid={hasError}>
        <ForumsCmlEditor
          cml={cml}
          contentId={id}
          placeholder={_t('Provide supporting details or context')}
          onChange={this.handleInputChange}
          imageUploadOptions={DiscussionsCMLUtils.getImageUploadOptions(courseId)}
          ariaLabel={_t('Provide supporting details or context')}
          ariaDescribedBy={hasError ? `${id}-error-message` : undefined}
          ariaRequired="true"
          focusOnLoad={false} // since the forum title is the first input in the modal
        />
        {hasError ? this.renderError() : contentLengthWarning}
      </div>
    );
  }
}

type ForumSelectorProps = {
  id?: string;
  rootForumId?: string;
  handleInputChange: (type: string, event: ChangeEvent) => void;
  forums: Array<ForumObject>;
  value: ForumObject;
  hasError: boolean;
  elemRefHook?: (elem: HTMLElement | null) => void;
};

class ForumSelector extends React.Component<ForumSelectorProps> {
  static defaultProps = { hasError: false };

  shouldComponentUpdate(nextProps: ForumSelectorProps) {
    const { value, hasError } = this.props;
    return (
      !value ||
      !nextProps.value ||
      hasError !== nextProps.hasError ||
      (!!value.id && !!nextProps.value.id && value.id !== nextProps.value.id)
    );
  }

  handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { forums, handleInputChange } = this.props;
    const selectedForumId = e.currentTarget.value;
    const event = {
      value: forums.find((item) => item.id === selectedForumId) || getEmptyForumObject(),
      isValid: this.validate(selectedForumId),
    };
    handleInputChange('currentForum', event);
  };

  getErrorMessage = (key: string | null) => {
    const translatedStrings = {
      MISSING_FORUM: _t('Error: Please select a forum'),
    };
    return key ? translatedStrings[key] : '';
  };

  checkForErrors = (newValue: string) => {
    const emptyForum = getEmptyForumObject();
    if (newValue === emptyForum.id || !newValue) {
      return 'MISSING_FORUM';
    }
    return null;
  };

  validate(newValue: string) {
    return this.checkForErrors(newValue) === null;
  }

  renderError = (errorMessage?: string) => {
    const { value } = this.props;
    return (
      <div className="c-form-error-message color-danger" role="alert">
        {errorMessage || this.getErrorMessage(this.checkForErrors(value && value.id))}
      </div>
    );
  };

  render() {
    const { value, elemRefHook, hasError, id, forums, rootForumId } = this.props;
    const classes = classNames({
      'c-form-input': true,
      'c-form-select': true,
      'c-has-error': hasError,
    });

    const selectorItems = forums.map((forum: ForumObject) => {
      return (
        <option key={forum.id} value={forum.id}>
          {forum.parentForumId &&
            forum.parentForumId !== rootForumId &&
            // right pipe followed by space
            '\x20\u2515\x20\x20'}
          {forum.title}
        </option>
      );
    });

    // if there is no default forum, add the "please select" empty forum to the list
    if (!value || value.id === 'empty') {
      const emptyForum = getEmptyForumObject();
      selectorItems.unshift(
        <option key={emptyForum.id} value={emptyForum.id}>
          {emptyForum.title}
        </option>
      );
    }

    return (
      <div className="c-form">
        <select
          id={id}
          value={(value && value.id) || EMPTY_FORUM_ID}
          ref={elemRefHook}
          className={classes}
          title={_t('Select a subforum')}
          onChange={this.handleInputChange}
          aria-required={true}
          aria-invalid={hasError}
          required={true}
        >
          {selectorItems}
        </select>
        {hasError && this.renderError()}
      </div>
    );
  }
}

export default {
  TitleInput,
  ContentInput,
  ForumSelector,
};

export { TitleInput, ContentInput, ForumSelector };
