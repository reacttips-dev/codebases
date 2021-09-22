const $ = require('jquery');
const _ = require('lodash');
const wysiwygHelpers = {
	dropDargetHideTimer: null,
	handleAttachmentDrag: function(isDragging, ev) {
		const $editorEl = this.$('.bodyEditor');
		const $wrapperEl = this.getWrapperEl($editorEl);
		const $target = $(ev.target);
		const $footerEl = this.$('.composer__footer');
		const isDropAllowed = this.dropAllowed(ev);

		if (this.isDragIndicatorsNeeded({ target: $target, wrapperEl: $wrapperEl })) {
			return false;
		}

		if (!isDropAllowed) {
			const dataTransfer = this.getEventDatatransferObj(ev);

			ev.preventDefault();

			if (dataTransfer) {
				dataTransfer.effectAllowed = 'none';
				dataTransfer.dropEffect = 'none';
			}
		}

		$wrapperEl.removeClass('filedropping dropActive');
		$footerEl.removeClass('filedropping dropActive');

		if (isDragging) {
			$wrapperEl.addClass('filedropping');
			$footerEl.addClass('filedropping');

			isDropAllowed && this.showActiveDropStyles($target);
		} else {
			$wrapperEl.removeClass('filedropping dropActive');
			$footerEl.removeClass('filedropping dropActive');
		}

		clearTimeout(this.dropDargetHideTimer);

		if (isDragging) {
			this.dropDargetHideTimer = setTimeout(() => {
				this.handleAttachmentDrag(false, ev);
			}, 100);
		}
	},

	getWrapperEl: function(editorEl) {
		let $wrapperEl = editorEl.parent();

		if ($('#modal').length) {
			$wrapperEl = $('#modal').find('.bodyEditorWrapper');
		}

		return $wrapperEl;
	},

	isDragIndicatorsNeeded: function(params) {
		return (
			!params.wrapperEl.length ||
			params.target.parents('.bodyEditor').hasClass('in-editor-drag') ||
			params.target.hasClass('in-editor-drag')
		);
	},

	getEventDatatransferObj: function(ev) {
		return _.get(ev, 'originalEvent.dataTransfer') || _.get(ev, 'dataTransfer');
	},

	dropAllowed: function(ev) {
		return !!$(ev.target).closest('[data-drop-allowed]').length;
	},

	showActiveDropStyles: function($target) {
		const $editorEl = this.$('.bodyEditor');
		const $footerEl = this.$('.composer__footer');
		const $wrapperEl = this.getWrapperEl($editorEl);

		// check if target parent is bodyEditor
		// if not then we drag the file over composer footer
		if ($target[0].closest('.bodyEditor') === $editorEl[0]) {
			$wrapperEl.addClass('dropActive');
		} else {
			$footerEl.addClass('dropActive');
		}
	}
};

module.exports = wysiwygHelpers;
