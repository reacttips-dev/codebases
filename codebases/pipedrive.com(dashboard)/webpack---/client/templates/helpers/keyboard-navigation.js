import { forEach } from 'lodash';

const defaultKeyMap = {
	moveHandler: ['up', 'down'],
	enterHandler: 'enter',
	escapeHandler: 'esc'
};

/**
 * Handles keyboard navigation gracefully
 */

export default class KeyboardNavigation {
	/**
	 * @param {Object} options
	 * @param {String} options.classPrefix - container element class name, which is used as a prefix for the selectors
	 * @param {String} options.navigationItemSelector - CSS selector for the item which is reachable by keyboard
	 * @param {String} options.navigationItemsContainerSelector - CSS Selector for the navigation items container
	 * @param {String} options.selectedItemClass - className which will be applied to the selected navigation item
	 * @param {String} [options.backwardDirectionKey] - key name which indicates the backward navigation
	 * @param {String} [options.plane] - indicates the direction of the navigation
	 */
	constructor(options) {
		this.ARROW_UP = 'ArrowUp';
		this.ARROW_LEFT = 'ArrowLeft';
		this.VERTICAL_PLANE = 'vertical';
		this.HORIZONTAL_PLANE = 'horizontal';
		this.KEYBOARD_NAVIGATION_ELEMENT_SELECTOR = '[data-keyboard-navigation="true"]';
		this.classPrefix = options.classPrefix;
		this.navigationItemSelector =
			options.navigationItemSelector || this.KEYBOARD_NAVIGATION_ELEMENT_SELECTOR;
		this.navigationItemsContainerSelector = options.navigationItemsContainerSelector;
		this.selectedItemClass = options.selectedItemClass;
		this.backwardDirectionKey = options.backwardDirectionKey || this.ARROW_UP;
		this.plane = options.plane || this.VERTICAL_PLANE;
		this.move = this.move.bind(this);
	}
	getKeyMap() {
		return defaultKeyMap;
	}
	scrollList(activeEl, backwardDirection) {
		const list = document.querySelector(this.navigationItemsContainerSelector);
		const isVisible =
			this.plane === this.VERTICAL_PLANE
				? isElementVisibleV(list, activeEl)
				: isElementVisibleH(list, activeEl);

		if (!isVisible) {
			activeEl.scrollIntoView(backwardDirection);
		}
	}
	setActiveElement(el) {
		el.classList.add(this.selectedItemClass);
	}
	getActiveElement() {
		return document.querySelector(`.${this.classPrefix} .${this.selectedItemClass}`);
	}
	removeActiveElement() {
		const activeEl = this.getActiveElement();

		if (activeEl) {
			activeEl.classList.remove(this.selectedItemClass);
		}
	}

	move(ev) {
		// NOSONAR
		const backwardDirection = ev.key === this.backwardDirectionKey;
		const navItems = document.querySelectorAll(
			`.${this.classPrefix} ${this.navigationItemSelector}`
		);
		const navItemsAmount = navItems.length;
		const activeNavElement = document.querySelector(
			`.${this.classPrefix} .${this.selectedItemClass}`
		);

		if (activeNavElement && navItemsAmount) {
			forEach(navItems, (newNavElement, index) => {
				if (activeNavElement.isSameNode(newNavElement)) {
					let nextActiveNavItem;

					const newIndex = backwardDirection ? index - 1 : index + 1;

					// current selected item is in between of first and last
					if (navItems[newIndex]) {
						nextActiveNavItem = navItems[newIndex];
					} else {
						// current selected item is first or last
						const firstOrLastIndex = backwardDirection ? navItemsAmount - 1 : 0;

						nextActiveNavItem = navItems[firstOrLastIndex];
					}

					this.removeActiveElement();
					this.setActiveElement(nextActiveNavItem);
					this.scrollList(nextActiveNavItem, backwardDirection);

					return false;
				}
			});
		} else if (!activeNavElement && navItems[0]) {
			this.setActiveElement(navItems[0]);
		}
	}
}

function isElementVisibleV(container, element) {
	// container properties
	const containerScrollTop = container.scrollTop;
	const containerBottom = containerScrollTop + container.clientHeight;

	// element properties
	const elementTop = element.offsetTop - container.offsetTop;
	const elementBottom = elementTop + element.clientHeight;

	const inView = elementTop >= containerScrollTop && elementBottom <= containerBottom;

	return inView;
}

function isElementVisibleH(container, element) {
	// container properties
	const containerScrollLeft = container.scrollLeft;
	const containerRight = containerScrollLeft + container.clientWidth;

	// element properties
	const elementLeft = element.offsetLeft - container.offsetLeft;
	const elementRight = elementLeft + element.clientWidth;

	const inView = elementLeft >= containerScrollLeft && elementRight <= containerRight;

	return inView;
}
