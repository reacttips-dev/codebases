const Pipedrive = require('pipedrive');
const _ = require('lodash');
const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const DropMenu = require('views/ui/dropmenu');
const Foldable = require('views/ui/foldable');
const NoteEditorView = require('views/shared/flow/compose-note');
const NoteTemplate = require('templates/shared/flow/note.html');
const $ = require('jquery');
const applyMentionStylesToNote = require('utils/apply-mention-styles-to-note');
const { getCookieValue } = require('@pipedrive/fetch');

module.exports = Pipedrive.View.extend({
	template: _.template(NoteTemplate.replace(/>\s+</g, '><')),
	foldable: null,
	model: null,
	relatedModel: null,

	states: {
		READ: 'read',
		EDIT: 'edit'
	},

	initialize: function(options) {
		this.options = options || {};
		this.relatedModel = options.relatedModel;
		// optional if no model then uses noteText
		this.flowItemModel = this.options.flowItemModel;
		this.noteText = (options && options.noteText) || '';

		this.state = this.states.READ;

		this.noteEditor = new NoteEditorView({
			model: this.options.model,
			relatedModel: this.relatedModel
		});

		this.addView('.noteEditor', this.noteEditor);
		this.render();
		this.model.onChange('last_update_user_id user_id content', this.render, this);
	},

	setFoldable: function() {
		this.foldable = new Foldable({
			el: this.$('.noteWrapper'),
			flowComponent: this.$('.flowComponent'),
			actionButtons: this.$('.actionButtons'),
			lineHeight: 22
		});
	},

	setScrollIfTable: function() {
		const $foldableText = this.$('.foldableText');

		if (this.$('.noteWrapper').find('table').length) {
			$foldableText.css('overflow', 'auto');
		} else if ($foldableText.css('overflow') === 'auto') {
			$foldableText.css('overflow', '');
		}
	},

	onAttachedToDOM: function() {
		this.foldable.showHideReadMore();
	},

	templateHelpers: function() {
		const content = sanitizeHtml(this.fixSessionTokens(this.model.get('content')), {
			replaceLinks: true
		});

		return {
			model: this.model,
			states: this.states,
			state: this.state,
			relativeDate: this.flowItemModel.getRelativeDate('notes'),
			ownerName: this.flowItemModel.getOwnerName(),
			item: this.getOriginItem(),
			editorName: this.model.getEditorName(),
			content,
			noteText: this.noteText
		};
	},

	// There seems to be a bug with session tokens after saving a note, so as a fix for that we can replace the session
	// token with the correct value.
	fixSessionTokens: function(draftContent = '') {
		const sessionToken = getCookieValue('pipe-session-token');

		try {
			return draftContent.replace(/(session_token=).*?"/g, `$1${sessionToken}"`);
		} catch (ignoredError) {
			return draftContent;
		}
	},

	afterRender: function() {
		this.createNoteSettings();
		this.lastEditUpdateTooltip();
		this.setFoldable();
		this.setScrollIfTable();
		this.showTooltips();
		this.createImageFancyboxes();

		if (this.state === this.states.READ) {
			applyMentionStylesToNote(this.el);
		}
	},

	lastEditUpdateTooltip: function() {
		if (this.model.getEditorName()) {
			this.$('[data-tooltip]').each(function() {
				$(this).tooltip({
					tip: this.getAttribute('data-tooltip'),
					preDelay: 200,
					postDelay: 200,
					zIndex: 20000,
					fadeOutSpeed: 100,
					position: 'top',
					clickCloses: true
				});
			});
		}
	},

	showTooltips: function() {
		this.$('.actionButtons button').each((key, el) => {
			$(el).tooltip({
				tip: $(el).data('tooltip'),
				preDelay: 0,
				postDelay: 0,
				zIndex: 20000,
				fadeOutSpeed: 100,
				position: 'top'
			});
		});
	},

	getOriginItem: function() {
		let item;

		if (
			_.includes(['organization', 'person'], this.relatedModel.type) &&
			this.model.get('deal_id')
		) {
			item = {
				type: 'deal',
				name: this.model.get('deal').title,
				url: `/deal/${this.model.get('deal_id')}`
			};
		} else if (
			_.includes(['organization', 'person'], this.relatedModel.type) &&
			this.model.get('lead_id') &&
			this.model.get('lead')
		) {
			item = {
				type: 'lead',
				name: this.model.get('lead').title,
				url: `/leads/inbox/${this.model.get('lead_id')}`
			};
		} else if (this.relatedModel.type === 'organization' && this.model.get('person_id')) {
			item = {
				type: 'person',
				name: this.model.get('person').name,
				url: `/person/${this.model.get('person_id')}`
			};
		}

		return item;
	},

	createNoteSettings: function() {
		if (this.state === this.states.READ && this.model) {
			const self = this;

			this.selectSettings = new DropMenu({
				target: this.$('.selectSettingsButton[data-type=note]'),
				ui: 'arrowDropmenu',
				alignRight: true,
				getContentOnOpen: true,
				activeOnClick: false,
				onOpen: function(d, dropMenuCallback) {
					const data = [];

					data.push({
						title: _.gettext('Edit'),
						className: 'edit',
						click: _.bind(self.edit, self)
					});

					// if note is pinned
					const pinnedAttribute = `pinned_to_${self.relatedModel.type}_flag`;

					if (self.model.get(pinnedAttribute)) {
						data.push({
							title: _.gettext('Unpin this note'),
							className: 'unpinNote',
							click: function() {
								const data = {};

								data[pinnedAttribute] = false;
								self.model.save(data);
							}
						});
					} else {
						data.push({
							title: _.gettext('Pin this note'),
							className: 'pinNote',
							click: function() {
								const data = {};

								data[pinnedAttribute] = true;
								self.model.save(data);
							}
						});
					}

					data.push({
						title: _.gettext('Delete'),
						className: 'delete',
						click: function() {
							if (window.confirm(_.gettext('Are you sure?'))) {
								self.model.destroy();
							}
						}
					});

					d.config.data = data;
					dropMenuCallback();
				}
			});
		}
	},

	edit: function() {
		this.noteEditor.on('noteEditorClosed', _.bind(this.closeEdit, this));
		this.foldable.unload();
		this.state = this.states.EDIT;
		this.render();
		this.noteEditor.focusContentEditable();
	},

	closeEdit: function() {
		this.noteEditor.off('noteEditorClose');
		this.state = this.states.READ;
		this.render();
	},

	onUnload: function() {
		this.foldable.unload();
	},

	createImageFancyboxes: function() {
		const images = this.$('.noteWrapper a > img');

		$.each(images, (index, img) => {
			const $img = $(img);

			const $a = $img.parent();
			const imgLink = $a.attr('href');

			$a.fancybox({
				minWidth: 40,
				minHeight: 40,
				openEffect: 'none',
				closeEffect: 'none',
				type: 'image',
				href: imgLink
			});
		});
	}
});
