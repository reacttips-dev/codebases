const _ = require('lodash');
const sortUtils = require('utils/sort-utils');
const Pipedrive = require('pipedrive');
const ProductModel = require('models/product');

module.exports = Pipedrive.Collection.extend(
	{
		model: ProductModel,

		relatedModel: null,

		type: 'product',

		pullLimit: 20,

		url: function() {
			let url = `${app.config.api}/products`;

			if (this.options.relatedModel) {
				url = `${app.config.api}/${this.options.relatedModel.type}s/${this.options.relatedModel.id}/products`;
			}

			if (_.isArray(this.options.limitFields)) {
				url = `${url}:(${this.options.limitFields.join(',')})`;
			}

			return url;
		},

		initialize: function(data, options) {
			this.options = options || {};

			if (this.options.relatedModel) {
				app.global.bind('product.model.*.add', this.onProductUpdate, this);
				app.global.bind('product.model.*.update', this.onProductUpdate, this);
				app.global.bind('product.model.*.delete', this.onProductDelete, this);
			}
		},

		onProductUpdate: function(product) {
			const isProductInCollection = this.find({ id: product.id });
			const isProductDeleted = !product.get('active_flag');

			if (!isProductDeleted && !isProductInCollection) {
				this.add(product);
			} else if (isProductInCollection && isProductDeleted) {
				this.remove(isProductInCollection);
			}
		},

		onProductDelete: function(productId) {
			const productInCollection = this.find({ id: productId });

			if (productInCollection) {
				this.remove(productInCollection);
			}
		},

		onUnload: function() {
			app.global.unbind('product.model.*.add', this.onProductUpdate, this);
			app.global.unbind('product.model.*.update', this.onProductUpdate, this);
			app.global.unbind('product.model.*.delete', this.onProductDelete, this);
		},

		pull: function(options) {
			if (options.data && options.data.sort) {
				const removeNameFieldFromSortParameters = true;

				options.data.sort = sortUtils.applySortFieldsMapping(
					options.data.sort,
					removeNameFieldFromSortParameters
				);
			}

			return Pipedrive.Collection.prototype.pull.call(this, options);
		}
	},
	{
		getListApiEndpoint: function() {
			return '/products/list';
		}
	}
);
