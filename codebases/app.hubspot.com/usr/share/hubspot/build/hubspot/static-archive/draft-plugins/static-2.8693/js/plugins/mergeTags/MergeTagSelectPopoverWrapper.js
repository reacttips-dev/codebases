'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Map as ImmutableMap } from 'immutable';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import { MergeTagTypes } from 'draft-plugins/lib/mergeTagConstants';
import getMemoizedPropertyOptions from '../../utils/getMemoizedPropertyOptions';
import { FOCUS_TARGETS } from '../../lib/constants';
import createMergeTagSelectPopoverContent from './MergeTagSelectPopoverContent';
export default (function (Child, _ref) {
  var _propTypes;

  var buttonClassName = _ref.buttonClassName,
      mergeTags = _ref.mergeTags,
      createEntityOptions = _ref.createEntityOptions,
      _ref$dataProp = _ref.dataProp,
      dataProp = _ref$dataProp === void 0 ? 'properties' : _ref$dataProp,
      tracker = _ref.tracker,
      onInsertToken = _ref.onInsertToken,
      contentType = _ref.contentType,
      showButtonIcon = _ref.showButtonIcon,
      Tracker = _ref.Tracker;
  var MergeTagSelectPopoverContent = createMergeTagSelectPopoverContent({
    mergeTags: mergeTags,
    createEntityOptions: createEntityOptions,
    dataProp: dataProp,
    tracker: tracker,
    onInsertToken: onInsertToken,
    Tracker: Tracker
  });
  return createReactClass({
    displayName: 'MergeTagSelectPopoverWrapper',
    propTypes: (_propTypes = {
      currentFocus: PropTypes.oneOf(Object.keys(FOCUS_TARGETS).map(function (key) {
        return FOCUS_TARGETS[key];
      })).isRequired,
      editorState: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired,
      subjectState: PropTypes.object,
      subjectChange: PropTypes.func
    }, _defineProperty(_propTypes, dataProp, PropTypes.instanceOf(ImmutableMap)), _defineProperty(_propTypes, "onClose", PropTypes.func), _propTypes),
    getInitialState: function getInitialState() {
      var contact = MergeTagTypes.CONTACT;
      return {
        open: false,
        selectedType: contact
      };
    },
    handleClick: function handleClick() {
      this.setState(function (prevState) {
        return {
          open: !prevState.open
        };
      });
    },
    handleOpenChange: function handleOpenChange(e) {
      this.setState({
        open: e.target.value
      });
    },
    handleSelectMergeTag: function handleSelectMergeTag(e) {
      var type = e.target.value;
      this.setState({
        selectedType: type
      });
    },
    renderPopoverContent: function renderPopoverContent() {
      var passthroughProps = Object.assign({}, this.props, {
        onChangeSelectedType: this.handleSelectMergeTag,
        onClose: this.handleClick
      });
      return /*#__PURE__*/_jsx(MergeTagSelectPopoverContent, Object.assign({}, passthroughProps));
    },
    render: function render() {
      var _this$state = this.state,
          open = _this$state.open,
          selectedType = _this$state.selectedType;
      var propertyOptions = getMemoizedPropertyOptions(selectedType, this.props[dataProp]);

      if (propertyOptions === null) {
        return null;
      }

      var className = 'merge-tag-popover' + (selectedType !== MergeTagTypes.PLACEHOLDER ? " merge-tag-popover-search" : "");
      return /*#__PURE__*/_jsx(UIPopover, {
        use: "default",
        "data-test-id": "merge-tag-popover",
        onOpenChange: this.handleOpenChange,
        open: open,
        className: className,
        width: 400,
        Content: this.renderPopoverContent,
        children: /*#__PURE__*/_jsx(Child, {
          className: buttonClassName,
          contentType: contentType,
          showButtonIcon: showButtonIcon,
          togglePopover: this.handleClick
        })
      });
    }
  });
});