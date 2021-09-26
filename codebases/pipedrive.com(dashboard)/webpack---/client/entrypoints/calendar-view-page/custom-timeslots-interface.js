import classes from './scss/_timeslots.scss';

export default function customTimeslotsInterface(CalendarItemInterface) {
	return class CustomTimeslotsInterface extends CalendarItemInterface {
		constructor({ onTimeslotClick }) {
			super();
			this.onTimeslotClick = onTimeslotClick;
		}

		onItemClick({ item }) {
			if (this.onTimeslotClick) {
				this.onTimeslotClick(item.getIn(['data', 'related_objects', 'event', 'id']));
			}
		}

		getCustomClassName() {
			return classes.timeslot;
		}
	};
}
