const Pipedrive = require('pipedrive');
const _ = require('lodash');
const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const User = require('models/user');
const DropMenu = require('views/ui/dropmenu');
const NoteEditorView = require('views/shared/flow/compose-note');
const PinnedNoteTemplate = require('templates/shared/pinnednote.html');
const moment = require('moment');
const $ = require('jquery');
const applyMentionStylesToNote = require('utils/apply-mention-styles-to-note');
const FlowInlineCommentsView = require('views/flow-inline-comments/index');

module.exports = Pipedrive.View.extend({
	tagName: 'div',
	template: _.template(PinnedNoteTemplate),
	foldable: null,
	isPinnedNoteOpen: false,

	states: {
		READ: 'read',
		EDIT: 'edit'
	},

	initialize: function(options) {
		this.options = options;
		this.relatedModel = options.relatedModel;
		this.state = this.states.READ;

		this.$el.addClass('pinnedNoteWrapper');

		this.noteEditor = new NoteEditorView({
			model: this.options.model,
			relatedModel: this.relatedModel
		});

		this.addView('.noteEditor', this.noteEditor);

		this.render();

		this.model.onChange('content', () => {
			this.render();
		});
	},

	showFullInfo: function(expandedByDefault) {
		return function() {
			this.isPinnedNoteOpen = true;
			this.render();

			this.$('.noteContentWrapper')
				.removeClass('closed')
				.addClass('open');

			this.addFlowInlineComments(expandedByDefault);
		};
	},

	getText: function() {
		const html = this.model.get('content');

		return $('<div>')
			.html(sanitizeHtml(html))
			.text();
	},

	unpinNote: function() {
		const self = this;

		this.model.save(`pinned_to_${this.relatedModel.type}_flag`, false, {
			success: function() {
				self.$el.remove();
			}
		});
	},

	setScrollIfTable: function() {
		const $foldableText = this.$('.foldableText');

		if (this.$('.noteContentWrapper').find('table').length) {
			$foldableText.css('overflow', 'auto');
		} else if ($foldableText.css('overflow') === 'auto') {
			$foldableText.css('overflow', '');
		}
	},

	hideFullInfo: function(ev) {
		this.isPinnedNoteOpen = false;
		this.render();

		if (ev) {
			ev.stopPropagation();
		}

		this.trigger('hide');
		this.$('.noteContentWrapper')
			.removeClass('open')
			.addClass('closed');
	},

	createPinnedNoteSettings: function() {
		if (this.state === this.states.READ && this.model) {
			const self = this;

			this.selectSettings = new DropMenu({
				target: this.$('.selectPinnedNoteSettings[data-type=note]'),
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
					}

					d.config.data = data;
					dropMenuCallback();
				}
			});
		}
	},

	edit: function() {
		this.noteEditor.on('noteEditorClosed', _.bind(this.closeEdit, this));
		this.state = this.states.EDIT;
		this.render();
	},

	closeEdit: function() {
		this.noteEditor.off('noteEditorClose');
		this.state = this.states.READ;
		this.render();
	},

	showTooltips: function() {
		this.$('.actionButtons button span').each((key, el) => {
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

	templateHelpers: function() {
		const commentsCount = this.model.get('comments');
		const commentsCountText =
			commentsCount && commentsCount.count > 0
				? _.ngettext('%d comment', '%d comments', commentsCount.count, commentsCount.count)
				: null;

		return {
			addedTime: _.interactiveTimestamp(
				moment.utc(this.model.get('add_time')).local(),
				'notes',
				false
			),
			name: this.getNoteCreatorName(),
			content: sanitizeHtml(this.model.get('content'), { replaceLinks: true }),
			text: this.getText(),
			isNoteOpen: this.isPinnedNoteOpen,
			states: this.states,
			state: this.state,
			commentsCountText,
			commentsEnabled: User.companyFeatures.get('comments')
		};
	},

	getNoteCreatorName: function() {
		if (this.model.get('user')) {
			return this.model.get('user').name;
		}

		if (this.model.get('user_id') === User.get('id')) {
			return User.get('name');
		}

		return `(${_.gettext('hidden user')})`;
	},

	afterRender: function() {
		this.$('.expand').on('click.pinnedNoteOpen', _.bind(this.showFullInfo(), this));
		this.$('.commentsInfo').on('click.commentsInfo', _.bind(this.showFullInfo(true), this));
		this.$('.collapse').on('click.pinnedNoteClose', _.bind(this.hideFullInfo, this));
		this.$('.unpinIcon').on('click.unpinNote', _.bind(this.unpinNote, this));
		this.showTooltips();
		this.setScrollIfTable();
		this.createPinnedNoteSettings();
		applyMentionStylesToNote(this.el);
	},

	addFlowInlineComments: function(expandedByDefault) {
		if (
			!User.companyFeatures.get('comments') ||
			!this.$('.flowItemComments')[0] ||
			!this.isPinnedNoteOpen
		) {
			return;
		}

		this.$('.flowItemComments').addClass('visible');
		this.$('.number-of-comments').hide();

		const commentSummary = this.model.get('comments');

		this.flowInlineCommentsView = new FlowInlineCommentsView({
			el: this.$('.flowItemComments').get(0),
			rootObjectType: this.relatedModel.type,
			rootObjectId: this.relatedModel.get('id'),
			objectType: 'note',
			objectId: this.model.get('id'),
			commentsSummary: commentSummary,
			expandedByDefault,
			onCommentAdded: () => {
				commentSummary.count++;
			},
			onCommentDeleted: () => {
				commentSummary.count--;
			}
		});
	}
});
