'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Map as ImmutableMap } from 'immutable';
import { useDispatch } from 'react-redux';
import { NavMarker } from 'react-rhumb';
import UIButton from 'UIComponents/button/UIButton';
import UIFixedSaveBar from 'UIComponents/panel/UIFixedSaveBar';
import FormattedMessage from 'I18n/components/FormattedMessage';
import EditorSettings from '../edit/EditorSettings';
import { updateSettings, initializeSequenceEditor, saveSequence, clearSequence } from 'SequencesUI/actions/SequenceEditorActions';

var SequenceSummarySettingsPage = function SequenceSummarySettingsPage(_ref) {
  var sequenceEditor = _ref.sequenceEditor,
      sequence = _ref.sequence,
      children = _ref.children;
  var dispatch = useDispatch();
  useEffect(function () {
    dispatch(initializeSequenceEditor(sequence.get('id')));
    return function () {
      return dispatch(clearSequence());
    };
  }, [dispatch, sequence]);

  function handleUpdateSettings(e) {
    dispatch(updateSettings(e));
  }

  function handleSaveSettings() {
    dispatch(saveSequence(sequenceEditor.get('sequence')));
  }

  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(NavMarker, {
      name: "SUMMARY_SETTINGS_LOAD"
    }), sequenceEditor.get('sequence') && /*#__PURE__*/_jsx(EditorSettings, {
      sequenceSettings: sequenceEditor.get('sequence').get('sequenceSettings'),
      updateSettings: handleUpdateSettings
    }), !sequenceEditor.get('saved') && /*#__PURE__*/_jsx(UIFixedSaveBar, {
      children: /*#__PURE__*/_jsx(UIButton, {
        onClick: handleSaveSettings,
        use: "primary",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.builder.header.copyPopover.footer.save"
        })
      })
    }), children]
  });
};

SequenceSummarySettingsPage.propTypes = {
  sequenceEditor: PropTypes.instanceOf(ImmutableMap).isRequired,
  sequence: PropTypes.instanceOf(ImmutableMap),
  children: PropTypes.node
};
export default connect(function (state) {
  return {
    sequenceEditor: state.sequenceEditor
  };
})(SequenceSummarySettingsPage);