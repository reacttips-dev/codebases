'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import apiClient from 'hub-http/clients/apiClient';
import AdvancedColorPlugin from 'draft-plugins/plugins/AdvancedColorPlugin';
import CopyOverride from 'draft-plugins/plugins/CopyOverride';
import PluginGroup from 'draft-plugins/plugins/PluginGroup';
import Separator from 'draft-plugins/plugins/Separator';
import StripButtonsAndOverlaysPlugin from 'draft-plugins/plugins/StripButtonsAndOverlaysPlugin';
import ImagePlugin from 'draft-plugins/plugins/ImagePlugin';
import BlockStyles from 'draft-plugins/plugins/BlockStyles';
import BlockAlignment from 'draft-plugins/plugins/BlockAlignment';
import InlineStyles from 'draft-plugins/plugins/InlineStyles';
import FontStyles from 'draft-plugins/plugins/FontStyles';
import SizeStyles from 'draft-plugins/plugins/SizeStyles';
import InsertGroupPlugin from 'draft-plugins/plugins/insert/InsertGroupPlugin';
import createSalesModalConfig from 'draft-content-plugins/plugins/insertGroup/createSalesModalConfig';
import LinkPlugin from 'draft-plugins/plugins/link';
import DocumentLinkPreviewPlugin from 'draft-plugins/plugins/DocumentLinkPreviewPlugin';
import FileDrop from 'draft-plugins/plugins/FileDrop';
import ImagePasteWithOptions from 'draft-plugins/plugins/ImagePasteWithOptions';
import { DropZoneNoBrowseFileAccess } from 'FileManagerLib/enums/FileAccess';
import { RENDERED as SNIPPETS_RENDERED } from 'draft-plugins/plugins/snippets/SnippetsOutputTypes';
import { RENDERED as DOCUMENTS_RENDERED } from 'draft-plugins/plugins/documents/DocumentLinkOutputTypes';
import UnstyledAsDiv from 'draft-plugins/plugins/UnstyledAsDiv';
import DisableImmutableEntityInput from 'SalesTemplateEditor/plugins/DisableImmutableEntityInput';
import SignaturePlugin from 'draft-signature-plugin/SignaturePlugin';
import SignatureUnsubscribePlugin from 'EmailSignatureEditor/plugins/SignatureUnsubscribePlugin';
import ColorPickerPopoverBody from 'react-colorpicker/popover/ColorPickerPopoverBody';
import { UsageTracker } from '../../../utils/enrollModal/UsageLogger';
import MissingMergeTagPlugin from './MissingMergeTagPlugin';
var defaultInsertGroupConfig = createSalesModalConfig({
  snippets: {
    outputType: SNIPPETS_RENDERED,
    tracker: function tracker(eventName) {
      return UsageTracker.track('sequencesUsage', {
        action: eventName,
        subscreen: 'enroll'
      });
    }
  },
  documents: {
    fetch: apiClient.post,
    track: function track(eventName) {
      return UsageTracker.track('sequencesUsage', {
        action: eventName,
        subscreen: 'enroll'
      });
    },
    outputType: DOCUMENTS_RENDERED
  },
  video: {
    useInsertPopover: true,
    insertPopoverPlacement: 'top left',
    usePopover: false,
    shepherdUserSettingKey: 'sales-content-has-viewed-video-integration-shepherd'
  }
});
export default function getBodyConversionPlugins() {
  var insertGroupConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultInsertGroupConfig;
  var publicImages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var imageAccess = publicImages ? DropZoneNoBrowseFileAccess.HIDDEN_IN_APP_PUBLIC_TO_ALL_NOT_INDEXABLE : DropZoneNoBrowseFileAccess.HIDDEN_IN_APP_PRIVATE_NOT_INDEXABLE;
  return FileDrop({
    fileOptions: {
      access: DropZoneNoBrowseFileAccess.HIDDEN_IN_APP_PRIVATE_NOT_INDEXABLE
    },
    imageOptions: {
      access: imageAccess
    },
    onDropNonImage: function onDropNonImage() {
      return null;
    }
  })(ImagePasteWithOptions({
    imageOptions: {
      access: imageAccess
    }
  })(CopyOverride(StripButtonsAndOverlaysPlugin(ImagePlugin), InlineStyles(), PluginGroup({
    dropdownText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "draftPlugins.richtext.more"
    }),
    useDropdown: true
  }, FontStyles({
    dropdownClassName: 'm-right-2'
  }), SizeStyles(), AdvancedColorPlugin({
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
  })), Separator, LinkPlugin(), UnstyledAsDiv, MissingMergeTagPlugin(), SignaturePlugin({
    allowEditing: false
  }), SignatureUnsubscribePlugin, DocumentLinkPreviewPlugin({
    outputType: DOCUMENTS_RENDERED
  }), DisableImmutableEntityInput(), InsertGroupPlugin(insertGroupConfig))));
}