'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import * as links from 'SequencesUI/lib/links';
import getQueryParams from 'SalesContentIndexUI/data/utils/getQueryParams';
import { getCurrentUserView } from 'SequencesUI/util/convertToSearchResult';
import { getOwnerName } from 'SequencesUI/util/owner';
import { canWrite } from 'SequencesUI/lib/permissions';
import UIAutosizedTextInput from 'UIComponents/input/UIAutosizedTextInput';
import UIBackButton from 'UIComponents/nav/UIBackButton';
import UIFlex from 'UIComponents/layout/UIFlex';
import UILink from 'UIComponents/link/UILink';
import UIToolBar from 'UIComponents/nav/UIToolBar';
import UIToolBarGroup from 'UIComponents/nav/UIToolBarGroup';
import H1 from 'UIComponents/elements/headings/H1';
import SaveButtons from './SaveButtons';
import EditSequenceTooltip from 'SequencesUI/components/edit/EditSequenceTooltip';
var ENTER = 13;

var EditorHeader = function EditorHeader(_ref, _ref2) {
  var sequence = _ref.sequence,
      sequenceEditor = _ref.sequenceEditor,
      location = _ref.location,
      updateName = _ref.updateName,
      saveSequence = _ref.saveSequence,
      portalIsAtLimit = _ref.portalIsAtLimit;
  var router = _ref2.router;

  function handleCancel() {
    var sequenceId = sequence.get('id');
    router.push({
      pathname: sequenceId === 'new' ? links.index() : links.summary(sequenceId),
      query: getQueryParams()
    });
  }

  function handleEditName(_ref3) {
    var target = _ref3.target;
    updateName(target.value);
  }

  function handleEnterPress(event) {
    if (event.keyCode === ENTER) {
      document.activeElement.blur();
    }
  }

  var sequenceName = sequence.get('name') !== '' ? sequence.get('name') : /*#__PURE__*/_jsx(FormattedMessage, {
    message: "edit.new"
  });
  var userView = sequence.get('id') === 'new' ? getCurrentUserView() : sequence.get('userView');
  return /*#__PURE__*/_jsxs(UIToolBar, {
    use: "dark",
    children: [/*#__PURE__*/_jsx(UIToolBarGroup, {
      children: /*#__PURE__*/_jsx(UIBackButton, {
        children: /*#__PURE__*/_jsx(UILink, {
          onClick: handleCancel,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.buttons.back"
          })
        })
      })
    }), /*#__PURE__*/_jsx(UIToolBarGroup, {
      children: /*#__PURE__*/_jsx(H1, {
        children: /*#__PURE__*/_jsx(EditSequenceTooltip, {
          children: /*#__PURE__*/_jsx(UIAutosizedTextInput, {
            affordance: true,
            defaultValue: sequenceName,
            use: "on-dark",
            onChange: handleEditName,
            onKeyDown: handleEnterPress,
            readOnly: !canWrite()
          })
        })
      })
    }), /*#__PURE__*/_jsx(UIToolBarGroup, {
      children: /*#__PURE__*/_jsxs(UIFlex, {
        align: "center",
        justify: "end",
        children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
          className: "m-right-4",
          message: "edit.owner",
          options: {
            owner: getOwnerName(userView)
          }
        }), /*#__PURE__*/_jsx(SaveButtons, {
          sequence: sequence,
          sequenceEditor: sequenceEditor,
          location: location,
          saveSequence: saveSequence,
          portalIsAtLimit: portalIsAtLimit
        })]
      })
    })]
  });
};

EditorHeader.propTypes = {
  sequence: PropTypes.instanceOf(ImmutableMap).isRequired,
  sequenceEditor: PropTypes.instanceOf(ImmutableMap).isRequired,
  location: PropTypes.object.isRequired,
  updateName: PropTypes.func.isRequired,
  saveSequence: PropTypes.func.isRequired,
  portalIsAtLimit: PropTypes.bool
};
EditorHeader.contextTypes = {
  router: PropTypes.object.isRequired
};
export default EditorHeader;