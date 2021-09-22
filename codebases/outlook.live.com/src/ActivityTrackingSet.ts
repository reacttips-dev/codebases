import { ActivityTrackingData } from "./ActivityTrackingData";
import { isNOU } from "./Utils";

/**
 * Class to hold a collection of Activity Tracking Data
 */
export class ActivityTrackingSet {
	private isOrdered: boolean;
	private list: ActivityTrackingData[];

	public constructor(isOrdered: boolean, list: ActivityTrackingData[]) {
		this.isOrdered = isOrdered;
		this.list = list;
	}

	public getIsOrdered(): boolean {
		return this.isOrdered;
	}

	public getList(): ActivityTrackingData[] {
		return this.list;
	}

	// returns a stringified json with the list and isOrdered info.
	public getActivityTrackingInfo(): string {

		let activitiesInfoObject: {
			Activities: Array<{ Activity: string, Count: number, IsAggregate: boolean }>,
			IsListOrdered: boolean,
		};

		if (this.list.length === 0) {
			activitiesInfoObject = {
				Activities: [],
				IsListOrdered: this.isOrdered,
			};

			return JSON.stringify(activitiesInfoObject);
		}

		for (const trackingData of this.list) {

			const tempActivities = {
						Activity: trackingData.getActivity(),
						Count: trackingData.getCount(),
						IsAggregate: trackingData.getIsAggregate(),
					};

			if (isNOU(activitiesInfoObject)) {
				activitiesInfoObject = {
								Activities: [tempActivities],
								IsListOrdered: this.isOrdered,
							};
			} else {
				activitiesInfoObject.Activities.push(tempActivities);
			}
		}

		return JSON.stringify(activitiesInfoObject);
	}
}
