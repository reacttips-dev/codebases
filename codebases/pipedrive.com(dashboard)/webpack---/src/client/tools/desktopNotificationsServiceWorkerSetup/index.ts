import { post } from '@pipedrive/fetch';
import base64ToUint8array from '../../utils/base64-to-uint8array';

const SUBSCRIPTION_URL = '/api/v1/desktop-notifications/subscriptions';

const saveSubscription = (subscription) => {
	const payload = {
		endpoint: subscription.endpoint,
		keys: {
			p256dh: subscription.keys.p256dh,
			auth: subscription.keys.auth,
		},
	};

	return post(SUBSCRIPTION_URL, payload);
};

const browserSupportsServiceWorker = () => 'serviceWorker' in navigator;
const browserSupportsNotifications = () => 'PushManager' in window && 'Notification' in window;

const setupNotificationSubscription = async (registration) => {
	const applicationServerKey = base64ToUint8array(window.app.config.desktopNotificationsPublicKey);

	const options = {
		userVisibleOnly: true,
		applicationServerKey,
	};

	const notificationPermission = await registration.pushManager.permissionState(options);

	if (notificationPermission === 'granted') {
		const notificationSubscription = await registration.pushManager.getSubscription();

		if (!notificationSubscription) {
			const newSubscription = await registration.pushManager.subscribe(options);

			try {
				await saveSubscription(newSubscription.toJSON());
			} catch (err) {
				await newSubscription.unsubscribe();

				throw err;
			}
		}
	}
};

const setup = async (componentLoader) => {
	if (!browserSupportsServiceWorker() || window.app.config.desktopNotificationsPublicKey === null) {
		return;
	}

	const router = await componentLoader.load('froot:router');
	const cdnDomain = encodeURIComponent(window.app.config.cdnDomain);

	const oldServiceWorkerUrl = `/service-worker.js?cdnDomain=${cdnDomain}`;
	const existingRegistrations = await navigator.serviceWorker.getRegistrations();
	const oldServiceWorkerRegistration = existingRegistrations.find((reg) =>
		reg.active.scriptURL.endsWith(oldServiceWorkerUrl),
	);
	if (oldServiceWorkerRegistration) {
		await oldServiceWorkerRegistration.unregister();
	}

	const newServiceWorkerUrl = `/desktop-notifications-service-worker.js?cdnDomain=${cdnDomain}`;

	const registration = await navigator.serviceWorker.register(newServiceWorkerUrl, {
		updateViaCache: 'none',
		scope: '/desktop-notifications',
	});

	if (browserSupportsNotifications()) {
		await setupNotificationSubscription(registration);
	}

	navigator.serviceWorker.addEventListener('message', (event) => {
		if (event.data.action === 'redirect') {
			router.navigateTo(event.data.url);
		}
	});
};

export default (componentLoader) => {
	return () => setup(componentLoader);
};
