'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import SequenceEnrollmentRecord from 'sales-modal/data/SequenceEnrollmentRecord';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import { UsageTracker } from 'sales-modal/utils/enrollModal/UsageLogger';
import H4 from 'UIComponents/elements/headings/H4';
import UICardHeader from 'UIComponents/card/UICardHeader';
import UICardSection from 'UIComponents/card/UICardSection';
import UICardWrapper from 'UIComponents/card/UICardWrapper';
import UIIcon from 'UIComponents/icon/UIIcon';
import { CANDY_APPLE } from 'HubStyleTokens/colors';
import MissingMergeTag from './MissingMergeTag';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { formatMergeTag } from 'draft-plugins/utils/propertyUtils';
import getMissingMergeTags from 'sales-modal/redux/utils/getMissingMergeTags';

var MissingMergeTags = function MissingMergeTags(_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      flattenedProperties = _ref.flattenedProperties,
      contact = _ref.contact,
      user = _ref.user,
      enrollmentSetMergeTags = _ref.enrollmentSetMergeTags,
      properties = _ref.properties;
  var missingMergeTags = getMissingMergeTags({
    sequenceEnrollment: sequenceEnrollment
  });

  if (missingMergeTags.isEmpty()) {
    return null;
  }

  return /*#__PURE__*/_jsxs(UICardWrapper, {
    compact: true,
    style: {
      maxWidth: 960
    },
    children: [/*#__PURE__*/_jsx(UICardHeader, {
      title: /*#__PURE__*/_jsxs(Fragment, {
        children: [/*#__PURE__*/_jsx(UIIcon, {
          className: "p-right-2",
          color: CANDY_APPLE,
          name: "warning"
        }), /*#__PURE__*/_jsx(FormattedMessage, {
          message: "missingMergeTagComponent.title"
        })]
      })
    }), /*#__PURE__*/_jsx(UICardSection, {
      children: /*#__PURE__*/_jsx(H4, {
        className: "missing-merge-tags",
        children: missingMergeTags.map(function (entityKey, tagType) {
          var _tagType$split = tagType.split('.'),
              _tagType$split2 = _slicedToArray(_tagType$split, 2),
              prefix = _tagType$split2[0],
              property = _tagType$split2[1];

          var tagName = formatMergeTag(prefix, property, flattenedProperties);
          return /*#__PURE__*/_jsx(MissingMergeTag, {
            tagType: tagType,
            flattenedProperties: flattenedProperties,
            contact: contact,
            user: user,
            handleMissingMergeTags: function handleMissingMergeTags(mergeTagInputFields) {
              UsageTracker.track('sequencesUsage', {
                action: 'Resolved token',
                subscreen: 'enroll'
              });
              enrollmentSetMergeTags(mergeTagInputFields);
            },
            properties: properties,
            children: tagName
          }, tagType);
        }).toList()
      })
    })]
  });
};

MissingMergeTags.propTypes = {
  sequenceEnrollment: PropTypes.instanceOf(SequenceEnrollmentRecord).isRequired,
  properties: PropTypes.instanceOf(ImmutableMap),
  flattenedProperties: PropTypes.instanceOf(ImmutableMap),
  contact: PropTypes.instanceOf(ContactRecord),
  user: PropTypes.object,
  enrollmentSetMergeTags: PropTypes.func.isRequired
};
export default connect(function (state) {
  return {
    flattenedProperties: state.flattenedProperties
  };
})(MissingMergeTags);