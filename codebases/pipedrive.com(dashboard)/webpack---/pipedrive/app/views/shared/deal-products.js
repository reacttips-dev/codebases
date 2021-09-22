const Pipedrive = require('pipedrive');
const _ = require('lodash');
const DealModel = require('models/deal');
const User = require('models/user');
const Product = require('models/deal/product');
const DealProductModel = require('models/deal-product');
const ProductsCollection = require('collections/products');
const DealProductsCollection = require('collections/deal-products');
const CollectionView = require('views/collectionview');
const RowView = require('views/shared/deal-products-row');
const Template = require('templates/shared/deal-products.html');
const { format } = require('utils/formatter');
const $ = require('jquery');

/**
 * Deal Products component. Supports adding, editing, removing deal-products relations and values.
 *
 * @param  {Object} options - you must pass in deal
 * @class views/shared/DealProducts
 * @augments module:Pipedrive.View
 */
module.exports = Pipedrive.View.extend(
	/** @lends views/shared/DealProducts.prototype */
	{
		template: _.template(Template),

		/**
		 * Collection of deal-products
		 * @type {collections/DealProducts}
		 */
		collection: null,

		/**
		 * Deal whos products are edited
		 * @type {models/Deal}
		 */
		deal: null,

		/**
		 * Shows if comments are expanded or not
		 * @type {Boolean}
		 */
		comments: false,

		/**
		 * If to show selectbox for selecting products or search
		 * @type {Boolean}
		 */
		useSelectbox: false,

		/**
		 * Deal products rows rendering
		 * @type {views/CollectionView}
		 */
		rowsCollectionView: null,

		initialize: function(options) {
			// models
			if (options.deal instanceof DealModel) {
				this.deal = options.deal;
			} else {
				this.deal = new DealModel({
					id: options.deal
				});
			}

			this.ready = Pipedrive.Ready(
				['companyProductsCollection', 'dealProductsCollection'],
				_.bind(this.render, this)
			);
			this.collection = new DealProductsCollection(null, {
				deal: this.deal
			});
			this.canAddProducts = User.settings.get('can_add_products');

			// components
			this.rowsCollectionView = new CollectionView(
				{
					collection: this.collection,
					childView: RowView,
					callViewRender: false,
					callCollectionPull: false,
					tagName: 'tbody'
				},
				{
					tagName: 'tr'
				}
			);

			this.views = {
				'.rowsCollectionView': this.rowsCollectionView
			};

			this.collection.on('add remove', this.updateRows, this);
			this.collection.on('remove change:comments', this.updateCommentsLink, this);
			this.collection.onChange(
				'item_price quantity discount_percentage enabled_flag duration',
				this.updateValues,
				this
			);

			// startup
			if (!this.isNewDeal()) {
				const dealIsReady = _.keys(this.deal.attributes).length > 1;

				if (dealIsReady) {
					this.getDealProductsCollection();
				} else {
					this.deal.pull({
						success: _.bind(this.getDealProductsCollection, this)
					});
				}
			}

			const self = this;

			if (this.isNewDeal()) {
				this.deal.on('sync', () => {
					if (self.deal.productView) {
						_.forEach(self.collection.models, (product) => {
							product.save();
						});
					}
				});
			} else if (!this.isNewDeal() && !this.canAddProducts) {
				this.noResult = '';
				this.productsCollection = new ProductsCollection();
				this.productsCollection.pull({
					success: function(productsCollection) {
						const productsLength = productsCollection.length;
						const hasProducts = productsLength !== 0;
						const productsOverHundred = productsLength > 100;
						const hasMoreItemsInCollection =
							productsCollection.additionalData.pagination.more_items_in_collection;

						if (
							!hasProducts ||
							(hasProducts && !productsOverHundred && !hasMoreItemsInCollection)
						) {
							self.useSelectbox = true;
							self.noResult = hasProducts
								? ''
								: _.gettext('There are no products available in your company');
							self.generateProductSelect();
						}

						self.productsCollection.ready = true;
						self.ready.set('companyProductsCollection');
					}
				});
			} else {
				self.ready.set('companyProductsCollection');
			}

			this.render();
		},

		isNewDeal: function() {
			return this.deal.isNew();
		},

		/**
		 * toggle expand or hide comments on all rows
		 * @void
		 */
		toggleComments: function() {
			this.comments = !this.comments;

			_.forEach(
				this.rowsCollectionView.views,
				_.bind(function(row) {
					if (this.comments && row.hasComments()) {
						row.showComments();
					} else {
						row.hideComments();
					}
				}, this)
			);

			this.render();
		},

		templateHelpers: function() {
			const hasDurations = User.companyFeatures.get('product_duration');
			const hasVariations = User.companyFeatures.get('price_variations');

			let templateHelpers = {};

			templateHelpers = {
				hasDurations,
				hasVariations,
				onProductChange: _.bind(this.onProductChange, this),
				onProductSelect: _.bind(this.onProductSelect, this),
				canAddProducts: this.canAddProducts,
				collectionsReady: this.isCollectionReady(),
				useSelectbox: this.useSelectbox,
				noResult: this.noResult,
				deal: this.deal,
				collection: this.collection,
				comments: this.comments,
				totalSum: this.isNewDeal()
					? this.collection.getTotalSum()
					: format(this.collection.getTotalSum(), this.deal.get('currency'))
			};

			templateHelpers = _.assignIn(templateHelpers, this.getColumnTitles());

			return templateHelpers;
		},

		isCollectionReady: function() {
			if (this.isNewDeal()) {
				return true;
			} else {
				return (
					(!this.canAddProducts &&
						this.productsCollection.ready &&
						this.collection.ready) ||
					(this.canAddProducts && this.collection.ready)
				);
			}
		},

		getColumnTitles: function() {
			const titles = {};

			if (this.isNewDeal()) {
				titles.totalQuantityText = `${_.gettext('Total products')}: `;
				titles.totalSumText = `${_.gettext('Sum')}: `;
				titles.quantityText = `${_.gettext('Qty')}. `;
				titles.discountText = `${_.gettext('Disc')}. %`;
				titles.durationText = `${_.gettext('Dur')}.`;
			} else {
				titles.totalQuantityText = `${_.gettext('Total quantity')}: `;
				titles.totalSumText = `${_.gettext('Total sum')}: `;
				titles.quantityText = `${_.gettext('quantity')}`;
				titles.discountText = `${_.gettext('discount')}. %`;
				titles.durationText = `${_.gettext('duration')}.`;
			}

			return titles;
		},

		afterRender: function() {
			if (!this.canAddProducts && !this.isNewDeal()) {
				this.generateProductSelect();
			}

			this.$('.addProduct input').keyup(_.bind(this.onProductKeyup, this));
			this.$('.comments').click(_.bind(this.toggleComments, this));
			this.$('.newProduct a').click(_.bind(this.addNewProduct, this));
			this.listenTo(this.deal, 'change:currency', this.updateValues);
		},

		/**
		 * Pull collection of deal products.
		 * Setting ready 'dealProductsCollection'
		 * @void
		 */
		getDealProductsCollection: function() {
			const self = this;

			this.collection.pull({
				success: function() {
					self.collection.ready = true;
					self.ready.set('dealProductsCollection');
				}
			});
		},

		updateRows: function() {
			const hasItemsInCollection = Boolean(this.collection.length);
			const isTableRendered = Boolean(this.$('table').length);

			if (hasItemsInCollection === isTableRendered) {
				this.updateValues();
			} else {
				this.render();
			}
		},

		updateValues: function() {
			const updateTimeout = this.setTimeout(
				_.bind(function() {
					this.$('.total .quantity').text(this.collection.getTotalQuantity());
					this.$('.total .value').text(
						format(this.collection.getTotalSum(), this.deal.get('currency'))
					);
					clearTimeout(updateTimeout);
				}, this),
				200
			);
		},

		updateCommentsLink: function() {
			this.$('.comments').toggleClass('hidden', !this.collection.hasComments());
		},

		/**
		 * Generate select2 dropdown from company's products collection
		 * @void
		 */
		generateProductSelect: function() {
			const self = this;

			_.forEach(this.productsCollection.models, (product) => {
				const productName = self.$('.addProduct select[name="products"]');

				if (!product.get('selectable')) {
					return;
				}

				productName.append($('<option>', { value: product.id }).text(product.get('name')));
			});

			this.$('.addProduct select[name="products"]')
				.off('change')
				.on('change', (el) => {
					self.onProductChange(
						_.find(self.productsCollection.models, { id: parseInt(el.val, 10) })
					);
					$('.addProduct select[name="products"] option[value="default"]').attr(
						'selected',
						true
					);
					$('.addProduct select[name="products"]').select2();
				});
		},

		onProductKeyup: function() {
			const name = this.$('.addProduct input').val();

			if (!name) {
				this.$('.newProduct').hide();
			}
		},

		onProductSelect: function(result) {
			const name = this.$('.addProduct input').val();

			if (!result && name.length > 1) {
				this.$('.newProduct').show();
			}
		},

		onProductChange: function(productModel, el, ev) {
			if (ev && ev.type === 'blur') {
				return;
			}

			this.$('.newProduct').hide();

			if (productModel && this.isNewDeal()) {
				this.addNewDealProductToNonExistingDeal(productModel);
				this.$('.addProduct input').val('');
			} else if (productModel) {
				this.collection.addExistingProduct(productModel);
				this.$('.addProduct input').val('');
			}
		},

		addNewProduct: function() {
			if (this.$('.newProduct a').hasClass('disabled')) {
				return;
			}

			this.$('.newProduct a').addClass('disabled');

			if (this.isNewDeal()) {
				const product = new Product({
					name: this.$('.addProduct input').val()
				});

				product.save(null, {
					success: _.bind(function() {
						this.addNewDealProductToNonExistingDeal(product);
						this.onProductAdded();
					}, this)
				});

				return;
			}

			const name = this.$('.addProduct input').val();

			this.collection.addNewProduct(name, _.bind(this.onProductAdded, this));
		},

		addNewDealProductToNonExistingDeal: function(product) {
			const dealProduct = new DealProductModel(
				{
					product_id: product.id || product.get('id'),
					name: product.get('name')
				},
				{
					product,
					deal: this.deal,
					collection: this.collection
				}
			);

			this.collection.add(dealProduct);
		},

		onProductAdded: function() {
			this.$('.addProduct input').val('');
			this.$('.newProduct').hide();
			this.$('.newProduct a').removeClass('disabled');
		}
	}
);
