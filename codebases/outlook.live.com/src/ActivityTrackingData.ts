/**
 * Basic structure used to configure an ActivityTracker
 */
export class ActivityTrackingData {
	private activity: string;
	private count: number;
	private isAggregate: boolean;

	public constructor(activity: string, count: number, isAggregate: boolean) {
		this.activity = activity;
		this.count = count;
		this.isAggregate = isAggregate;
	}

	public getActivity(): string {
		return this.activity;
	}

	public getCount(): number {
		return this.count;
	}

	public setCount(count: number): void {
		this.count = count;
	}

	public getIsAggregate(): boolean {
		return this.isAggregate;
	}
}
