import { RecordProxy } from '@pipedrive/relay';

export type ActivitiesFilter = {
	activityStatus: string;
};

export type Lead = RecordProxy;

export type Activity = RecordProxy;

export type Activities = Activity[];

export type ActivitiesEnvelope = {
	list: Activities;
	filters: ActivitiesFilter;
};

export enum Position {
	Done,
	Planned,
	Nowhere,
}

export enum Status {
	Done,
	Planned,
}
