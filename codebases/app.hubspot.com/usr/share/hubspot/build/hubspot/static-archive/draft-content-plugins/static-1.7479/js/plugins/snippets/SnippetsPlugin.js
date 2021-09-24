'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { List } from 'immutable';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import invariant from 'react-utils/invariant';
import identity from 'transmute/identity';
import hubHttpClient from 'hub-http/clients/apiClient';
import PortalIdParser from 'PortalIdParser';
import { createPlugin } from 'draft-extend';
import ContentButton from '../../components/ContentButton';
import ContentResults from '../../components/ContentResults';
import InsertContentDecorator from '../../components/InsertContentDecorator';
import { EDITABLE, PLAIN_TEXT, RENDERED } from '../../lib/ContentOutputTypes';
import createPluginButton from '../../utils/createPluginButton';
import createOverlay from '../../utils/createOverlay';
import * as SnippetsApi from './SnippetsApi';
import SnippetsSearchNoResults from './SnippetsSearchNoResults';
import SnippetsPopoverEmptyState from './popover/SnippetsPopoverEmptyState';
import SnippetsPopoverErrorState from './popover/SnippetsPopoverErrorState';
import SnippetsPopoverHeader from './popover/SnippetsPopoverHeader';
import transformSnippetsData from './transformSnippetsData';
var SnippetsOutputTypes = List([EDITABLE, RENDERED, PLAIN_TEXT]);
var SnippetsButton = createPluginButton({
  icon: 'textSnippet',
  testKey: 'snippets',
  toolTip: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
    message: "draftPlugins.snippetsPlugin.tooltip"
  })
});
export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$apiClient = _ref.apiClient,
      apiClient = _ref$apiClient === void 0 ? hubHttpClient : _ref$apiClient,
      _ref$apiWrapper = _ref.apiWrapper,
      apiWrapper = _ref$apiWrapper === void 0 ? SnippetsApi.defaultApiWrapper : _ref$apiWrapper,
      popoverPlacement = _ref.popoverPlacement,
      data = _ref.data,
      _ref$trigger = _ref.trigger,
      trigger = _ref$trigger === void 0 ? '#' : _ref$trigger,
      _ref$maximumSearch = _ref.maximumSearch,
      maximumSearch = _ref$maximumSearch === void 0 ? 20 : _ref$maximumSearch,
      _ref$outputType = _ref.outputType,
      outputType = _ref$outputType === void 0 ? EDITABLE : _ref$outputType,
      _ref$tracker = _ref.tracker,
      tracker = _ref$tracker === void 0 ? identity : _ref$tracker,
      _ref$onInsertSnippet = _ref.onInsertSnippet,
      onInsertSnippet = _ref$onInsertSnippet === void 0 ? identity : _ref$onInsertSnippet,
      _ref$onInsertContent = _ref.onInsertContent,
      onInsertContent = _ref$onInsertContent === void 0 ? identity : _ref$onInsertContent,
      _ref$portalId = _ref.portalId,
      portalId = _ref$portalId === void 0 ? PortalIdParser.get() : _ref$portalId,
      _ref$button = _ref.button,
      button = _ref$button === void 0 ? SnippetsButton : _ref$button,
      _ref$onOpenPopover = _ref.onOpenPopover,
      onOpenPopover = _ref$onOpenPopover === void 0 ? function () {} : _ref$onOpenPopover,
      _ref$ResultsComponent = _ref.ResultsComponent,
      ResultsComponent = _ref$ResultsComponent === void 0 ? function (props) {
    return /*#__PURE__*/_jsx(ContentResults, Object.assign({}, props, {
      ContentEmptyState: SnippetsSearchNoResults,
      portalId: portalId
    }));
  } : _ref$ResultsComponent,
      PopoverComponent = _ref.PopoverComponent,
      _ref$HeaderComponent = _ref.HeaderComponent,
      HeaderComponent = _ref$HeaderComponent === void 0 ? SnippetsPopoverHeader : _ref$HeaderComponent,
      _ref$EmptyStateCompon = _ref.EmptyStateComponent,
      EmptyStateComponent = _ref$EmptyStateCompon === void 0 ? SnippetsPopoverEmptyState : _ref$EmptyStateCompon,
      popoverClassName = _ref.popoverClassName,
      renderedContentClassName = _ref.renderedContentClassName;

  invariant(SnippetsOutputTypes.includes(outputType), "SnippetsPlugin: expected out to be " + SnippetsOutputTypes.join(', '));
  var apiFunctions = apiWrapper(apiClient);
  var insertSnippetDecoratorConfig = {
    outputType: outputType,
    apiFunctions: apiFunctions
  };
  var Overlay = createOverlay({
    apiClient: apiClient,
    data: data,
    search: apiFunctions.searchSnippets || SnippetsApi.searchSnippets,
    trigger: trigger,
    maximumSearch: maximumSearch,
    portalId: portalId,
    ResultsComponent: ResultsComponent,
    transformData: transformSnippetsData
  });
  var SnippetOverlay = createReactClass({
    displayName: "SnippetOverlay",
    propTypes: {
      insertContent: PropTypes.func.isRequired
    },
    selectOption: function selectOption(_ref2, _ref3) {
      var value = _ref2.value,
          snippet = _ref2.snippet;
      var offset = _ref3.offset,
          length = _ref3.length;
      var htmlBody = snippet.htmlBody;
      tracker('inserted-snippet');
      onInsertSnippet({
        fromPopover: false
      });
      this.props.insertContent({
        id: value,
        htmlBody: htmlBody,
        offset: offset,
        length: length
      });
    },
    render: function render() {
      return /*#__PURE__*/_jsx(Overlay, Object.assign({}, this.props, {
        onSelect: this.selectOption
      }));
    }
  });
  return createPlugin({
    overlays: InsertContentDecorator(SnippetOverlay, insertSnippetDecoratorConfig),
    buttons: button && InsertContentDecorator(ContentButton({
      data: data,
      tracker: tracker,
      onInsertContent: onInsertContent,
      portalId: portalId,
      Button: button,
      onOpenPopover: onOpenPopover,
      popoverPlacement: popoverPlacement,
      Header: HeaderComponent,
      PopoverComponent: PopoverComponent,
      PopoverEmptyState: EmptyStateComponent,
      PopoverErrorState: SnippetsPopoverErrorState,
      searchPlaceHolder: 'draftPlugins.snippetsPlugin.popover.search.placeholder',
      transformData: transformSnippetsData,
      search: apiFunctions.searchSnippets || SnippetsApi.searchSnippets,
      popoverClassName: popoverClassName,
      renderedContentClassName: renderedContentClassName,
      popoverTestKey: 'snippets-popover'
    }), insertSnippetDecoratorConfig)
  });
});