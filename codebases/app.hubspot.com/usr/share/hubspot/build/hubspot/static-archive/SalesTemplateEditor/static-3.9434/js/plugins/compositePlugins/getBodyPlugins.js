'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import identity from 'transmute/identity';
import ColorPickerPopoverBody from 'react-colorpicker/popover/ColorPickerPopoverBody';
import apiClient from 'hub-http/clients/apiClient';
import { onIncludeLinkPreview, onInsertContent, onInsertDocument, onInsertMeetingsLink, onInsertSnippet, onInsertToken } from 'SalesTemplateEditor/tracking/TrackingInterface';
import { tracker } from 'SalesTemplateEditor/tracking/tracker';
import localSettings from 'SalesTemplateEditor/utils/localSettings';
import { MEETINGS_PLUGIN_ZERO_STATE } from 'SalesTemplateEditor/lib/Images';
import { HIDE_MEETINGS_PLUGIN_PRO_TIP } from 'draft-plugins/lib/constants';
import createImageButton from 'draft-plugins/components/createImageButton';
import AdvancedColorPlugin from 'draft-plugins/plugins/AdvancedColorPlugin';
import BaseImagePlugin from 'draft-plugins/plugins/BaseImagePlugin';
import BlockStyles from 'draft-plugins/plugins/BlockStyles';
import BlockAlignment from 'draft-plugins/plugins/BlockAlignment';
import InlineStyles from 'draft-plugins/plugins/InlineStyles';
import FontStyles from 'draft-plugins/plugins/FontStyles';
import SizeStyles from 'draft-plugins/plugins/SizeStyles';
import LinkPlugin from 'draft-plugins/plugins/link';
import PluginGroup from 'draft-plugins/plugins/PluginGroup';
import Separator from 'draft-plugins/plugins/Separator';
import InlineStyleOverridePlugin from 'draft-plugins/plugins/InlineStyleOverridePlugin';
import InsertGroupPlugin from 'draft-plugins/plugins/insert/InsertGroupPlugin';
import createSalesEngagementConfig from 'draft-content-plugins/plugins/insertGroup/createSalesEngagementConfig';
import CopyOverride from 'draft-plugins/plugins/CopyOverride';
import PaintSelectionOnBlur from 'draft-plugins/plugins/PaintSelectionOnBlur';
import MergeTagGroupPlugin from 'draft-plugins/plugins/mergeTags/MergeTagGroupPlugin';
import DocumentLinkPreviewPlugin from 'draft-plugins/plugins/DocumentLinkPreviewPlugin';
import * as DocumentLinkOutputTypes from 'draft-plugins/plugins/documents/DocumentLinkOutputTypes';
import SnippetsButton from '../snippets/SnippetsButton';
import DisableImmutableEntityInput from '../DisableImmutableEntityInput';
import UnstyledAsDiv from 'draft-plugins/plugins/UnstyledAsDiv';
import { createPluginStackWithAdapters } from 'draft-plugins/plugins/createPluginStack';
import { hasTicketAccess } from 'SalesTemplateEditor/lib/permissions';
import createErrorReporter from '../../lib/errorLogging';
import getFileManager from './fileManager';
import FilePickerPanel from 'FileManagerLib/picker/FilePickerPanel';
var meetingsErrorReporter = createErrorReporter('[SalesTemplateEditor] Meeting fetch failure');

var onHideProTip = function onHideProTip() {
  localSettings.set(HIDE_MEETINGS_PLUGIN_PRO_TIP, true);
};

export default function getBodyPlugins(_ref) {
  var _ref$includeModalPlug = _ref.includeModalPlugins,
      includeModalPlugins = _ref$includeModalPlug === void 0 ? true : _ref$includeModalPlug,
      _ref$includeVideoPlug = _ref.includeVideoPlugin,
      includeVideoPlugin = _ref$includeVideoPlug === void 0 ? true : _ref$includeVideoPlug;
  var FileManager = getFileManager(tracker);
  var insertGroupConfig = {
    snippets: {
      onInsertContent: onInsertContent,
      onInsertSnippet: onInsertSnippet,
      Button: SnippetsButton
    },
    documents: {
      fetch: apiClient.post,
      onIncludeLinkPreview: onIncludeLinkPreview,
      onInsertDocument: onInsertDocument,
      page: 'templateCreator'
    },
    meetings: {
      onFetchMeetingsError: meetingsErrorReporter,
      onInsertMeetingsLink: onInsertMeetingsLink,
      zeroStateImageUrl: MEETINGS_PLUGIN_ZERO_STATE
    },
    meetingsProTips: {
      onFetchMeetingsError: meetingsErrorReporter,
      onHideProTip: onHideProTip
    }
  };

  if (includeModalPlugins && includeVideoPlugin) {
    insertGroupConfig.video = {
      useInsertPopover: true,
      insertPopoverPlacement: 'top right',
      usePopover: false,
      shepherdUserSettingKey: 'sales-content-has-viewed-video-integration-shepherd'
    };
  }

  var basePlugins = [InlineStyles(), PluginGroup({
    dropdownText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "draftPlugins.richtext.more"
    }),
    useDropdown: true
  }, FontStyles(), SizeStyles(), AdvancedColorPlugin({
    ColorPicker: ColorPickerPopoverBody
  }), AdvancedColorPlugin({
    ColorPicker: ColorPickerPopoverBody,
    cssProperty: 'background-color',
    defaultColor: '#fff',
    iconName: 'highlight'
  }), BlockStyles({
    headerStyles: [],
    miscStyles: []
  }), BlockAlignment({
    tagName: 'div',
    empty: '<br>'
  })), Separator, LinkPlugin(), includeModalPlugins ? BaseImagePlugin({
    Button: createImageButton({
      FileManager: FileManager,
      FilePickerPanel: FilePickerPanel
    })
  }) : identity, MergeTagGroupPlugin({
    buttonClassName: 'p-right-1 p-left-2',
    includeTicketTokens: hasTicketAccess(),
    includeCustomTokens: true,
    onInsertToken: onInsertToken
  }), InsertGroupPlugin(createSalesEngagementConfig(insertGroupConfig)), DocumentLinkPreviewPlugin({
    outputType: DocumentLinkOutputTypes.EDITABLE
  }), UnstyledAsDiv, InlineStyleOverridePlugin(), DisableImmutableEntityInput()];
  return createPluginStackWithAdapters(PaintSelectionOnBlur, CopyOverride).apply(void 0, basePlugins);
}