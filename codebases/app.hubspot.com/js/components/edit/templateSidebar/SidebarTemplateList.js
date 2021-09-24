'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { List, fromJS } from 'immutable';
import I18n from 'I18n';
import partial from 'transmute/partial';
import FormattedMessage from 'I18n/components/FormattedMessage';
import * as SequenceStepTypes from 'SequencesUI/constants/SequenceStepTypes';
import { DAY } from 'SequencesUI/constants/Milliseconds';
import * as EditorFolderTypes from 'SequencesUI/constants/EditorFolderTypes';
import SearchStatus from 'SalesContentIndexUI/data/constants/SearchStatus';
import { connect } from 'react-redux';
import { getTeamId } from 'SequencesUI/util/userContainerUtils';
import * as TemplateActions from 'SequencesUI/actions/TemplateActions';
import virtualizedMenuRenderer from 'UIComponents/input/utils/virtualizedMenuRenderer';
import buildTemplateSearchQuery from 'SequencesUI/util/buildTemplateSearchQuery';
import { isRealFolder, viewingAllTemplates } from 'SequencesUI/util/sidebarTemplateListUtils';
import H5 from 'UIComponents/elements/headings/H5';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UIFlex from 'UIComponents/layout/UIFlex';
import UISelect from 'UIComponents/input/UISelect';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIPanelSection from 'UIComponents/panel/UIPanelSection';
import UISearchInput from 'UIComponents/input/UISearchInput';
import UITable from 'UIComponents/table/UITable';
import Small from 'UIComponents/elements/Small';
import SidebarTemplateListRow from './SidebarTemplateListRow';
import TemplateListZero from './TemplateListZero';
import SidebarTemplateListCreateTemplateButton from './SidebarTemplateListCreateTemplateButton';
import TemplatesAlert from './TemplatesAlert';
var SidebarTemplateList = createReactClass({
  displayName: "SidebarTemplateList",
  propTypes: {
    templateSearch: PropTypes.object.isRequired,
    templateFolders: PropTypes.instanceOf(List).isRequired,
    selectTemplate: PropTypes.func.isRequired,
    numAutoEmailSteps: PropTypes.number,
    // required when adding auto email
    search: PropTypes.func.isRequired,
    updateQueryAndSearch: PropTypes.func.isRequired,
    isTemplateReplacementFlow: PropTypes.bool
  },
  componentDidMount: function componentDidMount() {
    this.props.search({
      query: this.props.templateSearch.query
    });

    if (this._contentList) {
      this._contentList.addEventListener('scroll', this.fetchMoreTemplates);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this._contentList) {
      this._contentList.removeEventListener('scroll', this.fetchMoreTemplates);
    }

    clearTimeout(this.nextStepTimeout);
  },
  fetchMoreTemplates: function fetchMoreTemplates() {
    var _this$_contentList = this._contentList,
        scrollTop = _this$_contentList.scrollTop,
        scrollHeight = _this$_contentList.scrollHeight,
        clientHeight = _this$_contentList.clientHeight;
    var isCloseToBottom = scrollTop + clientHeight + 50 >= scrollHeight;

    if (this.hasMore() && isCloseToBottom) {
      var _this$props$templateS = this.props.templateSearch,
          query = _this$props$templateS.query,
          result = _this$props$templateS.result;
      var offset = result.get('offset');
      this.props.updateQueryAndSearch({
        query: buildTemplateSearchQuery(query, {
          offset: offset
        }),
        addResults: true
      });
    }
  },
  hasMore: function hasMore() {
    var _this$props$templateS2 = this.props.templateSearch,
        result = _this$props$templateS2.result,
        query = _this$props$templateS2.query,
        requestStatus = _this$props$templateS2.requestStatus;

    if (requestStatus === SearchStatus.FAILED) {
      return false;
    }

    var limit = query.limit;
    var total = result.get('total');
    var offset = result.get('offset');
    return total !== null && offset + limit < total;
  },
  handleFolderSelect: function handleFolderSelect(e) {
    var query = this.props.templateSearch.query;
    this.props.updateQueryAndSearch({
      query: buildTemplateSearchQuery(query, {
        currentFolder: e.target.value,
        offset: 0
      })
    });
  },
  handleSearch: function handleSearch(e) {
    var query = this.props.templateSearch.query;
    this.props.updateQueryAndSearch({
      query: buildTemplateSearchQuery(query, {
        searchTerm: e.target.value,
        offset: 0
      })
    });
  },
  selectTemplate: function selectTemplate(_ref) {
    var template = _ref.template,
        templateId = _ref.templateId,
        isCustomTemplate = _ref.isCustomTemplate;
    var payload = fromJS({
      delay: DAY,
      action: SequenceStepTypes.SEND_TEMPLATE,
      actionMeta: {
        templateMeta: {
          id: templateId
        },
        taskMeta: null
      }
    });
    this.props.selectTemplate({
      template: template,
      templateId: templateId,
      isCustomTemplate: isCustomTemplate,
      payload: payload
    });
  },
  getCurrentFolderId: function getCurrentFolderId() {
    var query = this.props.templateSearch.query;
    var folderFilter = query.filters.find(function (filter) {
      return filter.field === 'folder_id';
    });
    var userFilter = query.filters.find(function (filter) {
      return filter.field === 'user_id';
    });
    var teamFilter = query.filters.find(function (filter) {
      return filter.field === 'team_id';
    });

    if (folderFilter) {
      var folderValue = folderFilter.values.first();
      return folderValue || 0;
    }

    if (userFilter) {
      return EditorFolderTypes.CREATED_BY_ME.value;
    }

    if (teamFilter) {
      return EditorFolderTypes.CREATED_BY_MY_TEAM.value;
    }

    return EditorFolderTypes.ALL_TEMPLATES.value;
  },
  renderFolderSelector: function renderFolderSelector() {
    var templateFolders = this.props.templateFolders;
    var currentFolder = this.getCurrentFolderId();
    var teamOption = {
      text: EditorFolderTypes.CREATED_BY_MY_TEAM.text(),
      value: EditorFolderTypes.CREATED_BY_MY_TEAM.value
    };
    var initialOptions = [{
      text: EditorFolderTypes.ALL_TEMPLATES.text(),
      value: EditorFolderTypes.ALL_TEMPLATES.value
    }, {
      text: EditorFolderTypes.CREATED_BY_ME.text(),
      value: EditorFolderTypes.CREATED_BY_ME.value
    }];

    if (getTeamId()) {
      initialOptions.push(teamOption);
    }

    var options = templateFolders.reduce(function (aggregate, folder) {
      var name = folder.get('name');

      if (name === '') {
        name = EditorFolderTypes.OTHER_TEMPLATES.value;
      }

      return aggregate.concat([{
        text: name,
        value: "" + folder.get('id')
      }]);
    }, initialOptions);
    return /*#__PURE__*/_jsx(UIFormControl, {
      "aria-label": "Select template folder",
      children: /*#__PURE__*/_jsx(UISelect, {
        onChange: this.handleFolderSelect,
        options: options,
        value: "" + currentFolder,
        menuRenderer: virtualizedMenuRenderer
      })
    });
  },
  renderSearch: function renderSearch() {
    var query = this.props.templateSearch.query;
    return /*#__PURE__*/_jsx(UIFormControl, {
      className: "m-bottom-8",
      "aria-label": I18n.text('edit.sidebarTemplateList.searchPlaceholder'),
      children: /*#__PURE__*/_jsx(UISearchInput, {
        placeholder: I18n.text('edit.sidebarTemplateList.searchPlaceholder'),
        value: query.query,
        onChange: this.handleSearch
      })
    });
  },
  renderLoadingMore: function renderLoadingMore() {
    if (!this.hasMore()) {
      return null;
    }

    return /*#__PURE__*/_jsx("tr", {
      children: /*#__PURE__*/_jsx("td", {
        children: /*#__PURE__*/_jsx(UILoadingSpinner, {
          grow: true
        })
      })
    });
  },
  renderTemplateList: function renderTemplateList() {
    var _this = this;

    var templateSearch = this.props.templateSearch;

    if (templateSearch.requestStatus === SearchStatus.FAILED) {
      return /*#__PURE__*/_jsx("div", {
        className: "text-center p-x-6 p-y-5",
        children: /*#__PURE__*/_jsx(Small, {
          className: "m-bottom-0",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.sidebarTemplateList.templateFetchError"
          })
        })
      });
    }

    if (templateSearch.result.get('total') === 0) {
      var folderId = this.getCurrentFolderId();
      var searchTerm = templateSearch.query.query;
      return /*#__PURE__*/_jsx(TemplateListZero, {
        searchTerm: searchTerm,
        folderEmpty: isRealFolder(folderId),
        noTemplates: viewingAllTemplates({
          folderId: folderId,
          searchTerm: searchTerm
        })
      });
    }

    return /*#__PURE__*/_jsx(UITable, {
      bordered: true,
      children: /*#__PURE__*/_jsxs("tbody", {
        children: [templateSearch.result.get('results').map(function (template, index) {
          return /*#__PURE__*/_jsx(SidebarTemplateListRow, {
            index: index,
            template: template,
            selectRow: partial(_this.selectTemplate, {
              template: template,
              templateId: template.get('contentId')
            })
          }, template.get('contentId'));
        }), this.renderLoadingMore()]
      })
    });
  },
  renderContentList: function renderContentList() {
    var templateSearch = this.props.templateSearch;

    if (templateSearch.requestStatus === SearchStatus.LOADING) {
      return /*#__PURE__*/_jsx(UITable, {
        bordered: true,
        children: /*#__PURE__*/_jsx("tbody", {
          children: /*#__PURE__*/_jsx("tr", {
            children: /*#__PURE__*/_jsx("td", {
              children: /*#__PURE__*/_jsx(UILoadingSpinner, {
                grow: true
              })
            })
          })
        })
      });
    }

    return this.renderTemplateList();
  },
  render: function render() {
    var _this2 = this;

    if (!this.props.isTemplateReplacementFlow && this.props.numAutoEmailSteps >= 5) {
      return /*#__PURE__*/_jsx(UIPanelSection, {
        children: /*#__PURE__*/_jsx(TemplatesAlert, {})
      });
    }

    return /*#__PURE__*/_jsx(UIPanelSection, {
      height: "100%",
      className: "m-bottom-0 p-bottom-6",
      children: /*#__PURE__*/_jsxs(UIFlex, {
        className: "sequence-editor-sidebar-updated overflow-y-hidden",
        direction: "column",
        align: "stretch",
        children: [/*#__PURE__*/_jsx(SidebarTemplateListCreateTemplateButton, {
          selectTemplate: this.selectTemplate
        }), /*#__PURE__*/_jsx(H5, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "edit.sidebarTemplateList.existingTemplates"
          })
        }), this.renderFolderSelector(), this.renderSearch(), /*#__PURE__*/_jsx("div", {
          className: "overflow-auto",
          ref: function ref(c) {
            return _this2._contentList = c;
          },
          children: this.renderContentList()
        })]
      })
    });
  }
});
export default connect(function (state) {
  return {
    templateSearch: state.templateSearch
  };
}, {
  updateQueryAndSearch: TemplateActions.updateQueryAndSearch,
  search: TemplateActions.search
})(SidebarTemplateList);