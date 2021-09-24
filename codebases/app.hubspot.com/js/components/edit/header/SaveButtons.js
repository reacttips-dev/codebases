'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { tracker, getSequenceCreateOrEditEventProperties } from 'SequencesUI/util/UsageTracker';
import { markActionComplete } from 'user-context/onboarding';
import * as links from 'SequencesUI/lib/links';
import { isFromLibrary } from 'SequencesUI/util/locationUtils';
import getQueryParams from 'SalesContentIndexUI/data/utils/getQueryParams';
import { disableCopySequence, disableUpdateSequence, getSaveSequenceTooltipProps } from 'SequencesUI/util/saveSequenceUtils';
import { isOwnedByCurrentUser } from 'SequencesUI/util/owner';
import UserContainer from 'SequencesUI/data/UserContainer';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import EditWarningModal from './EditWarningModal';
import CopyPopover from './CopyPopover';
import EditNameModal from './EditNameModal';
import CreateSequenceTooltip from 'SequencesUI/components/create/CreateSequenceTooltip';

var SaveButtons = function SaveButtons(_ref, _ref2) {
  var sequence = _ref.sequence,
      sequenceEditor = _ref.sequenceEditor,
      location = _ref.location,
      saveSequence = _ref.saveSequence,
      portalIsAtLimit = _ref.portalIsAtLimit;
  var router = _ref2.router;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showCopyPopover = _useState2[0],
      setShowCopyPopover = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      showEditWarningModal = _useState4[0],
      setShowEditWarningModal = _useState4[1];

  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      showEditNameModal = _useState6[0],
      setShowEditNameModal = _useState6[1];

  var _useState7 = useState(false),
      _useState8 = _slicedToArray(_useState7, 2),
      isSequenceSaving = _useState8[0],
      setIsSequenceSaving = _useState8[1];

  var isOwner = isOwnedByCurrentUser(sequence);

  function handleSave(sequenceToSave) {
    setShowEditWarningModal(false);
    setIsSequenceSaving(true);
    var sequenceIsNew = sequenceToSave.get('id') === 'new';

    if (!sequenceIsNew) {
      tracker.track('createOrEditSequence', Object.assign({
        action: 'Updated a sequence',
        isOwner: sequenceToSave.get('userId') === UserContainer.get().user_id
      }, getSequenceCreateOrEditEventProperties(sequenceToSave)));
    } // this sets the 'Activate email sequence' onboarding step as complete. Chat to #growth-onboarding with questions


    markActionComplete('activate-email-sequence');
    var query = getQueryParams();
    delete query.library;
    saveSequence(sequenceToSave).then(function (savedSequence) {
      var sequenceId = savedSequence.get('id');

      if (sequenceIsNew) {
        tracker.track('createOrEditSequence', Object.assign({
          action: 'Created a sequence',
          type: 'scratch'
        }, getSequenceCreateOrEditEventProperties(savedSequence)));
      }

      router.push({
        pathname: links.summary(sequenceId),
        query: query
      });
    }).finally(function () {
      setIsSequenceSaving(false);
    });
  }

  function saveCurrentSequence() {
    handleSave(sequence);
  }

  function handleSaveNewSequence() {
    if (sequenceEditor.get('nameEdited')) {
      saveCurrentSequence();
    } else {
      setShowEditNameModal(true);
    }
  }

  function handleUpdateExistingSequence() {
    if (isOwner) {
      saveCurrentSequence();
    } else {
      setShowEditWarningModal(true);
    }
  }

  function handleConfirmEditedName(name) {
    setShowEditNameModal(false);
    var updatedSequence = sequence.set('name', name).set('id', 'new');
    handleSave(updatedSequence);
  }

  function handleCopyPopoverConfirm(_ref3) {
    var name = _ref3.name,
        folderId = _ref3.folderId;
    setShowCopyPopover(false);
    var updatedSequence = sequence.set('name', name).set('folderId', folderId).set('id', 'new');
    handleSave(updatedSequence);
  }

  function renderSaveButton() {
    var disableUpdate = disableUpdateSequence({
      saved: sequenceEditor.get('saved'),
      sequence: sequence,
      isFromLibrary: isFromLibrary(location)
    });

    var SequenceValidationTooltip = function SequenceValidationTooltip(_ref4) {
      var children = _ref4.children,
          props = _objectWithoutProperties(_ref4, ["children"]);

      var _getSaveSequenceToolt = getSaveSequenceTooltipProps(sequence),
          title = _getSaveSequenceToolt.title,
          disabled = _getSaveSequenceToolt.disabled;

      return /*#__PURE__*/_jsx(UITooltip, Object.assign({}, props, {
        title: title,
        disabled: disabled,
        children: children
      }));
    };

    SequenceValidationTooltip.displayName = 'SequenceValidationTooltip';
    var CreateOrValidationTooltip = portalIsAtLimit ? CreateSequenceTooltip : SequenceValidationTooltip;

    if (sequence.get('id') === 'new') {
      return /*#__PURE__*/_jsx(CreateOrValidationTooltip, {
        placement: "bottom left",
        children: /*#__PURE__*/_jsx(UIButton, {
          "data-selenium-test": "save-sequence-button",
          disabled: disableUpdate || portalIsAtLimit || isSequenceSaving,
          onClick: handleSaveNewSequence,
          use: "primary",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.buttons.save"
          })
        })
      });
    }

    if (isFromLibrary(location)) {
      // Editing a pre-made sequence immediately after creating it from library view
      return /*#__PURE__*/_jsx(SequenceValidationTooltip, {
        placement: "bottom left",
        children: /*#__PURE__*/_jsx(UIButton, {
          "data-selenium-test": "save-sequence-button-from-library",
          disabled: disableUpdate || isSequenceSaving,
          onClick: saveCurrentSequence,
          use: "primary",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.buttons.save"
          })
        })
      });
    }

    var UpdateButton = function UpdateButton(_ref5) {
      var use = _ref5.use;
      return /*#__PURE__*/_jsx(SequenceValidationTooltip, {
        placement: isOwner ? 'bottom left' : 'bottom',
        children: /*#__PURE__*/_jsx(UIButton, {
          onClick: handleUpdateExistingSequence,
          disabled: disableUpdate || isSequenceSaving,
          use: use,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequences.builder.header.saveButtons.updateExisting"
          })
        })
      });
    };

    UpdateButton.displayName = 'UpdateButton';

    var CopyButton = function CopyButton(_ref6) {
      var use = _ref6.use;

      var CopyPopoverWithProps = function CopyPopoverWithProps(_ref7) {
        var children = _ref7.children,
            props = _objectWithoutProperties(_ref7, ["children"]);

        return /*#__PURE__*/_jsx(CopyPopover, Object.assign({
          onConfirm: handleCopyPopoverConfirm,
          onReject: function onReject() {
            setShowCopyPopover(false);
          },
          open: showCopyPopover,
          setPopoverOpen: setShowCopyPopover,
          sequence: sequence,
          sequenceEditor: sequenceEditor
        }, props, {
          children: children
        }));
      };

      var PopoverOrTooltip = showCopyPopover ? CopyPopoverWithProps : CreateOrValidationTooltip;
      var placement = isOwner ? 'bottom' : 'bottom left';
      var disableCopy = disableCopySequence({
        sequence: sequence
      });
      return /*#__PURE__*/_jsx(PopoverOrTooltip, {
        placement: placement,
        children: /*#__PURE__*/_jsx(UIButton, {
          disabled: disableCopy || portalIsAtLimit || isSequenceSaving,
          onClick: function onClick() {
            setShowCopyPopover(!showCopyPopover);
          },
          use: use,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequences.builder.header.saveButtons.copy"
          })
        })
      });
    };

    CopyButton.displayName = 'CopyButton';
    var PrimaryButton = isOwner ? UpdateButton : CopyButton;
    var SecondaryButton = isOwner ? CopyButton : UpdateButton;
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(SecondaryButton, {
        use: "secondary-ghost"
      }), /*#__PURE__*/_jsx(PrimaryButton, {
        use: "primary"
      })]
    });
  }

  return /*#__PURE__*/_jsxs(Fragment, {
    children: [renderSaveButton(), showEditWarningModal && /*#__PURE__*/_jsx(EditWarningModal, {
      sequence: sequence,
      onConfirm: saveCurrentSequence,
      onReject: function onReject() {
        return setShowEditWarningModal(false);
      }
    }), showEditNameModal && /*#__PURE__*/_jsx(EditNameModal, {
      sequence: sequence,
      onConfirm: handleConfirmEditedName,
      onReject: function onReject() {
        setShowEditNameModal(false);
        setIsSequenceSaving(false);
      }
    })]
  });
};

SaveButtons.propTypes = {
  sequence: PropTypes.instanceOf(ImmutableMap).isRequired,
  sequenceEditor: PropTypes.instanceOf(ImmutableMap).isRequired,
  location: PropTypes.object.isRequired,
  saveSequence: PropTypes.func.isRequired,
  portalIsAtLimit: PropTypes.bool
};
SaveButtons.contextTypes = {
  router: PropTypes.object.isRequired
};
export default SaveButtons;