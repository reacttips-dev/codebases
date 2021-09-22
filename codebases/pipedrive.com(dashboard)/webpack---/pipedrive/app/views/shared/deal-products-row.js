const Pipedrive = require('pipedrive');
const _ = require('lodash');
const Formatter = require('utils/formatter');
const ProductModel = require('models/product');
const { PdWysiwyg, LinkHandlerPlugin } = require('@pipedrive/pd-wysiwyg');
const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const WysiwygTranslations = require('utils/wysiwyg-translations');
const User = require('models/user');
const Template = require('templates/shared/deal-products-row.html');
const $ = require('jquery');

/**
 * Deal Products component one row
 *
 * @param  {Object} options - you must pass in deal
 * @class views/shared/DealProductsRow
 * @augments module:Pipedrive.View
 */

module.exports = Pipedrive.View.extend(
	/** @lends views/shared/DealProductsRow.prototype */
	{
		template: _.template(Template),

		/**
		 * is note open
		 * @type {Boolean}
		 */
		noteOpen: false,

		/**
		 * listening to add new deal currency changes
		 * @type {String}
		 */
		currency: null,

		contentEditable: null,

		initialize: function() {
			this.product = new ProductModel({ id: this.model.get('product_id') });
			this.product.pull({
				success: _.bind(function() {
					this.model.variations = this.product.get('product_variations');
					this.model.product = this.product;
					this.render();
				}, this)
			});

			this.currency = this.model.deal.get('currency');
		},

		/**
		 * toggle product enabled
		 * @void
		 */
		toggleEnabled: function() {
			this.model.set('enabled_flag', !this.model.get('enabled_flag'));
			this.saveWithDelay();
			this.render();
		},

		/**
		 * does row have comments
		 * @return {Boolean}
		 */
		hasComments: function() {
			return this.model.get('comments');
		},

		/**
		 * show comments
		 * @void
		 */
		showComments: function() {
			if (!this.noteOpen) {
				this.noteOpen = true;
				this.render();
			}
		},

		/**
		 * hide comments
		 * @void
		 */
		hideComments: function() {
			if (this.noteOpen) {
				this.noteOpen = false;
				this.render();
			}
		},

		/**
		 * toggle comments
		 * @void
		 */
		toggleComment: function() {
			this.noteOpen = !this.noteOpen;
			this.render();

			if (this.noteOpen && !this.hasComments()) {
				this.$('.richTextArea .bodyEditor').focus();
			}
		},

		isNewDeal: function() {
			return this.model.deal.isNew();
		},

		getItemPrice: function() {
			let price = this.model.get('item_price');

			if (this.canSetVariationPrice()) {
				const variation = _.find(this.model.variations, {
					id: this.model.get('product_variation_id')
				});
				const variationPrice = _.find(variation.prices, { currency: this.currency });

				price =
					variationPrice && variationPrice.price === price ? variationPrice.price : price;
			} else if (this.canSetPredefinedPrice(price) && _.isUndefined(price)) {
				price = this.getPredefinedPrice();
			} else if (_.isUndefined(price)) {
				price = 0;
			}

			this.model.set('item_price', price);

			return price;
		},

		getPredefinedPrice: function() {
			return _.find(this.product.get('prices'), { currency: this.currency }).price;
		},

		canSetVariationPrice: function() {
			const variationSelected = this.model.get('product_variation_id');
			const variationsFeature = User.companyFeatures.get('price_variations');

			return this.isNewDeal() && variationsFeature && variationSelected;
		},

		canSetPredefinedPrice: function(price) {
			const variationSelected = this.model.get('product_variation_id');
			const predefinedPrice = _.find(this.product.get('prices'), { currency: this.currency });

			return (
				this.isNewDeal() &&
				!variationSelected &&
				predefinedPrice &&
				predefinedPrice.price !== price
			);
		},

		templateHelpers: function() {
			const formattedPrice = Formatter.format(this.getItemPrice(), this.currency, true);

			return {
				model: this.model,
				comments: sanitizeHtml(this.model.get('comments')),
				productsToNewDeal: this.isNewDeal(),
				productName: this.model.get('name') || this.model.product.get('name'),
				itemPrice: this.isNewDeal() ? String(this.getItemPrice()) : formattedPrice,
				hasDurations: User.companyFeatures.get('product_duration'),
				hasVariations: User.companyFeatures.get('price_variations'),
				formattedSum: Formatter.format(this.model.getSum(), this.currency),
				hasComments: this.hasComments(),
				noteOpen: this.noteOpen,
				quantity: String(this.model.get('quantity')),
				duration: String(this.model.get('duration')),
				discount: String(this.model.get('discount_percentage'))
			};
		},

		afterRender: function() {
			this.$('input').on('change keyup input', _.bind(this.onInputUpdated, this));
			this.$('select').on('change', _.bind(this.onVariationChanged, this));

			this.$('.toggle').click(_.bind(this.toggleEnabled, this));
			this.$('.btn.note').click(_.bind(this.toggleComment, this));
			this.$('.remove').click(_.bind(this.remove, this));

			if (this.noteOpen) {
				this.contentEditable = new PdWysiwyg({
					editorEl: this.$('.richTextArea .bodyEditor')[0],
					toolbarEl: this.$('.editorToolbar')[0],
					translations: WysiwygTranslations.getTranslations(),
					placeholder: _.gettext('Write here...'),
					focusAndPlaceholder: true,
					sanitizePasteData: true,
					sanitizeHtml: (html, loose, removeStyle, replaceLinks) =>
						sanitizeHtml(html, { loose, removeStyle, replaceLinks }),
					plugins: [LinkHandlerPlugin]
				});

				this.$('.richTextArea .bodyEditor').on(
					'keyup input',
					_.bind(this.onNoteChanged, this)
				);
			}

			this.createEditorTooltips();

			this.model.deal.onChange('currency', this.currencyChange, this);
		},

		createEditorTooltips: function() {
			this.$('.richTextArea .editorToolbar a').each((key, el) => {
				$(el).tooltip({
					tip: $(el).data('editor-tooltip'),
					preDelay: 0,
					postDelay: 0,
					zIndex: 20000,
					fadeOutSpeed: 100,
					position: 'top'
				});
			});
		},

		currencyChange: function(model) {
			this.currency = model.get('currency');
			this.render();
		},

		onNoteChanged: function() {
			const text = this.contentEditable.getParsedContent();

			this.model.set('comments', text);
			this.saveWithDelay();
			this.$('.btn.note').toggleClass('exists', !!text);
		},

		onInputUpdated: function(ev) {
			const key = $(ev.target).attr('name');
			const value = $(ev.target).val();

			this.model.set(key, Formatter.unformat(value));

			if (!this.isNewDeal()) {
				this.saveWithDelay();
			}

			// update sum without render - preserves input focus
			this.$('.sum').text(Formatter.format(this.model.getSum(), this.currency));
		},

		onVariationChanged: function(ev) {
			this.model.setVariation($(ev.target).val());
			this.model.deal.set('currency', this.currency);
			this.render();

			if (!this.isNewDeal()) {
				this.saveWithDelay();
			}
		},

		saveWithDelay: function() {
			clearTimeout(this.saveDelayId);
			// do NOT use this.setTimeout - we need to save changes even when modal is closed
			this.saveDelayId = setTimeout(
				_.bind(function() {
					if (this.saveDelayRequest && _.isFunction(this.saveDelayRequest.abort)) {
						this.saveDelayRequest.abort();
					}

					this.saveDelayRequest = this.model.save();
				}, this),
				1000
			);
		},

		remove: function() {
			this.model.destroy();
		},

		onUnload: function() {
			if (this.contentEditable) {
				this.contentEditable.unload();
			}
		}
	}
);
