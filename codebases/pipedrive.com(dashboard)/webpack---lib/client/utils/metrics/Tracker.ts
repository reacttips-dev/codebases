import { PDMetrics } from '@pipedrive/react-utils';

interface TrackingData {
	readonly component: string;
	readonly eventAction: string;
	readonly eventData: Record<string, unknown>;
}

export class Tracker {
	constructor(public readonly metrics: PDMetrics, private readonly view: string) {}

	public trackEvent(data: TrackingData | null): void {
		if (!this.isActive() || data == null) {
			return;
		}

		const { component, eventAction, eventData } = data;

		if (process.env.NODE_ENV === 'development') {
			/* eslint-disable no-console */
			console.groupCollapsed('%c%s', 'font-weight:bold;color:grey', `[Metrics] ${component}::${eventAction} 🧭`);
			console.log('Payload: %o', eventData);
			console.groupEnd();
			/* eslint-enable no-console */
		}

		this.metrics?.trackUsage(this.view, component, eventAction, eventData);
	}

	public isActive(): boolean {
		return !!this.metrics && !!this.metrics.trackUsage;
	}
}
