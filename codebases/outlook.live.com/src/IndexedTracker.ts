import ActivityTracker = require("./ActivityTracker");
import ISurvey = require("./Api/ISurvey");

export class IndexedTracker {
	public index: number;
	public surveyId: string;
	public tracker: ActivityTracker;
}
