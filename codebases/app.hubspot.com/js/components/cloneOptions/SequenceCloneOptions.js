'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment } from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map as ImmutableMap, Record } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { canWriteTemplates } from 'SequencesUI/lib/permissions';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UISelect from 'UIComponents/input/UISelect';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
import { loadFolderOptions } from 'SalesContentIndexUI/utils/folderOptions';
import { fetchSequence as fetchSequenceAction } from 'SequencesUI/actions/SequenceActions';
import { fetchTemplateUsage as fetchTemplateUsageAction } from 'SequencesUI/actions/TemplateActions';
import UIToggleGroup from 'UIComponents/input/UIToggleGroup';
import { TEMPLATES_FOLDER } from 'SalesContentIndexUI/data/constants/FolderContentTypes';
import { getTemplateIdsFromSequence } from 'SequencesUI/util/templateUtils';
import { getCreateTemplateTooltip } from 'SequencesUI/util/creationTooltips';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import Small from 'UIComponents/elements/Small';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { trackViewTemplatesPermissionTooltip } from '../../util/UsageTracker';
var SequenceCloneOptions = createReactClass({
  displayName: "SequenceCloneOptions",
  propTypes: {
    cloneOptions: PropTypes.object.isRequired,
    fetchSequence: PropTypes.func.isRequired,
    fetchTemplateUsage: PropTypes.func.isRequired,
    searchResult: PropTypes.oneOfType([PropTypes.instanceOf(ImmutableMap), PropTypes.instanceOf(Record)]).isRequired,
    sequence: PropTypes.instanceOf(ImmutableMap),
    templatesUsage: PropTypes.object,
    updateCloneOptions: PropTypes.func.isRequired
  },
  componentDidMount: function componentDidMount() {
    var _this$props = this.props,
        fetchSequence = _this$props.fetchSequence,
        fetchTemplateUsage = _this$props.fetchTemplateUsage,
        sequence = _this$props.sequence;
    fetchTemplateUsage();

    if (!sequence) {
      fetchSequence(this.props.searchResult.contentId);
    }

    this.setDefaultOptions();
  },
  componentDidUpdate: function componentDidUpdate() {
    this.setDefaultOptions();
  },
  setDefaultOptions: function setDefaultOptions() {
    var updateCloneOptions = this.props.updateCloneOptions;

    if (this.isLoaded() && !this.hasSetDefaultOptions) {
      updateCloneOptions({
        cloneTemplateToFolderId: null,
        shouldCloneTemplates: this.sequenceHasTemplates() && this.allowCloneTemplatesOption()
      });
      this.hasSetDefaultOptions = true;
    }
  },
  onChangeTemplateFolder: function onChangeTemplateFolder(_ref) {
    var value = _ref.target.value;
    return this.props.updateCloneOptions({
      cloneTemplateToFolderId: value
    });
  },
  toggleCloneTemplates: function toggleCloneTemplates(newValue) {
    return this.props.updateCloneOptions({
      cloneTemplateToFolderId: null,
      shouldCloneTemplates: newValue
    });
  },
  isLoaded: function isLoaded() {
    var _this$props2 = this.props,
        sequence = _this$props2.sequence,
        templatesUsage = _this$props2.templatesUsage;
    return Boolean(sequence) && Boolean(templatesUsage);
  },
  sequenceTemplateCount: function sequenceTemplateCount() {
    if (this.props.sequence) {
      return getTemplateIdsFromSequence(this.props.sequence).size;
    }

    return null;
  },
  sequenceHasTemplates: function sequenceHasTemplates() {
    return this.sequenceTemplateCount() > 0;
  },
  isWithinPortalLimit: function isWithinPortalLimit() {
    var _this$props$templates = this.props.templatesUsage,
        currentUsage = _this$props$templates.currentUsage,
        limit = _this$props$templates.limit;
    return currentUsage + this.sequenceTemplateCount() <= limit;
  },
  isWithinUserLimit: function isWithinUserLimit() {
    var _this$props$templates2 = this.props.templatesUsage,
        currentUsage = _this$props$templates2.currentUsage,
        userLimit = _this$props$templates2.userLimit;
    return currentUsage + this.sequenceTemplateCount() <= userLimit;
  },
  allowCloneTemplatesOption: function allowCloneTemplatesOption() {
    return canWriteTemplates() && this.isWithinUserLimit() && this.isWithinPortalLimit();
  },
  handlePermissionTooltipOpenChange: function handlePermissionTooltipOpenChange(_ref2) {
    var open = _ref2.target.value;
    if (open) trackViewTemplatesPermissionTooltip();
  },
  renderRadioArea: function renderRadioArea() {
    if (!this.isLoaded()) {
      return /*#__PURE__*/_jsx(UILoadingSpinner, {
        grow: true,
        minHeight: 60
      });
    } else if (this.sequenceHasTemplates()) {
      return this.renderRadioButtons();
    } else {
      return this.renderNoTemplatesMessage();
    }
  },
  renderTooltipIfDisabled: function renderTooltipIfDisabled(radioInput) {
    if (this.allowCloneTemplatesOption()) {
      return radioInput;
    } else {
      var templatesUsage = this.props.templatesUsage;
      var tooltipTitle = getCreateTemplateTooltip({
        templatesUsage: templatesUsage,
        portalIsAtTemplatesLimit: !this.isWithinPortalLimit(),
        userIsAtTemplatesLimit: !this.isWithinUserLimit()
      });
      var onOpenChange = canWriteTemplates() ? undefined : this.handlePermissionTooltipOpenChange;
      return /*#__PURE__*/_jsx(UITooltip, {
        title: tooltipTitle,
        disabled: !tooltipTitle,
        onOpenChange: onOpenChange,
        children: radioInput
      });
    }
  },
  renderRadioButtons: function renderRadioButtons() {
    var _this = this;

    var shouldCloneTemplates = this.props.cloneOptions.shouldCloneTemplates;
    return /*#__PURE__*/_jsxs(UIToggleGroup, {
      name: "shouldCloneTemplates",
      children: [this.renderTooltipIfDisabled( /*#__PURE__*/_jsx(UIRadioInput, {
        checked: Boolean(shouldCloneTemplates),
        "data-test-id": "clone-templates-radio",
        disabled: !this.allowCloneTemplatesOption(),
        onChange: function onChange() {
          return _this.toggleCloneTemplates(true);
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.cloneOptions.cloneTemplates." + (this.sequenceTemplateCount() ? 'withCount' : 'withoutCount'),
          options: {
            count: this.sequenceTemplateCount()
          }
        })
      })), /*#__PURE__*/_jsx(UIRadioInput, {
        checked: !shouldCloneTemplates,
        className: "m-top-2",
        "data-test-id": "use-existing-radio",
        onChange: function onChange() {
          return _this.toggleCloneTemplates(false);
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.cloneOptions.useExistingTemplates",
          options: {
            count: this.sequenceTemplateCount()
          }
        })
      })]
    });
  },
  renderNoTemplatesMessage: function renderNoTemplatesMessage() {
    return /*#__PURE__*/_jsx(Small, {
      "data-test-id": "no-templates-message",
      use: "help",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequencesui.cloneOptions.noTemplates"
      })
    });
  },
  render: function render() {
    var cloneOptions = this.props.cloneOptions;
    var cloneTemplateToFolderId = cloneOptions.cloneTemplateToFolderId,
        shouldCloneTemplates = cloneOptions.shouldCloneTemplates;
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(UIFormControl, {
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.cloneOptions.templateOptionsLabel"
        }),
        children: this.renderRadioArea()
      }), shouldCloneTemplates && /*#__PURE__*/_jsx(UIFormControl, {
        "data-test-id": "template-clone-folder-select",
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesui.cloneOptions.saveTemplatesToFolder.label",
          options: {
            count: this.sequenceTemplateCount()
          }
        }),
        children: /*#__PURE__*/_jsx(UISelect, {
          clearable: true,
          loadOptions: function loadOptions(searchString, callback) {
            return loadFolderOptions(TEMPLATES_FOLDER, searchString, callback);
          },
          onChange: this.onChangeTemplateFolder,
          placeholder: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequencesui.cloneOptions.saveTemplatesToFolder.placeholder"
          }),
          value: cloneTemplateToFolderId
        })
      })]
    });
  }
});
export default connect(function (state, ownProps) {
  return {
    sequence: state.sequences.sequencesById.get(ownProps.searchResult.contentId),
    templatesUsage: state.templatesUsage
  };
}, {
  fetchSequence: fetchSequenceAction,
  fetchTemplateUsage: fetchTemplateUsageAction
})(SequenceCloneOptions);