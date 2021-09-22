export default {
	POPOVER_MIN_HEIGHT: 273,
	getMaxHeightForPopoverOptions() {
		const windowHeight = window.innerHeight;
		const POPOVER_OPTION_MIN_HEIGHT = 32;

		if (windowHeight <= this.POPOVER_MIN_HEIGHT) {
			return POPOVER_OPTION_MIN_HEIGHT;
		}

		return false;
	},

	getOptionWrapperStyle() {
		return { maxHeight: this.getMaxHeightForPopoverOptions() };
	}
};
