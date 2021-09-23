'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { Editor } from 'draft-extend';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import AdvancedColorPlugin from 'draft-plugins/plugins/AdvancedColorPlugin';
import BaseImagePlugin from 'draft-plugins/plugins/BaseImagePlugin';
import BlockAlignment from 'draft-plugins/plugins/BlockAlignment';
import BlockStyles from 'draft-plugins/plugins/BlockStyles';
import ColorPickerPopoverBody from 'react-colorpicker/popover/ColorPickerPopoverBody';
import CopyOverride from 'draft-plugins/plugins/CopyOverride';
import FontStyles from 'draft-plugins/plugins/FontStyles';
import InlineStyles from 'draft-plugins/plugins/InlineStyles';
import InlineStyleOverridePlugin from 'draft-plugins/plugins/InlineStyleOverridePlugin';
import LinkPlugin from 'draft-plugins/plugins/link';
import ListStylesDropdown from 'draft-plugins/plugins/ListStylesDropdown';
import PluginGroup from 'draft-plugins/plugins/PluginGroup';
import Separator from 'draft-plugins/plugins/Separator';
import SizeStyles from 'draft-plugins/plugins/SizeStyles';
import SnippetsPlugin from 'draft-content-plugins/plugins/snippets/SnippetsPlugin';
import createImageButton from 'draft-plugins/components/createImageButton';
import createTextToolbarButton from 'draft-plugins/utils/createTextToolbarButton';
import * as ContentOutputTypes from 'draft-content-plugins/lib/ContentOutputTypes';
import configureFileManager from 'FileManagerLib/components/configureFileManager';
import { ConfigureFileManagerFileAccess } from 'FileManagerLib/enums/FileAccess';
import FilePickerPanel from 'FileManagerLib/picker/FilePickerPanel';
import { tracker } from 'SequencesUI/util/UsageTracker';
var FileManager = configureFileManager({
  withDragDropContext: true,
  usageTracker: tracker,
  uploadedFileAccess: ConfigureFileManagerFileAccess.VISIBLE_IN_APP_PUBLIC_TO_ALL_NOT_INDEXABLE
});
var commonPluginsGroup = PluginGroup({
  useDropdown: true,
  dropdownText: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "draftPlugins.richtext.more"
  }),
  dropdownButtonClassName: 'p-right-0'
}, FontStyles(), SizeStyles(), AdvancedColorPlugin({
  ColorPicker: ColorPickerPopoverBody
}), AdvancedColorPlugin({
  ColorPicker: ColorPickerPopoverBody,
  cssProperty: 'background-color',
  defaultColor: '#fff',
  iconName: 'highlight'
}), Separator, BlockStyles({
  headerStyles: [],
  listStyles: [],
  miscStyles: ['blockquote']
}), ListStylesDropdown(), BlockAlignment({
  tagName: 'div',
  tooltipPlacement: 'top',
  empty: '<br>'
}));
var plugins = CopyOverride(InlineStyles(), InlineStyleOverridePlugin(), LinkPlugin({
  tooltipPlacement: 'top'
}), BaseImagePlugin({
  Button: createImageButton({
    tooltipPlacement: 'top',
    FileManager: FileManager,
    FilePickerPanel: FilePickerPanel
  })
}), SnippetsPlugin({
  outputType: ContentOutputTypes.RENDERED,
  button: createTextToolbarButton({
    icon: 'textSnippet',
    tooltip: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: "draftPlugins.insertGroupPlugin.insertItem.snippets"
    }),
    tooltipPlacement: 'top'
  }),
  popoverPlacement: 'top'
}), commonPluginsGroup);
export var TaskNotesEditor = plugins(Editor);
export var fromHTML = plugins(convertFromHTML);
export var toHTML = plugins(convertToHTML);