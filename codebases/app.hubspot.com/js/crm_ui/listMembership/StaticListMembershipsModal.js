'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { connect } from 'general-store';
import HasStaticListsStore from 'crm_data/lists/HasStaticListsStore';
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import SubjectDependency from '../flux/dependencies/SubjectDependency';
import StaticListMemberships from './StaticListMemberships';
import RestrictedContentsByListIdStore from 'crm_data/content/RestrictedContentsByListIdStore';
import BaseDialog from 'customer-data-ui-utilities/dialog/BaseDialog';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import I18n from 'I18n';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { bulkAddToList, bulkAddAllToList } from 'crm_data/lists/ListsAPI';
import { addToList } from '../flux/lists/ListsActions';
import UIFormControl from 'UIComponents/form/UIFormControl';
import MakeConnectedAPIDropdownProvider from 'customer-data-reference-ui-components/connector/MakeConnectedAPIDropdownProvider';
import { CONTACT_STATIC_LIST } from 'reference-resolvers/constants/ReferenceObjectTypes';
import ContactStaticListReferenceResolver from 'reference-resolvers/resolvers/ContactStaticListReferenceResolver';
import SegmentRestrictedContentWarning from '../segments/components/SegmentRestrictedContentWarning';
import { ListsLogger } from 'customer-data-tracking/loggers';
var StaticListsSelect = MakeConnectedAPIDropdownProvider({
  referenceObjectType: CONTACT_STATIC_LIST,
  referenceResolver: ContactStaticListReferenceResolver
});
var BulkAddToListProps = {
  // bulk modal props. all required if rendering for bulk add
  isBulkAdd: PropTypes.bool,
  objectCount: PropTypes.number,
  allContactsSelected: PropTypes.bool,
  selectedVids: PropTypes.arrayOf(PropTypes.number),
  fromListId: PropTypes.number
};
var dependencies = {
  contact: SubjectDependency,
  portalHasStaticLists: {
    stores: [HasStaticListsStore],
    deref: function deref() {
      var staticListsCheckStore = HasStaticListsStore.get();

      if (!staticListsCheckStore) {
        return null;
      }

      return staticListsCheckStore.get('hasStaticLists');
    }
  },
  restrictedContentObjects: {
    stores: [RestrictedContentsByListIdStore],
    deref: function deref(_ref) {
      var selectedListId = _ref.selectedListId;

      if (!selectedListId) {
        return 0;
      }

      var contents = RestrictedContentsByListIdStore.get(selectedListId);

      if (!contents) {
        return 0;
      }

      return contents.size;
    }
  }
};
var StaticListMembershipsModal = createReactClass({
  displayName: 'StaticListMembershipsModal',
  propTypes: Object.assign({}, BulkAddToListProps, {
    objectType: PropTypes.oneOf([CONTACT]).isRequired,
    subjectId: PropTypes.string,
    contactName: PropTypes.string,
    portalHasStaticLists: PropTypes.bool,
    contact: PropTypes.object,
    onClose: PropTypes.func,
    onReject: PropTypes.func,
    onConfirm: PropTypes.func,
    onSelectedListChange: PropTypes.func.isRequired,
    restrictedContentObjects: PropTypes.number
  }),
  getDefaultProps: function getDefaultProps() {
    return {
      isBulkAdd: false
    };
  },
  handleSelectedListChange: function handleSelectedListChange(_ref2) {
    var value = _ref2.target.value;
    this.props.onSelectedListChange(value);
  },
  onClose: function onClose() {
    if (this.props.onReject) {
      this.props.onReject();
    }

    if (this.props.onClose) {
      this.props.onClose();
    }

    this.props.onSelectedListChange(null);
  },
  handleAddToList: function handleAddToList() {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }

    if (this.props.isBulkAdd) {
      this._handleBulkAddToList();
    } else {
      this._handleSingleAddToList();
    }

    if (this.props.restrictedContentObjects) {
      ListsLogger.log('addContactsToRestrictedList', {
        action: 'add contacts to content restricted list',
        count: this.props.isBulkAdd ? this.props.objectCount : 1
      });
    }
  },
  _handleSingleAddToList: function _handleSingleAddToList() {
    CrmLogger.log('recordUsage', {
      action: 'added to list in side card'
    }); // to delete

    CrmLogger.logRecordInteraction(this.props.objectType, {
      action: 'clicked add to list'
    });
    addToList(this.props.contact, parseInt(this.props.selectedListId, 10), this.props.restrictedContentObjects);
    this.onClose();
  },
  _handleBulkAddToList: function _handleBulkAddToList() {
    var _this$props = this.props,
        allContactsSelected = _this$props.allContactsSelected,
        selectedVids = _this$props.selectedVids,
        fromListId = _this$props.fromListId,
        selectedListId = _this$props.selectedListId;

    if (allContactsSelected && fromListId !== undefined) {
      bulkAddAllToList(selectedListId, fromListId);
    } else {
      bulkAddToList({
        vids: selectedVids,
        listId: selectedListId
      });
    }
  },
  renderTitle: function renderTitle() {
    var _this$props2 = this.props,
        isBulkAdd = _this$props2.isBulkAdd,
        contactName = _this$props2.contactName,
        objectCount = _this$props2.objectCount;
    var message = 'listMembershipPage.addList';
    var options = {
      name: contactName
    };

    if (isBulkAdd) {
      message = 'bulkAddToListModal.title';
      options = {
        count: objectCount
      };
    }

    return /*#__PURE__*/_jsx("h1", {
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: message,
        options: options
      })
    });
  },
  renderRestrictedContentMessage: function renderRestrictedContentMessage() {
    var _this$props3 = this.props,
        restrictedContentObjects = _this$props3.restrictedContentObjects,
        isBulkAdd = _this$props3.isBulkAdd,
        selectedVids = _this$props3.selectedVids;
    var contactCount = 1;

    if (isBulkAdd) {
      contactCount = selectedVids.length;
    }

    if (!this.props.selectedListId) {
      return null;
    }

    return /*#__PURE__*/_jsx(SegmentRestrictedContentWarning, {
      restrictedObjectCount: restrictedContentObjects,
      contactCount: contactCount,
      listId: this.props.selectedListId
    });
  },
  renderSelect: function renderSelect() {
    if (this.props.isBulkAdd) {
      return /*#__PURE__*/_jsx(UIFormControl, {
        label: I18n.text('bulkAddToListModal.message', {
          count: this.props.objectCount
        }),
        children: /*#__PURE__*/_jsx(StaticListsSelect, {
          value: this.props.selectedListId,
          onChange: this.handleSelectedListChange
        })
      });
    } else {
      return /*#__PURE__*/_jsx(StaticListMemberships, {
        onSelectList: this.handleSelectedListChange,
        portalHasStaticLists: this.props.portalHasStaticLists,
        subjectId: this.props.subjectId,
        contactName: this.props.contactName
      });
    }
  },
  render: function render() {
    return /*#__PURE__*/_jsxs(BaseDialog, {
      title: this.renderTitle(),
      confirmLabel: I18n.text('listMembershipPage.add'),
      onReject: this.onClose,
      onConfirm: this.handleAddToList,
      confirmDisabled: !this.props.selectedListId || this.props.selectedListId && isNaN(this.props.restrictedContentObjects),
      children: [this.renderSelect(), this.renderRestrictedContentMessage()]
    });
  }
});
export default connect(dependencies)(StaticListMembershipsModal);