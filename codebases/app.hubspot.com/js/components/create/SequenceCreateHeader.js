'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Map as ImmutableMap } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { connect } from 'react-redux';
import { getPortalIsAtLimit as getPortalIsAtSequencesLimit } from 'SequencesUI/selectors/usageSelectors';
import { canWriteTemplates } from 'SequencesUI/lib/permissions';
import { index } from 'SequencesUI/lib/links';
import getQueryParams from 'SalesContentIndexUI/data/utils/getQueryParams';
import CreateSequenceTooltip from 'SequencesUI/components/create/CreateSequenceTooltip';
import { SEND_TEMPLATE } from 'SequencesUI/constants/SequenceStepTypes';
import UIAutosizedTextInput from 'UIComponents/input/UIAutosizedTextInput';
import UIBackButton from 'UIComponents/nav/UIBackButton';
import UIButton from 'UIComponents/button/UIButton';
import UILink from 'UIComponents/link/UILink';
import UIToolBar from 'UIComponents/nav/UIToolBar';
import UIToolBarGroup from 'UIComponents/nav/UIToolBarGroup';
import H1 from 'UIComponents/elements/headings/H1';
var SequenceCreateHeader = createReactClass({
  displayName: "SequenceCreateHeader",
  propTypes: {
    header: PropTypes.string.isRequired,
    onCreate: PropTypes.func.isRequired,
    selectedOption: PropTypes.number.isRequired,
    sequence: PropTypes.instanceOf(ImmutableMap),
    templatesUsage: PropTypes.shape({
      currentUsage: PropTypes.number,
      limit: PropTypes.number,
      userLimit: PropTypes.number,
      error: PropTypes.bool
    }),
    portalIsAtSequencesLimit: PropTypes.bool.isRequired
  },
  contextTypes: {
    router: PropTypes.object.isRequired
  },
  handleCancel: function handleCancel() {
    this.context.router.push({
      pathname: index(),
      query: getQueryParams()
    });
  },
  involvesCreatingTemplates: function involvesCreatingTemplates() {
    return this.props.selectedOption !== 0;
  },
  sequenceTemplateCount: function sequenceTemplateCount() {
    var sequence = this.props.sequence;

    if (!sequence) {
      return 0;
    }

    return sequence.get('steps').filter(function (step) {
      return step.action === SEND_TEMPLATE;
    }).size;
  },
  isWithinPortalLimit: function isWithinPortalLimit() {
    var templatesUsage = this.props.templatesUsage;

    if (!templatesUsage) {
      return true;
    }

    return templatesUsage.currentUsage + this.sequenceTemplateCount() <= templatesUsage.limit;
  },
  isWithinUserLimit: function isWithinUserLimit() {
    var templatesUsage = this.props.templatesUsage;

    if (!templatesUsage) {
      return true;
    }

    return templatesUsage.currentUsage + this.sequenceTemplateCount() <= templatesUsage.userLimit;
  },
  getCreateDisabled: function getCreateDisabled() {
    var portalIsAtSequencesLimit = this.props.portalIsAtSequencesLimit;
    var canCreateTemplatesForSequence = canWriteTemplates() && this.isWithinPortalLimit() && this.isWithinUserLimit();
    return portalIsAtSequencesLimit || this.involvesCreatingTemplates() && !canCreateTemplatesForSequence;
  },
  render: function render() {
    var _this$props = this.props,
        header = _this$props.header,
        onCreate = _this$props.onCreate;
    return /*#__PURE__*/_jsxs(UIToolBar, {
      use: "dark",
      children: [/*#__PURE__*/_jsx(UIToolBarGroup, {
        children: /*#__PURE__*/_jsx(UIBackButton, {
          children: /*#__PURE__*/_jsx(UILink, {
            onClick: this.handleCancel,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "create.header.back"
            })
          })
        })
      }), /*#__PURE__*/_jsx(UIToolBarGroup, {
        children: /*#__PURE__*/_jsx(H1, {
          children: /*#__PURE__*/_jsx(UIAutosizedTextInput, {
            readOnly: true,
            value: header,
            use: "on-dark"
          })
        })
      }), /*#__PURE__*/_jsx(UIToolBarGroup, {
        children: /*#__PURE__*/_jsx(CreateSequenceTooltip, {
          involvesCreatingTemplates: this.involvesCreatingTemplates(),
          placement: "bottom left",
          portalIsAtTemplatesLimit: !this.isWithinPortalLimit(),
          userIsAtTemplatesLimit: !this.isWithinUserLimit(),
          subscreen: "sequence-create",
          children: /*#__PURE__*/_jsx(UIButton, {
            "data-selenium-test": "create-sequence-button",
            onClick: onCreate,
            use: "primary",
            disabled: this.getCreateDisabled(),
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "create.header.createSequence"
            })
          })
        })
      })]
    });
  }
});
export default connect(function (state) {
  return {
    templatesUsage: state.templatesUsage,
    portalIsAtSequencesLimit: getPortalIsAtSequencesLimit(state)
  };
})(SequenceCreateHeader);