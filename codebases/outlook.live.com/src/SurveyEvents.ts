import { ActivityTrackingData } from "./ActivityTrackingData";
import { ActivityTrackingSet } from "./ActivityTrackingSet";
import * as ISurveyEvent from "./ISurveyEvent";

/**
 * A SurveyEvent that counts occurrences of a literal string logged by the product.
 * Survey is activated once the activity occurs Count times.
 */
export interface ICountedActivityEvent extends ISurveyEvent {
	/**
	 * Name of the activity to listen for
	 */
	getActivity(): string;

	/**
	 * Number of times the named activity must be logged to activate
	 */
	getCount(): number;

	/**
	 * Whether or not the count should be persisted across app sessions
	 */
	isAggregate(): boolean;
}

export interface ICountedActivitySequenceEvent extends ISurveyEvent {
	getSequence(): ICountedActivityEvent[];
}

export class CountedActivityEvent implements ICountedActivityEvent {
	public static make(data: CountedActivityEventData): ICountedActivityEvent {
		try {
			return new CountedActivityEvent(data);
		} catch (e) {
			return null;
		}
	}

	private data: CountedActivityEventData;

	public constructor(data: CountedActivityEventData) {
		if (!data) {
			throw new Error("data must not be null");
		}
		if (data.count <= 0) {
			throw new Error("count must be greater than 0");
		}
		if (!data.activity || data.activity.length === 0) {
			throw new Error("activity must not be null or an empty string");
		}

		this.data = data;
	}

	public getActivity(): string {
		return this.data.activity;
	}

	public getCount(): number {
		return this.data.count;
	}

	public isAggregate(): boolean {
		return this.data.isAggregate;
	}

	public getType(): ISurveyEvent.Type {
		return ISurveyEvent.Type.CountedActivity;
	}

	public getTrackingSet(): ActivityTrackingSet {
		const trackingDataList = new Array<ActivityTrackingData>();
		trackingDataList.push(new ActivityTrackingData(this.data.activity, this.data.count, this.data.isAggregate));
		return new ActivityTrackingSet(false, trackingDataList);
	}
}

/**
 * Data class for serialization and deserialization. Do not add logic in here.
 */
export class CountedActivityEventData {
	public activity: string;
	public count: number;
	public isAggregate: boolean;
}

export class CountedActivitySequenceEvent implements ICountedActivitySequenceEvent {
	public static make(data: CountedActivitySequenceEventData): ICountedActivitySequenceEvent {
		try {
			return new CountedActivitySequenceEvent(data);
		} catch (e) {
			return null;
		}
	}

	private data: ICountedActivityEvent[];

	public constructor(data: CountedActivitySequenceEventData) {
		if (!data) {
			throw new Error("data must not be null");
		}
		if (!data.sequence) {
			throw new Error("data.sequence must not be null");
		}
		if (data.sequence.length === 0) {
			throw new Error("data.sequence size must be greater than 0");
		}

		this.data = [];
		for (const countedActivityEventData of data.sequence) {
			this.data.push(new CountedActivityEvent(countedActivityEventData));
		}
	}

	public getSequence(): ICountedActivityEvent[] {
		return this.data;
	}

	public getType(): ISurveyEvent.Type {
		return ISurveyEvent.Type.CountedActivitySequence;
	}

	public getTrackingSet(): ActivityTrackingSet {
		const trackingDataList = new Array<ActivityTrackingData>();

		for (const countedActivityEvent of this.data) {
			trackingDataList.push(new ActivityTrackingData(countedActivityEvent.getActivity(), countedActivityEvent.getCount(),
				countedActivityEvent.isAggregate()));
		}

		return new ActivityTrackingSet(true, trackingDataList);
	}
}

/**
 * Data class for serialization and deserialization. Do not add logic in here.
 */
export class CountedActivitySequenceEventData {
	public sequence: CountedActivityEventData[];

	/**
	 * No args constructor needed for serialization.
	 */
	public CountedActivitySequenceEventData() {
	}
}
