// eslint-disable-next-line @typescript-eslint/triple-slash-reference
// / <reference path="./@types/service-worker.d.ts" />

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore Location and URL are the same afaik and looks like TS bug
const searchParams = new URL(location).searchParams;

const cdnDomain = searchParams.get('cdnDomain');

export const NOTIFICATION_ICON_URL = `//cdn.${cdnDomain}/webapp/images/icons/pipedrive_1024x1024.png`;

export const onNotificationClick = (event) => {
	event.waitUntil(
		(async function () {
			let chatClient;

			const clickedNotification = event.notification;
			const { link, reusableWindowPath } = clickedNotification.data;
			const allClients = await self.clients.matchAll({
				includeUncontrolled: true,
			});

			const reusableWindowPathRegex = new RegExp(reusableWindowPath);

			// go through existing windows of pipedrive.com
			for (const client of allClients) {
				const url = new URL(client.url);

				// if window with the application already exists, focus it and exit
				if (reusableWindowPathRegex.test(url.pathname)) {
					client.focus();
					chatClient = client;
					break;
				}
			}

			if (chatClient) {
				// post message to the window to redirect to notification item URL
				await chatClient.postMessage({ action: 'redirect', url: link });
			} else {
				await self.clients.openWindow(link);
			}
		})(),
	);
};

export const onPush = async (event) => {
	event.waitUntil(
		(async () => {
			if (event.data) {
				const { tag, body, title, link, reusableWindowPath, focusedWindowPath } = JSON.parse(event.data.text());

				const allClients = await self.clients.matchAll({
					includeUncontrolled: true,
				});

				const focusedWindowPathRegex = new RegExp(focusedWindowPath);

				for (const client of allClients) {
					const url = new URL(client.url);

					// don't show the notification if the url already is open focused
					if (focusedWindowPathRegex.test(url.pathname) && client.focused) {
						return;
					}
				}

				await self.registration.showNotification(title, {
					body,
					tag: tag ? tag : Math.random(), // if notification doesn't have tag, generate random one to display it
					icon: NOTIFICATION_ICON_URL,
					data: {
						link,
						reusableWindowPath,
					},
				});
			}
		})(),
	);
};

// This is here for the service worker to take over all pages instantly
// without waiting for all window to be closed/reopened.
// We want this for the SW to be up to date without an extra waiting time.
// Note that this is mainly safe because SW is only used for notifications.
const onInstall = async () => {
	self.skipWaiting();
};

self.addEventListener('install', onInstall);
self.addEventListener('push', onPush);
self.addEventListener('notificationclick', onNotificationClick);
