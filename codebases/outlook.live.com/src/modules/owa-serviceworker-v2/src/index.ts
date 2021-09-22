import { onInstall } from './handlers/onInstall';
import { onActivate } from './handlers/onActivate';
import { onFetch } from './handlers/onFetch';
import { onMessage } from './handlers/onMessage';
import { logErrorEvent, logError } from './analytics/logDatapoint';

// WI OW 103211 The service workers should not rely on each other.
import XMLHttpRequestPolyfill from 'owa-webpush-serviceworker/lib/polyfill/xmlhttprequest/XMLHttpRequestPolyfill';

declare var self: ServiceWorkerGlobalScope;
(<any>self).XMLHttpRequest = XMLHttpRequestPolyfill;

self.addEventListener('install', onInstall, false);
self.addEventListener('activate', onActivate, false);
self.addEventListener('fetch', onFetch, false);
self.addEventListener('message', onMessage, false);
self.addEventListener('error', logErrorEvent, false);
self.addEventListener('unhandledrejection', event => logError(event.reason, 'unhandledrejection'));
