'use es6';

import hubHttpClient from 'hub-http/clients/apiClient';
import PortalIdParser from 'PortalIdParser';
import DeckSelectPopoverWrapper from 'draft-plugins/components/documents/DeckSelectPopoverWrapper';
import GoVideoPopoverContent from 'draft-plugins/components/GoVideoPopoverContent';
import * as DocumentLinkOutputTypes from 'draft-plugins/plugins/documents/DocumentLinkOutputTypes';
import { EDITABLE } from 'draft-plugins/plugins/content/ContentOutputTypes';
import InsertContentDecorator from 'draft-plugins/plugins/content/InsertContentDecorator';
import DocumentLinkPlugin from 'draft-plugins/plugins/DocumentLinkPlugin';
import MeetingsLinkPlugin from 'draft-plugins/plugins/meetings/MeetingsLinkPlugin';
import MeetingsLinkPopover from 'draft-plugins/plugins/meetings/MeetingsLinkPopover';
import MeetingsLinkProTipPlugin from 'draft-plugins/plugins/meetings/MeetingsLinkProTipPlugin';
import VideoPlugin from 'draft-plugins/plugins/VideoPlugin';
import { createTracker } from 'draft-plugins/tracking/usageTracker';
import ContentButton from '../../components/ContentButton';
import * as SnippetsApi from '../snippets/SnippetsApi';
import SnippetsPlugin from '../snippets/SnippetsPlugin';
import transformSnippetsData from '../snippets/transformSnippetsData';
import SnippetsPopoverEmptyState from '../snippets/popover/SnippetsPopoverEmptyState';
import SnippetsPopoverErrorState from '../snippets/popover/SnippetsPopoverErrorState';
var Tracker;
export default (function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!Tracker) {
    Tracker = createTracker();
  }

  var insertSnippetDecoratorConfig = {
    outputType: EDITABLE,
    apiFunctions: SnippetsApi.defaultApiWrapper(hubHttpClient)
  };
  var portalId = options.snippets.portalId || PortalIdParser.get();
  var config = {
    snippets: {
      plugin: SnippetsPlugin(options.snippets),
      component: InsertContentDecorator(ContentButton(Object.assign({
        dataProp: 'SNIPPETS',
        portalId: portalId,
        optionsMapping: {
          text: 'name',
          help: 'body',
          value: 'id'
        },
        PopoverEmptyState: SnippetsPopoverEmptyState,
        PopoverErrorState: SnippetsPopoverErrorState,
        searchPlaceHolder: 'draftPlugins.snippetsPlugin.popover.search.placeholder',
        onlyRenderContent: true,
        search: SnippetsApi.searchSnippets,
        transformData: transformSnippetsData
      }, options.snippets)), insertSnippetDecoratorConfig)
    },
    documents: {
      plugin: DocumentLinkPlugin(options.documents),
      component: DeckSelectPopoverWrapper(null, Object.assign({
        outputType: DocumentLinkOutputTypes.EDITABLE
      }, options.documents))
    },
    meetings: {
      plugin: MeetingsLinkPlugin(options.meetings),
      component: MeetingsLinkPopover()(options.meetings)
    },
    meetingsProTips: {
      plugin: MeetingsLinkProTipPlugin(options.meetingsProTips)
    }
  };

  if (options.video) {
    config.video = {
      plugin: VideoPlugin(options.video),
      component: GoVideoPopoverContent
    };
  }

  return config;
});