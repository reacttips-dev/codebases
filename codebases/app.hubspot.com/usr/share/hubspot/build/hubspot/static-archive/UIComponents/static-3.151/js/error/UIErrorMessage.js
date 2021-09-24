'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { isValidElement } from 'react';
import classNames from 'classnames';
import I18n from 'I18n';
import H4 from '../elements/headings/H4';
import UIResultsMessage from '../results/UIResultsMessage';
import lazyEval from '../utils/lazyEval';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
import { getIllustrationNamePropType } from '../utils/propTypes/illustrationName';
var errorTypes = {
  badRequest: {
    image: 'errors/general',
    title: function title() {
      return I18n.text('ui.UIErrorMessage.badRequest.title');
    }
  },
  error: {
    image: 'errors/general',
    title: function title() {
      return I18n.text('ui.UIErrorMessage.error.title');
    }
  },
  expired: {
    image: 'errors/hourglass',
    title: function title() {
      return I18n.text('ui.UIErrorMessage.expired.title');
    }
  },
  notFound: {
    image: 'errors/map',
    title: function title() {
      return I18n.text('ui.UIErrorMessage.notFound.title');
    }
  }
};
var errors = Object.assign({}, errorTypes, {
  '400': errorTypes.badRequest,
  '403': errorTypes.expired,
  '404': errorTypes.notFound,
  '500': errorTypes.error
});

var ErrorBody = function ErrorBody(props) {
  return /*#__PURE__*/_jsx(UIResultsMessage.defaultProps.Body, Object.assign({}, props, {
    className: "private-error-msg__body"
  }));
};

var ErrorImage = function ErrorImage(props) {
  return /*#__PURE__*/_jsx(UIResultsMessage.defaultProps.Image, Object.assign({}, props, {
    className: "private-error-msg__image"
  }));
};

var getErrorValues = function getErrorValues(type) {
  return errors[type] || errors.error;
};

var defaultIllustrationProps = {
  width: 175
};

var renderTitle = function renderTitle(title) {
  if ( /*#__PURE__*/isValidElement(title) && title.type.isI18nElement) {
    return /*#__PURE__*/_jsx(H4, {
      className: "private-error-msg__title",
      children: title
    });
  } else if ( /*#__PURE__*/isValidElement(title)) {
    return title;
  } else {
    return /*#__PURE__*/_jsx(H4, {
      className: "private-error-msg__title",
      children: lazyEval(title)
    });
  }
};

export default function UIErrorMessage(_ref) {
  var className = _ref.className,
      illustration = _ref.illustration,
      title = _ref.title,
      type = _ref.type,
      rest = _objectWithoutProperties(_ref, ["className", "illustration", "title", "type"]);

  var _getErrorValues = getErrorValues(type),
      image = _getErrorValues.image,
      imageTitle = _getErrorValues.title;

  return /*#__PURE__*/_jsx(UIResultsMessage, Object.assign({}, rest, {
    className: classNames('private-error-msg', className),
    illustration: illustration || image,
    Image: ErrorImage,
    title: renderTitle(title || imageTitle)
  }));
}
UIErrorMessage.propTypes = {
  Body: PropTypes.elementType,
  children: PropTypes.node,
  illustration: getIllustrationNamePropType(),
  illustrationProps: PropTypes.object,
  title: createLazyPropType(PropTypes.oneOfType([PropTypes.node, PropTypes.string])),
  type: PropTypes.oneOf(Object.keys(errors))
};
UIErrorMessage.defaultProps = {
  Body: ErrorBody,
  illustrationProps: defaultIllustrationProps,
  type: 'error'
};
UIErrorMessage.displayName = 'UIErrorMessage';