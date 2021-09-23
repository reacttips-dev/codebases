'use es6';

import DeckSelectPopoverWrapper from 'draft-plugins/components/documents/DeckSelectPopoverWrapper';
import GoVideoPopoverContent from 'draft-plugins/components/GoVideoPopoverContent';
import { RENDERED } from 'draft-plugins/plugins/content/ContentOutputTypes';
import DocumentLinkPlugin from 'draft-plugins/plugins/DocumentLinkPlugin';
import * as DocumentLinkOutputTypes from 'draft-plugins/plugins/documents/DocumentLinkOutputTypes';
import VideoPlugin from 'draft-plugins/plugins/VideoPlugin';
import { createTracker } from 'draft-plugins/tracking/usageTracker';
import hubHttpClient from 'hub-http/clients/apiClient';
import PortalIdParser from 'PortalIdParser';
import ContentButton from '../../components/ContentButton';
import InsertContentDecorator from '../../components/InsertContentDecorator';
import * as SnippetsApi from '../snippets/SnippetsApi';
import SnippetsPlugin from '../snippets/SnippetsPlugin';
import SnippetsPopoverHeader from '../snippets/popover/SnippetsPopoverHeader';
import SnippetsPopoverEmptyState from '../snippets/popover/SnippetsPopoverEmptyState';
import SnippetsPopoverErrorState from '../snippets/popover/SnippetsPopoverErrorState';
import transformSnippetsData from '../snippets/transformSnippetsData';
import MeetingsLinkPlugin from 'draft-plugins/plugins/meetings/MeetingsLinkPlugin';
import MeetingsLinkPopover from 'draft-plugins/plugins/meetings/MeetingsLinkPopover';
var Tracker;
export default (function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!Tracker) {
    Tracker = createTracker();
  }

  var insertSnippetDecoratorConfig = {
    outputType: RENDERED,
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
        Header: SnippetsPopoverHeader,
        searchPlaceHolder: 'draftPlugins.snippetsPlugin.popover.search.placeholder',
        onlyRenderContent: true,
        onInsertContent: function onInsertContent() {},
        onInsertSnippet: function onInsertSnippet() {},
        search: SnippetsApi.searchSnippets,
        transformData: transformSnippetsData
      }, options.snippets)), insertSnippetDecoratorConfig)
    },
    documents: {
      plugin: DocumentLinkPlugin(options.documents),
      component: DeckSelectPopoverWrapper(null, Object.assign({
        outputType: DocumentLinkOutputTypes.EDITABLE,
        onInsertDocument: function onInsertDocument() {}
      }, options.documents))
    },
    meetings: {
      plugin: MeetingsLinkPlugin(options.meetings),
      component: MeetingsLinkPopover()(options.meetings)
    }
  };

  if (options.video) {
    config.video = Object.assign({
      plugin: VideoPlugin(options.video),
      component: GoVideoPopoverContent
    }, options.video);
  }

  return config;
});