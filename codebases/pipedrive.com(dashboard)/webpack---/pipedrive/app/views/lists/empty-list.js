'use strict';

const Pipedrive = require('pipedrive');
const User = require('models/user');
const emptyListTemplate = require('templates/lists/empty-list.html');
const l10n = require('l10n');
const _ = require('lodash');

/**
 * Pipedrive ListsView Empty View
 */
module.exports = Pipedrive.View.extend(
	/** @lends views/lists/EmptyView */ {
		template: _.template(emptyListTemplate),

		initialize: function(options) {
			this.options = options || {};
			this.collection = this.options.collection;
			this.listSettings = this.options.listSettings;
			this.filtersCollection = this.listSettings.filtersCollection;

			this.collection.on('sync', this.render, this);

			this.setFilter(this.listSettings.getFilter());

			this.$el.on(
				'click.emptyListEditFilter',
				'.emptyListEditFilter',
				this.options.showFilter
			);
		},

		/**
		 * Set filter to be used in the template to show edit link if the filter is editable
		 * @param {Object} filter
		 * @void
		 */
		setFilter: function(filter) {
			this.filterUrl = `${this.options.listUrl}/${filter.type}/${filter.value}/edit`;

			if (filter.type !== 'filter') {
				filter = false;
			}

			this.filter = filter;
		},

		render: function() {
			if (this.collection.length > 0) {
				return;
			}

			// If you can't edit filter, no point showing link to edit modal
			const activeFilterId = parseInt(this.filter.value, 10);

			if (this.filtersCollection && !this.filtersCollection.canEdit(activeFilterId)) {
				this.filter = false;
			}

			const createDataText = this.getCreateDataText();

			this.$el.html(
				this.template({
					type: this.collection.type,
					collection: this.collection,
					listUrl: this.options.listUrl,
					userIsAdmin: User.attributes.is_admin,
					createDataText,
					filterId: User.id,
					filterUrl: this.filterUrl,
					filter: this.filter,
					l10n
				})
			);
		},

		getCreateDataText: function() {
			if (this.collection.hasActiveFilter) {
				return '';
			}

			const isAdmin = User.attributes.is_admin;
			const type = this.collection.type;
			const canAddProducts = User.settings.get('can_add_products');
			const createLinkStart = `<a href="#dialog/${type}/add">`;
			const importLinkStart = '<a href="/import">';
			const linkEnd = '</a>';
			const adminMessages = {
				organization: _.gettext('%sCreate new organization%s or %simport data%s', [
					createLinkStart,
					linkEnd,
					importLinkStart,
					linkEnd
				]),
				deal: _.gettext('%sCreate new deal%s or %simport data%s', [
					createLinkStart,
					linkEnd,
					importLinkStart,
					linkEnd
				]),
				person: _.gettext('%sCreate new person%s or %simport data%s', [
					createLinkStart,
					linkEnd,
					importLinkStart,
					linkEnd
				]),
				product: _.gettext('%sCreate new product%s or %simport data%s', [
					createLinkStart,
					linkEnd,
					importLinkStart,
					linkEnd
				])
			};
			const regularMessages = {
				organization: _.gettext('%sCreate new organization%s', [createLinkStart, linkEnd]),
				deal: _.gettext('%sCreate new deal%s', [createLinkStart, linkEnd]),
				person: _.gettext('%sCreate new person%s', [createLinkStart, linkEnd]),
				product: _.gettext('%sCreate new product%s', [createLinkStart, linkEnd])
			};

			if (isAdmin) {
				return adminMessages[type];
			} else if (type !== 'product' || canAddProducts) {
				return regularMessages[type];
			}
		}
	}
);
