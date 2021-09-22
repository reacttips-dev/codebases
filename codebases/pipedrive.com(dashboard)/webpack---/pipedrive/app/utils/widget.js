const _ = require('lodash');
const widget = {
	getScrollBarWidth: function() {
		const scrollDiv = document.createElement('div');

		scrollDiv.id = 'measureScrollBar';
		document.body.appendChild(scrollDiv);

		// Get the scrollbar width
		const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.scrollWidth;

		// Delete the DIV
		document.body.removeChild(scrollDiv);

		return scrollbarWidth;
	},
	makeid: function() {
		let text = '';

		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < 8; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return text;
	}
};

_.widget = widget;
_.makeid = widget.makeid;
