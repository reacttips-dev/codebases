function noop() {}

function elements(chartInstance) {
	// Turn the elements object into an array of elements
	var elements = chartInstance.annotation.elements;
	return Object.keys(elements).map(function(id) {
		return elements[id];
	});
}

function objectId() {
	return Math.random().toString(36).substr(2, 6);
}

function isValid(rawValue) {
	if (rawValue === null || typeof rawValue === 'undefined') {
		return false;
	} else if (typeof rawValue === 'number') {
		return isFinite(rawValue);
	} else {
		return !!rawValue;
	}
}

function decorate(obj, prop, func) {
	var prefix = '$';
	if (!obj[prefix + prop]) {
		if (obj[prop]) {
			obj[prefix + prop] = obj[prop].bind(obj);
			obj[prop] = function() {
				var args = [ obj[prefix + prop] ].concat(Array.prototype.slice.call(arguments));
				return func.apply(obj, args);
			};
		} else {
			obj[prop] = function() {
				var args = [ undefined ].concat(Array.prototype.slice.call(arguments));
				return func.apply(obj, args);
			};
		}
	}
}

function callEach(fns, method) {
	fns.forEach(function(fn) {
		(method ? fn[method] : fn)();
	});
}

function getEventHandlerName(eventName) {
	return 'on' + eventName[0].toUpperCase() + eventName.substring(1);
}

function createMouseEvent(type, previousEvent) {
	try {
		return new MouseEvent(type, previousEvent);
	} catch (exception) {
		try {
			var m = document.createEvent('MouseEvent');
			m.initMouseEvent(
				type,
				previousEvent.canBubble,
				previousEvent.cancelable,
				previousEvent.view,
				previousEvent.detail,
				previousEvent.screenX,
				previousEvent.screenY,
				previousEvent.clientX,
				previousEvent.clientY,
				previousEvent.ctrlKey,
				previousEvent.altKey,
				previousEvent.shiftKey,
				previousEvent.metaKey,
				previousEvent.button,
				previousEvent.relatedTarget
			);
			return m;
		} catch (exception2) {
			var e = document.createEvent('Event');
			e.initEvent(
				type,
				previousEvent.canBubble,
				previousEvent.cancelable
			);
			return e;
		}
	}
}

module.exports = function(Chart) {
	var chartHelpers = Chart.helpers;

	function initConfig(config) {
		config = chartHelpers.configMerge(Chart.Annotation.defaults, config);
		if (chartHelpers.isArray(config.annotations)) {
			config.annotations.forEach(function(annotation) {
				annotation.label = chartHelpers.configMerge(Chart.Annotation.labelDefaults, annotation.label);
			});
		}
		return config;
	}

	function getScaleLimits(scaleId, annotations, scaleMin, scaleMax) {
		var ranges = annotations.filter(function(annotation) {
			return !!annotation._model.ranges[scaleId];
		}).map(function(annotation) {
			return annotation._model.ranges[scaleId];
		});

		var min = ranges.map(function(range) {
			return Number(range.min);
		}).reduce(function(a, b) {
			return isFinite(b) && !isNaN(b) && b < a ? b : a;
		}, scaleMin);

		var max = ranges.map(function(range) {
			return Number(range.max);
		}).reduce(function(a, b) {
			return isFinite(b) && !isNaN(b) && b > a ? b : a;
		}, scaleMax);

		return {
			min: min,
			max: max
		};
	}

	function adjustScaleRange(scale) {
		// Adjust the scale range to include annotation values
		var range = getScaleLimits(scale.id, elements(scale.chart), scale.min, scale.max);
		if (typeof scale.options.ticks.min === 'undefined' && typeof scale.options.ticks.suggestedMin === 'undefined') {
			scale.min = range.min;
		}
		if (typeof scale.options.ticks.max === 'undefined' && typeof scale.options.ticks.suggestedMax === 'undefined') {
			scale.max = range.max;
		}
		if (scale.handleTickRangeOptions) {
			scale.handleTickRangeOptions();
		}
	}

	function getNearestItems(annotations, position) {
		var minDistance = Number.POSITIVE_INFINITY;

		return annotations
			.filter(function(element) {
				return element.inRange(position.x, position.y);
			})
			.reduce(function(nearestItems, element) {
				var center = element.getCenterPoint();
				var distance = chartHelpers.distanceBetweenPoints(position, center);

				if (distance < minDistance) {
					nearestItems = [element];
					minDistance = distance;
				} else if (distance === minDistance) {
					// Can have multiple items at the same distance in which case we sort by size
					nearestItems.push(element);
				}

				return nearestItems;
			}, [])
			.sort(function(a, b) {
				// If there are multiple elements equally close,
				// sort them by size, then by index
				var sizeA = a.getArea(), sizeB = b.getArea();
				return (sizeA > sizeB || sizeA < sizeB) ? sizeA - sizeB : a._index - b._index;
			})
			.slice(0, 1)[0]; // return only the top item
	}

	return {
		initConfig: initConfig,
		elements: elements,
		callEach: callEach,
		noop: noop,
		objectId: objectId,
		isValid: isValid,
		decorate: decorate,
		adjustScaleRange: adjustScaleRange,
		getNearestItems: getNearestItems,
		getEventHandlerName: getEventHandlerName,
		createMouseEvent: createMouseEvent
	};
};

