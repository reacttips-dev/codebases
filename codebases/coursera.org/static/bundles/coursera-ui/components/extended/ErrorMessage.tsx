/* eslint-disable no-use-before-define, react/forbid-prop-types */
import PropTypes from 'prop-types';

import React from 'react';
import { css, StyleSheet, color } from '@coursera/coursera-ui';
import _t from 'i18n!nls/coursera-ui';

function parseJsonSafely(str: $TSFixMe) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return undefined;
  }
}

const getTranslations = () => ({
  error: _t('An error has occurred, please try again later'),
});

/**
 * A generic error message display that accepts optional children
 * Useful for displaying simple api error msg
 * NOTE: It's a work in progress, may be replaced by Notification soon
 */
const ErrorMessage = ({
  style = {},
  htmlAttributes = {},
  children,
  tag: Tag,
  defaultErrorMsg,
  error,
  data,

  // Default to true as currently mostly handling executeMutation errors
  isErrorResponseText = true,
}: $TSFixMe) => {
  let errorMsg = null;
  // Handle api related Error
  // ref: static/bundles/naptimejs/util/executeMutation.js
  if (error instanceof Error && isErrorResponseText && error.message) {
    const messageObj = parseJsonSafely(error.message);
    if (messageObj) {
      // Sometimes BE returns message instead of msg, not sure which is used more often
      errorMsg = messageObj.msg || messageObj.message;
    }
  } else if (data && data.error && data.error.message) {
    errorMsg = data.error.message;
  } else if (React.isValidElement(error)) {
    // @ts-ignore ts-migrate(2322) FIXME: Type 'ReactElement<unknown, string | ((props: any)... Remove this comment to see the full error message
    errorMsg = error;
  } else {
    // Handle generic error string or object
    errorMsg =
      typeof error === 'string'
        ? error
        : error && (error.msg || error.message || defaultErrorMsg || getTranslations().error);
  }

  return (
    <Tag {...htmlAttributes} {...css(styles.ErrorMessage)} style={style}>
      {errorMsg}
      {children}
    </Tag>
  );
};

ErrorMessage.propTypes = {
  // Override the inline-styles of the root element
  style: PropTypes.object,

  // Attributes overwrite.
  htmlAttributes: PropTypes.object,

  // Allow rendering of different tags, e.g. 'a', 'div', 'p', 'h1'
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  // GraphQL data
  data: PropTypes.object,
  // The actual error
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      msg: PropTypes.string, // preferred error format
      message: PropTypes.string,
    }),
  ]),
  defaultErrorMsg: PropTypes.string,
  // Option content to display after the error msg.
  children: PropTypes.node,
  // Sometimes api call throws Error instead of simple message or object
  isErrorResponseText: PropTypes.bool,
};

// Explicity declare the default props for documentation purpose,
ErrorMessage.defaultProps = {
  style: {},
  htmlAttributes: {},
  tag: 'p',
};

export default ErrorMessage;

const styles = StyleSheet.create({
  ErrorMessage: {
    color: color.danger,
  },
});
