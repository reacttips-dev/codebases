import { ActivityTrackingSet } from "./ActivityTrackingSet";

export class ActivityTrackingContract {
	public surveyId: string;
	public trackingSet: ActivityTrackingSet;

	public constructor(surveyId: string, trackingSet: ActivityTrackingSet) {
		this.surveyId = surveyId;
		this.trackingSet = trackingSet;
	}
}
