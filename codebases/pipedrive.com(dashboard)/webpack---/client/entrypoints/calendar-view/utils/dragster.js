import { noop } from 'lodash';
import { supportedPointerEvents } from './browser';

export default class Dragster {
	constructor(element, options) {
		this.element = element;
		this.region = options.region || document.body;
		this.scrollableRegion = options.scrollableRegion || this.element;
		this.threshold = options.threshold;
		this.onPress = options.onPress || noop;
		this.onClick = options.onClick || noop;
		this.onMoveStart = options.onMoveStart || noop;
		this.onMove = options.onMove || noop;
		this.onMoveEnd = options.onMoveEnd || noop;

		this.pointerEvents = supportedPointerEvents();

		this.click = this.click.bind(this);
		this.pointerDown = this.pointerDown.bind(this);
		this.pointerMove = this.pointerMove.bind(this);
		this.pointerUp = this.pointerUp.bind(this);
		this.stopPropagation = this.stopPropagation.bind(this);

		this.element.addEventListener(this.pointerEvents.pointerDown, this.pointerDown, false);
		this.element.addEventListener('click', this.click, false);

		this.dragging = false;
		this.initialPress = null;
	}

	click(event) {
		if (!this.dragging) {
			this.onClick(event);
		}
	}

	pointerDown(event) {
		this.onPress(event);

		this.initialPress = event;

		this.region.addEventListener(this.pointerEvents.pointerMove, this.pointerMove, false);
		this.region.addEventListener(this.pointerEvents.pointerUp, this.pointerUp, false);
	}

	pointerMove(event) {
		event.stopPropagation();

		if (!this.dragging) {
			const isXInRange = this.isInRange(
				event.screenX - this.initialPress.screenX,
				this.threshold,
			);
			const isYInRange = this.isInRange(
				event.screenY - this.initialPress.screenY,
				this.threshold,
			);

			if (!isXInRange || !isYInRange) {
				this.region.addEventListener('click', this.stopPropagation, { once: true });

				this.dragging = true;
				this.onMoveStart(event);
			}
		}

		if (this.dragging) {
			this.checkScroll(event);
			this.onMove(event);
		}
	}

	isInRange(x, r) {
		return Math.abs(x) < r;
	}

	pointerUp(event) {
		this.onMoveEnd(event);
		this.stop();
	}

	checkScroll(event) {
		const scrollableRegion =
			typeof this.scrollableRegion === 'function'
				? this.scrollableRegion()
				: this.scrollableRegion;

		if (!scrollableRegion) {
			return;
		}

		const scrollableRegionRect = scrollableRegion.getBoundingClientRect();
		const y = event.clientY;
		const step = this.threshold;
		const buffer = 0.2 * scrollableRegionRect.height;

		if (y < scrollableRegionRect.top + buffer) {
			scrollableRegion.scrollTop -= step;
		} else if (event.clientY > scrollableRegionRect.bottom - buffer) {
			scrollableRegion.scrollTop += step;
		}
	}

	stopPropagation(event) {
		event.stopPropagation();
	}

	stop() {
		if (this.region) {
			this.region.removeEventListener(this.pointerEvents.pointerUp, this.pointerUp, false);
			this.region.removeEventListener(
				this.pointerEvents.pointerMove,
				this.pointerMove,
				false,
			);
		}

		setTimeout(() => {
			this.dragging = false;

			if (this.region) {
				this.region.removeEventListener('click', this.stopPropagation, { once: true });
			}
		});
	}

	destroy() {
		this.stop();

		if (this.element) {
			this.element.removeEventListener(
				this.pointerEvents.pointerDown,
				this.pointerDown,
				false,
			);
			this.element.removeEventListener('click', this.click, false);
		}
	}
}
