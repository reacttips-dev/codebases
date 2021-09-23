'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { FOLDER_CONTENT_TYPES } from 'SalesContentIndexUI/data/constants/FolderContentTypes';
import { SalesContentAppContext } from 'SalesContentIndexUI/containers/SalesContentAppContainer';
var CloneHoverButton = createReactClass({
  displayName: "CloneHoverButton",
  propTypes: {
    CloneOptionsComponent: PropTypes.elementType,
    folderContentType: PropTypes.oneOf(FOLDER_CONTENT_TYPES),
    searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired,
    onClone: PropTypes.func.isRequired,
    loadFolderOptions: PropTypes.func,
    usage: PropTypes.shape({
      count: PropTypes.number,
      limit: PropTypes.number,
      userLimit: PropTypes.number
    })
  },
  getDefaultProps: function getDefaultProps() {
    return {
      showSharing: false
    };
  },
  openModal: function openModal() {
    var _this$context = this.context,
        openCloneModal = _this$context.openCloneModal,
        closeCloneModal = _this$context.closeCloneModal;
    var _this$props = this.props,
        CloneOptionsComponent = _this$props.CloneOptionsComponent,
        folderContentType = _this$props.folderContentType,
        loadFolderOptions = _this$props.loadFolderOptions,
        onClone = _this$props.onClone,
        searchResult = _this$props.searchResult;
    openCloneModal({
      CloneOptionsComponent: CloneOptionsComponent,
      folderContentType: folderContentType,
      loadFolderOptions: loadFolderOptions,
      searchResult: searchResult,
      onConfirm: function onConfirm(cloneOptions) {
        closeCloneModal();
        onClone(cloneOptions);
      },
      onReject: closeCloneModal
    });
  },
  renderCloneButton: function renderCloneButton(disabled) {
    return /*#__PURE__*/_jsx(UIButton, {
      "data-selenium-test": "clone-hover-button",
      onClick: this.openModal,
      disabled: disabled,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.tableRowHoverButtons.duplicate"
      })
    });
  },
  render: function render() {
    var _this$props2 = this.props,
        searchResult = _this$props2.searchResult,
        usage = _this$props2.usage;

    if (!usage) {
      return this.renderCloneButton();
    }

    var count = usage.count,
        limit = usage.limit,
        userLimit = usage.userLimit;
    var portalIsAtLimit = count >= limit;
    var freeUserIsAtLimit = count >= userLimit;

    if (!freeUserIsAtLimit) {
      return this.renderCloneButton();
    }

    var tooltipKey = portalIsAtLimit ? 'duplicateDisabledTooltip' : 'freeUserDisabledTooltip';
    return /*#__PURE__*/_jsx(UITooltip, {
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.tableRowHoverButtons." + tooltipKey + "." + searchResult.contentType,
        options: {
          count: count,
          limit: limit,
          userLimit: userLimit
        }
      }),
      children: this.renderCloneButton(true)
    });
  }
});
CloneHoverButton.contextType = SalesContentAppContext;
export default CloneHoverButton;