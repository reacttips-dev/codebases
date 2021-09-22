const Backbone = require('backbone');
const Pipedrive = require('pipedrive');
const _ = require('lodash');
const $ = require('jquery');
const memory = {
	interval: null,
	draggable: {}
};
const nativeDragTypes = {
	'Text': 'draggable',
	'text/plain': 'draggable',
	'public.utf8-plain-text': 'draggable',
	'application/microdata+json': 'draggable', // Opera
	'String': 'html',
	'text/html': 'html',
	'URL': 'link',
	'text/x-moz-url': 'link',
	'text/uri-list': 'link',
	'WebURLsWithTitlesPboardType': 'link',
	'Files': 'files',
	'application/x-moz-file': 'files',
	'public.file-url': 'files'
};
const nativeDragTypesOrder = [
	'Files',
	'Text',
	'text/plain',
	'public.utf8-plain-text',
	'application/microdata+json',
	'String',
	'text/html',
	'URL',
	'text/x-moz-url',
	'text/uri-list',
	'WebURLsWithTitlesPboardType',
	'application/x-moz-file',
	'public.file-url'
];
const matchNativeDragType = function(types) {
	let type = 'N/A';
	let typePosition = null;
	let i = 0;

	for (i; i < types.length; i++) {
		const indexOfDragType = nativeDragTypesOrder.indexOf(types[i]);

		if (indexOfDragType !== -1 && (typePosition === null || indexOfDragType < typePosition)) {
			typePosition = indexOfDragType;
		}
	}

	if (typePosition !== null) {
		type = nativeDragTypes[nativeDragTypesOrder[typePosition]];
	}

	return type;
};

/**
 * Simulate a mouse event based on a corresponding touch event
 * @param {Object} event A touch event
 * @param {String} simulatedType The corresponding mouse event
 * @param {Object} data data to add to event
 * @param {target} target element to trigger the event
 */

const simulateMouseEvent = function(event, simulatedType, data, target) {
	// Ignore multi-touch events
	if (event.originalEvent.touches.length > 1) {
		return;
	}

	event.preventDefault();

	const touch = event.originalEvent.changedTouches[0];
	const simulatedEvent = document.createEvent('MouseEvents');

	// Additional data
	simulatedEvent.touch = true;

	if (data) {
		simulatedEvent.data = data;
	}

	// Initialize the simulated mouse event using the touch events coordinates
	simulatedEvent.initMouseEvent(
		simulatedType, // type
		true, // bubbles
		true, // cancelable
		window, // view
		1, // detail
		touch.screenX, // screenX
		touch.screenY, // screenY
		touch.clientX, // clientX
		touch.clientY, // clientY
		false, // ctrlKey
		false, // altKey
		false, // shiftKey
		false, // metaKey
		0, // button
		null // relatedTarget
	);

	// Dispatch the simulated event to the target element
	if (target) {
		target.dispatchEvent(simulatedEvent);
	} else {
		touch.target.dispatchEvent(simulatedEvent);
	}
};
const createFakeEvent = function(event, fakeEventType, data) {
	// Ignore multi-touch events
	if (event.originalEvent.touches.length > 1) {
		return;
	}

	const evObj = document.createEvent('MouseEvents');
	const touchEvent = event.originalEvent.changedTouches[0];

	evObj.touch = true;

	if (data) {
		evObj.data = data;
	}

	evObj.initMouseEvent(
		fakeEventType, // type
		true, // bubbles
		true, // cancelable
		window, // view
		1, // detail
		touchEvent.screenX, // screenX
		touchEvent.screenY, // screenY
		touchEvent.clientX, // clientX
		touchEvent.clientY, // clientY
		false, // ctrlKey
		false, // altKey
		false, // shiftKey
		false, // metaKey
		0, // button
		null // relatedTarget
	);

	return evObj;
};
/**
 * Traverses upward until it finds element z-index or it reaches top
 * @param {Object} dom object (or jQuery dom object)
 */
const ziterator = function(el) {
	const $el = el instanceof $ ? el : $(el);

	let z = false;
	let $parent = $el;
	let zindex;

	while (z === false) {
		$parent = $parent.parent();
		zindex = $parent.css('z-index');

		if (!isNaN(zindex)) {
			zindex = parseInt(zindex, 10);
		}

		if (typeof zindex !== 'undefined' && zindex !== 'auto') {
			z = true;
		} else if (typeof zindex === 'undefined') {
			z = true;
		}
	}

	return zindex;
};
// mapDropAreas('.hasScrollbar', '.touchDropArea');
const mapDropAreas = function(scrollbarSelector, dropAreaSelector) {
	const scrollContainer = $(scrollbarSelector);
	const touchDropAreas = $(dropAreaSelector);

	let el;
	let $this;
	let i;
	let len;

	if (scrollContainer.length === 1) {
		const scrollTop = scrollContainer.scrollTop();
		const scrollLeft = scrollContainer.scrollLeft();
		const scrollTouchDropAreas = scrollContainer.find(dropAreaSelector);

		for (i = 0, len = scrollTouchDropAreas.length; i < len; i++) {
			el = scrollTouchDropAreas[i];
			$this = $(el);

			$.data(el, 'hasScrollbar', true);
			$.data(el, 'minY', $this.offset().top + scrollTop);
			$.data(el, 'maxY', $this.offset().top + $this.outerHeight() + scrollTop);
			$.data(el, 'minX', $this.offset().left + scrollLeft);
			$.data(el, 'maxX', $this.offset().left + $this.outerWidth() + scrollLeft);
			$this = el = null;
		}
	} else {
		// if multiple .hasScrollbar containers then we need to loop them here
		// not the case atm
	}

	let tid = 0;

	for (i = 0, len = touchDropAreas.length; i < len; i++) {
		el = touchDropAreas[i];
		$this = $(el);
		const hasScrollbar = $this.data('hasScrollbar');

		$.data(el, 'tid', tid);

		if (!hasScrollbar) {
			$.data(el, 'minY', $this.offset().top);
			$.data(el, 'maxY', $this.offset().top + $this.outerHeight());
			$.data(el, 'minX', $this.offset().left);
			$.data(el, 'maxX', $this.offset().left + $this.outerWidth());
		}

		$.data(el, 'zindex', ziterator($this));
		$this = el = null;
		tid++;
	}

	return touchDropAreas;
};
/**
 * Goes through array of droparea objects and checks which is under the mouse currently
 * @param {Object} event object
 * @param {Array} array of droparea objects
 */
const matchDropAreas = function(ev, touchDropAreas) {
	const event = ev.originalEvent;
	const mouseX = event.changedTouches[0].pageX;
	const mouseY = event.changedTouches[0].pageY;
	const matchedDropAreas = [];

	for (let i = 0, len = touchDropAreas.length; i < len; i++) {
		const el = touchDropAreas[i];

		let $el = $(el);
		let data = $.data(el);

		if (mouseX > data.minX && mouseX < data.maxX && mouseY > data.minY && mouseY < data.maxY) {
			matchedDropAreas.push($el);
		}

		data = $el = null;
	}

	return matchedDropAreas;
};
/**
 * Goes through array of droparea objects and checks which has bigger z-index
 * @param {Array} array of droparea objects
 */
const dropAreaPicker = function(arr) {
	if (Array.isArray(arr)) {
		let tid = null;
		let zindex = null;
		let j = 0;

		for (let i = 0, len = arr.length; i < len; i++) {
			const el = arr[i][0];
			const data = $.data(el);

			if (zindex === null || zindex <= data.zindex) {
				if (zindex === data.zindex) {
					if (tid < data.tid) {
						tid = data.tid;
						j = i;
					}
				} else {
					zindex = data.zindex;
					j = i;
				}
			}
		}

		return arr[j];
	} else {
		return false;
	}
};
/**
 * Triggers fake event on droparea
 * @param {Object} event object
 * @param {String} event name to be triggered
 * @param {Object} draggable object
 * @param {target} target element to trigger the event
 */
const triggerFakeEvent = function(ev, type, draggable, target) {
	const evObj = createFakeEvent(ev, type, { types: ['text/plain'] });
	const fakeEvent = { type, currentTarget: target, originalEvent: evObj };

	target.trigger(fakeEvent, draggable);
};

/**
 * Checks if element is being dragged
 * @param {int} Starting X coordinate
 * @param {int} Starting Y coordinate
 * @param {int} Current X coordinate
 * @param {int} Current Y coordinate
 * @param {int} Distance between starting & current position
 */
/* var isDragged = function(startX, startY, currX, currY, distance) {
    var dragging = false;
    distance = (distance) ? distance : 10;

    if (Math.abs(currX - startX) > distance || Math.abs(currY - startY) > distance) {
        dragging = true;
    }

    return dragging;
}; */

/**
 * Checks if user is swiping
 * @param {int} Starting X coordinate
 * @param {int} Starting Y coordinate
 * @param {int} Current X coordinate
 * @param {int} Current Y coordinate
 * @param {int} Distance between starting & current position
 */
const isSwiped = function(startX, startY, currX, currY, distance) {
	let swiping = false;

	const deltaY = Math.abs(currY - startY);
	const deltaX = Math.abs(currX - startX);

	distance = distance ? distance : 10;

	if (deltaY > distance || deltaX > distance) {
		swiping = true;
	}

	return swiping;
};
/**
 * Scrolls scollcontainer element
 * @param {int} Current Y coordinate
 * @param {int} Previous Y coordinate
 * @param {string} Scrollbar element selector
 */
const touchScroll = function(currY, previousY, scrollbarSelector) {
	const $scrollContainer = $(scrollbarSelector);

	previousY = previousY ? previousY : currY;

	const deltaY = currY - previousY;
	const scrollY = $scrollContainer.scrollTop() - deltaY;

	$scrollContainer.scrollTop(scrollY);
};
const _isAllowed = function(config) {
	const allowedTypes = _.isObject(config) && _.isArray(config.type) ? config.type : [];

	return function(types) {
		if (!(_.isObject(types) && types.length)) {
			types = [types];
		}

		let allowed = false;

		for (let i = 0; i < types.length; i++) {
			if (typeof types[i] === 'undefined') {
				allowed = false;
			} else if (
				allowedTypes.length === 0 ||
				(allowedTypes.length === 1 && allowedTypes[0] === '*')
			) {
				allowed = true;
			} else if (types[i] in nativeDragTypes) {
				allowed = Boolean($.inArray(nativeDragTypes[types[i]], allowedTypes) >= 0);
			} else {
				allowed = Boolean($.inArray(types[i], allowedTypes) >= 0);
			}

			if (allowed) {
				break;
			}
		}

		return allowed;
	};
};
const logger = new Pipedrive.Logger('dd');

const dnd = {
	drag: Pipedrive.View.extend({
		/* @TODO: Make & trigger unload method to unbind & remove elements*/
		initialize: function(config) {
			this.options = config;
			this.type = config.type;
			this.el = config.el;
			this.model = config.model;

			this.isAllowed = _isAllowed(config);

			this.render();

			app.global.bind(`ui.touchdrag.${this.model.id}.end`, _.bind(this.touchDragEnd, this));
		},

		render: function() {
			this.$el.attr('draggable', true);

			const self = this;

			this.$el.on('dragstart', function(ev) {
				memory.draggable = self;

				if (_.isFunction(self.options.dragStart)) {
					self.options.dragStart(ev, self);
				}

				if (_.browser('msie')) {
					ev.originalEvent.dataTransfer.setData('Text', 'transfer');
				} else {
					ev.originalEvent.dataTransfer.setData('text/plain', 'transfer');
				}

				return true;
			});

			this.$el.on('drag', function(ev) {
				if (_.isFunction(self.options.drag)) {
					self.options.drag(ev, self);
				}
				// ev.preventDefault();
			});

			this.$el.on('dragend', function(ev) {
				if (_.isFunction(self.options.dragEnd)) {
					self.options.dragEnd(ev, self);
				}

				return false;
			});

			/** Touch screen events */
			let offset = null;

			this.$el.on('touchstart', function(ev) {
				ev.preventDefault();
				self.touchStarted = true;
				self.touchDragPrepared = false;

				const event = ev.originalEvent;
				const pos = self.$el.offset();

				// caching the current x/y
				if (event.changedTouches) {
					self.cachedPos = {
						x: event.pageX,
						y: event.pageY
					};
				} else {
					self.cachedPos = { x: 0, y: 0 };
				}

				if (event.changedTouches) {
					offset = {
						x: event.changedTouches[0].pageX - pos.left,
						y: event.changedTouches[0].pageY - pos.top
					};
				} else {
					offset = { x: 0, y: 0 };
				}

				self.touchTapMonitor = self.setTimeout(function() {
					if (!self.touchStarted) {
						const currX = ev.originalEvent.pageX;
						const currY = ev.originalEvent.pageY;

						// self.dragging = isDragged(self.cachedPos.x,self.cachedPos.y, currX, currY);
						self.swiping = isSwiped(
							self.cachedPos.x,
							self.cachedPos.y,
							currX,
							currY,
							1
						);

						if (!self.dragging && !self.swiping) {
							simulateMouseEvent(ev, 'click', {}, this.$el);
							self.touchTapMonitor = true;
						}
					}
				}, 300);

				if (!self.touchDragMonitor) {
					self.touchDragMonitor = self.setTimeout(function() {
						if (!self.touchDragPrepared && !self.swiping) {
							self.dragging = true;

							clearTimeout(self.touchDragMonitor);
							self.touchDragMonitor = null;

							clearTimeout(self.touchTapMonitor);
							self.touchTapMonitor = null;

							simulateMouseEvent(ev, 'touchdragstart', { types: ['text/plain'] });
							self.touchDragStart(ev, self);
							self.touchDragPrepared = true;

							return true;
						}
					}, 200);
				}
			});

			this.$el.on('touchend', function(ev) {
				/* @TODO: Check for different types of draggables (draggable type) */

				memory.draggable = self;

				// Available, but not used
				// var mouseX = event.changedTouches[0].pageX,
				// mouseY = event.changedTouches[0].pageY;

				/* Triggering drop event on drop areas */
				if (self.touchDropAreas) {
					self.matchedDropAreas = matchDropAreas(ev, self.touchDropAreas);
					self.$currDropArea = dropAreaPicker(self.matchedDropAreas);

					if (self.$currDropArea) {
						triggerFakeEvent(ev, 'drop', memory.draggable, self.$currDropArea);

						app.global.fire(`ui.touchdrag.${self.model.id}.end`, {
							event: ev,
							draggable: memory.draggable
						});
					}
				}

				if (self.dragging) {
					self.touchDragEnd();
				}

				/* If there is  */
				if (!self.dragging && self.touchDragMonitor) {
					clearTimeout(self.touchDragMonitor);
					self.touchDragMonitor = null;
					self.touchDragPrepared = false;
					self.touchDropAreas = null;
					memory.draggable = null;
				}

				if (self.swiping && self.touchTapMonitor) {
					clearTimeout(self.touchTapMonitor);
					self.touchTapMonitor = null;
				}

				self.dragging = false;
				self.touchStarted = false;
				self.previousY = null;
				self.swiping = false;
				$('html').removeClass('touch');
			});

			// eslint-disable-next-line complexity
			this.$el.on('touchmove', function(ev) {
				ev.preventDefault();

				const event = ev.originalEvent;

				// do now allow two touch points to drag the same element
				if (event.targetTouches.length > 1) {
					return;
				}

				const mouseX = event.changedTouches[0].pageX;
				const mouseY = event.changedTouches[0].pageY;

				if (!self.touchDragPrepared) {
					if (!self.swiping) {
						// self.dragging = isDragged(self.cachedPos.x,self.cachedPos.y, mouseX, mouseY);
						self.swiping = isSwiped(
							self.cachedPos.x,
							self.cachedPos.y,
							mouseX,
							mouseY,
							1
						);
					}

					if (self.swiping) {
						touchScroll(mouseY, self.previousY, '.hasScrollbar');
						self.previousY = mouseY;
					}

					if (self.dragging && !self.swiping) {
						clearTimeout(self.touchTapMonitor);
						self.touchTapMonitor = null;
					}
				}

				if (self.dragging && !self.swiping) {
					if (!self.touchDragPrepared) {
						simulateMouseEvent(ev, 'touchdragstart', { types: ['text/plain'] });
						self.touchDragStart(ev, self);
						self.touchDragPrepared = true;
						clearTimeout(self.touchDragMonitor);
						self.touchDragMonitor = null;
					}

					if (self.$ghost) {
						// Because jQuery .css() is 1/3 as fast as .style
						const ghostStyle = self.$ghost[0].style;

						ghostStyle.top = `${mouseY - offset.y}px`;
						ghostStyle.left = `${mouseX - offset.x}px`;
					}

					if (self.touchDropAreas) {
						self.touchMoveMonitor = self.setTimeout(function() {
							/* Get the right droparea under draggable object */
							self.matchedDropAreas = matchDropAreas(ev, self.touchDropAreas);
							self.$currDropArea = dropAreaPicker(self.matchedDropAreas);

							if (self.$currDropArea) {
								if (
									!self.$previousDropArea ||
									$.data(self.$currDropArea[0], 'tid') !==
										$.data(self.$previousDropArea[0], 'tid')
								) {
									/* Trigger dragleave on previous droparea */
									if (self.$previousDropArea) {
										triggerFakeEvent(
											ev,
											'dragleave',
											memory.draggable,
											self.$previousDropArea
										);
									}

									/* Trigger dragenter on current droparea */
									triggerFakeEvent(
										ev,
										'dragenter',
										memory.draggable,
										self.$currDropArea
									);

									self.$previousDropArea = self.$currDropArea;
								}

								/* Trigger dragover on current droparea */
								triggerFakeEvent(
									ev,
									'dragover',
									memory.draggable,
									self.$currDropArea
								);
							}
						}, 150);
					}
				}
			});

			this.$el.on('touchdragstart', function(ev) {
				memory.draggable = self;

				if (_.isFunction(self.options.touchStart)) {
					self.options.touchStart(event, self);
				}

				app.global.fire(`ui.touchdrag.${self.model.id}.start`, {
					event: ev,
					draggable: memory.draggable
				});
			});
		},

		touchDragStart: function() {
			const self = this;

			$('html').addClass('touch');
			// Map all the dropzones
			this.touchMapMonitor = self.setTimeout(function() {
				self.touchDropAreas = mapDropAreas('.hasScrollbar', '.touchDropArea');
			}, 300);

			const pos = self.$el.offset();

			memory.draggable = self;

			this.$ghost = self.$el.clone();
			this.$ghost
				.addClass('ghost')
				.css({
					width: self.$el.width() + 6,
					left: pos.left,
					top: pos.top
				})
				.appendTo('body');
			this.$el.css({ opacity: 0.2 });
		},

		touchDragEnd: function() {
			if (this.$ghost) {
				this.$ghost.remove();
				this.$el.css({ opacity: 1 });
				this.$ghost = null;
			}

			if (_.isFunction(this.options.touchEnd)) {
				this.options.touchEnd(event, this);
			}
		}
	}),

	dropZone: Pipedrive.View.extend({
		/* @TODO: Make & trigger unload method to unbind & remove elements after drop*/
		initialize: function(config) {
			this.options = config;
			this.type = config.type;
			this.el = config.el;

			this.isAllowed = _isAllowed(config);

			this.render();

			app.global.bind('ui.touchdrag.*.start', _.bind(this.showTouchDropArea, this));
			app.global.bind('ui.touchdrag.*.end', _.bind(this.removeTouchDropArea, this));
		},

		isPipeDraggable: function(ev) {
			if (ev.originalEvent) {
				const data = ev.originalEvent[ev.originalEvent.touch ? 'data' : 'dataTransfer'];

				if (!_.isObject(data) || !data.types) {
					return false;
				}

				const type = data.types[0];

				if (type in nativeDragTypes) {
					if (nativeDragTypes[type] === 'draggable') {
						// Go Webkit! yay!
						if (type === 'public.utf8-plain-text') {
							return (
								!_.isEmpty(memory.draggable) &&
								memory.draggable instanceof Backbone.View
							);
						}

						return true;
					}
				} else {
					logger.log('Unknown draggable type', type);
				}
			} else {
				// Not sure when this happens…
				logger.log('no original event', ev);
			}

			return false;
		},

		render: function() {
			const self = this;

			let collection = $();

			// Prevent dragover event when target is valid
			// eslint-disable-next-line complexity
			this.$el.on('dragover', function(ev) {
				if (!_.isObject(ev.originalEvent)) {
					return false;
				}

				const eventDataTransfer = ev.originalEvent.dataTransfer;

				/* Allowed effect of copyMove is not accepted by the container for some reasons
                I'm setting the dropEffect as 'move' for each instance of copyMove to make it work.
                It is set the same way in firefox for example. */
				if (
					!_.browser('msie') &&
					_.isObject(eventDataTransfer) &&
					eventDataTransfer.effectAllowed === 'copyMove' &&
					eventDataTransfer.dropEffect === 'none'
				) {
					eventDataTransfer.dropEffect = 'move';
				}

				if (self.isPipeDraggable(ev)) {
					if (
						memory.draggable &&
						_.isObject(memory.draggable.options) &&
						self.isAllowed(memory.draggable.options.type)
					) {
						ev.preventDefault();

						if (_.isFunction(self.options.dragOver)) {
							self.options.dragOver(ev, memory.draggable);
						}

						return false;
					}
				} else if (
					_.isObject(eventDataTransfer) &&
					self.isAllowed(eventDataTransfer.types)
				) {
					const type = matchNativeDragType(eventDataTransfer.types);

					memory.draggable = {
						type
					};

					ev.preventDefault();

					if (_.isFunction(self.options.dragOver)) {
						self.options.dragOver(ev, memory.draggable);
					}

					return false;
				} else if (!eventDataTransfer) {
					logger.warn('Dragover event has missing data:', ev.originalEvent);
				}
			});

			// Define dndHoverStart event
			this.$el.on('dragenter', function(ev) {
				if (collection.size() === 0) {
					self.$el.trigger('dndHoverStart', ev);
				}

				collection = collection.add(ev.target);

				if (_.isFunction(self.options.dragEnter)) {
					self.options.dragEnter(ev);
				}
			});

			// Define dndHoverEnd event
			this.$el.on('dragleave', function(ev) {
				self.setTimeout(function() {
					collection = collection.not(ev.target);

					if (collection.size() === 0) {
						self.$el.trigger('dndHoverEnd', ev);
					}
				}, 1);
			});

			// Add class 'allowed' when dropzone is valid
			this.$el.on('dndHoverStart', function(ev, originalEvent) {
				const isAllowedMemoryDraggableType =
					self.isPipeDraggable(originalEvent) &&
					self.isAllowed(_.get(memory, 'draggable.options.type'));
				const isAllowedDataTransferType = self.isAllowed(
					_.get(originalEvent, 'originalEvent.dataTransfer.types')
				);

				if (isAllowedMemoryDraggableType || isAllowedDataTransferType) {
					self.$el.addClass('allowed');

					if (_.isFunction(self.options.dragEnter)) {
						self.options.dragEnter(originalEvent, memory.draggable);
					}
				} else {
					logger.log('Unknown droppable', originalEvent);
				}

				originalEvent.stopPropagation();
				originalEvent.preventDefault();

				return false;
			});

			// Remove class 'allowed' when leaving dropzone
			this.$el.on('dndHoverEnd', function(ev, originalEvent) {
				if (_.isFunction(self.options.dragLeave)) {
					self.options.dragLeave(originalEvent, memory.draggable);
				}

				originalEvent.stopPropagation();
				originalEvent.preventDefault();

				return false;
			});

			// Remove class 'allowed' on dropping and trigger drop event
			// eslint-disable-next-line complexity
			this.$el.on('drop', function(ev) {
				if (!_.isObject(ev.originalEvent)) {
					return false;
				}

				const eventDataTransfer = ev.originalEvent.dataTransfer;

				if (self.isPipeDraggable(ev)) {
					ev.preventDefault();

					if (
						memory.draggable &&
						_.isObject(memory.draggable.options) &&
						self.isAllowed(memory.draggable.options.type)
					) {
						self.$el.removeClass('allowed');

						if (_.isFunction(self.options.dragDrop)) {
							self.options.dragDrop(ev, memory.draggable);
						}

						// @TODO: Figure out what kind of event should be triggered on drop
						/* self.trigger('ui.dd.' + '' + '.' + '', {
                            event: ev,
                            target: self,
                            item: memory
                        });*/
					}
				} else if (
					_.isObject(eventDataTransfer) &&
					self.isAllowed(eventDataTransfer.types)
				) {
					ev.preventDefault();

					if (memory.draggable === 'link') {
						memory.draggable.content = eventDataTransfer.getData('text/uri-list');
					} else if (memory.draggable.type === 'files') {
						memory.draggable.content = eventDataTransfer.files;
					} else {
						memory.draggable.content = eventDataTransfer.getData('Text');
					}

					if (_.isFunction(self.options.dragDrop)) {
						self.options.dragDrop(ev, memory.draggable);
					}
				} else {
					logger.log('Dropped unknown object', this, ev, memory);
				}

				return true;
			});
		},

		onUnload: function() {
			this.$el.off('drop dndHoverEnd dndHoverStart dragleave dragenter dragover');
		},

		showTouchDropArea: function(draggable) {
			if (this.$el.is(':visible')) {
				if (this.isPipeDraggable(draggable.event) || dnd.isAllowed('*')) {
					this.$el.trigger('dndHoverStart', draggable.event);

					const $drop = $('<div class="touchDropArea"><span></span></div>');

					if (this.$el.width() > this.$el.height()) {
						$drop.addClass('wide');
					}

					$drop.appendTo(this.$el).on(
						'touchstart',
						_.bind(function(ev) {
							if (memory.draggable && memory.draggable.model) {
								app.global.fire(`ui.touchdrag.${memory.draggable.model.id}.end`);
							}

							simulateMouseEvent(ev, 'drop', { types: ['text/plain'] }, this.el);
						}, this)
					);
				}
			}
		},

		removeTouchDropArea: function(/* draggable */) {
			this.$('.touchDropArea').remove();
		}
	})
};

module.exports = dnd;
