'use es6';

import { compose } from 'draft-extend';
import BlockStyles from 'draft-plugins/plugins/BlockStyles';
import BlockAlignment from 'draft-plugins/plugins/BlockAlignment';
import InlineStyles from 'draft-plugins/plugins/InlineStyles';
import FontStyles from 'draft-plugins/plugins/FontStyles';
import SizeStyles from 'draft-plugins/plugins/SizeStyles';
import TextColorPlugin from 'draft-plugins/plugins/TextColorPlugin';
import BackgroundColorPlugin from 'draft-plugins/plugins/BackgroundColorPlugin';
import LinkPlugin from 'draft-plugins/plugins/link';
import PluginGroup from 'draft-plugins/plugins/PluginGroup';
import Separator from 'draft-plugins/plugins/Separator';
import Spacer from 'draft-plugins/plugins/Spacer';
import InlineStyleOverridePlugin from 'draft-plugins/plugins/InlineStyleOverridePlugin';
import MergeTagGroupPlugin from 'draft-plugins/plugins/mergeTags/MergeTagGroupPlugin';
import UnstyledAsDiv from '../UnstyledAsDiv';
export var contentCorePlugins = compose(PluginGroup(FontStyles(), Separator, SizeStyles(), Separator, InlineStyles(), Separator, TextColorPlugin, BackgroundColorPlugin, Separator, BlockStyles({
  headerStyles: [],
  miscStyles: []
}), BlockAlignment({
  tagName: 'div',
  empty: '<br>'
})), LinkPlugin(), Spacer, InlineStyleOverridePlugin(), UnstyledAsDiv);
export var contentMergeTagPlugins = function contentMergeTagPlugins(options) {
  return compose(MergeTagGroupPlugin(options));
};