import './configure-promise-queue';
import './error-test';
import './globals';
import { initialize as initSnowplowAnalytics } from '@trello/analytics';
import { initialize as initAtlassianAnalytics } from '@trello/atlassian-analytics';
import './intl-polyfill';
import './live-updater';
import './load-gapi';
import './pinocchio';
import './safari-tab-index';
import './subscriber';
import './token-watcher';
import './vendor-patches';
import './window-resize-watcher';

initSnowplowAnalytics();
initAtlassianAnalytics();
