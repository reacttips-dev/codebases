const Pipedrive = require('pipedrive');
const _ = require('lodash');
const Company = require('collections/company');
const User = require('models/user');
const Helpers = require('utils/helpers');
const Exif = require('exif-js');
const Cookies = require('js-cookie');
const $ = require('jquery');

/**
 * File model
 *
 * @param  {Object}
 * @class models/File
 * @augments module:Pipedrive.Pipedrive.Model
 */

/**
 * Static reference to all possible File states
 *
 * @type {Object}
 * @alias models/File.states
 * @static
 * @enum
 */

const states = {
	LOCAL_FILE: 'local file',
	UPLOADING: 'uploading',
	READY: 'ready',
	ERROR_UPLOAD: 'error upload',
	ERROR_UNSUPPORTED: 'unsupported',
	ERROR_OVERSIZE: 'oversize',
	ERROR_GOOGLE: 'error google'
};
const FileModel = Pipedrive.Model.extend(
	/** @lends models/File.prototype */ {
		type: 'file',
		allowDirectSync: true,
		readonly: [
			'state',
			'url',
			'product_name',
			'deal_name',
			'org_name',
			'loading',
			'person_name',
			'people_name' /* @TODO: remove 'people_name' property after Sept 15, 2014 (it will be deprecated in the API) */
		],

		defaults: {
			grouped: false
		},

		urlRoot: `${app.config.api}/files`,

		/**
		 * Content of locally browsed file
		 * @type {String}
		 */
		file: null,

		/**
		 * Is the file uploading process finished
		 * @type {Boolean}
		 */
		done: false,

		/**
		 * Default options. override in constructor
		 * @enum
		 */
		options: {
			/** reference to local file to be uploaded */
			file: null,

			/** reference to google file to be linked */
			gfile: null,

			/** should start upload to server after adding to list */
			autoUpload: false,

			/** callback function */
			unsupported: null,
			done: null,

			/** object of attributes which will be sent to server when uploading */
			uploadAttributes: {},

			/** when linking google files */
			relatedModel: null,

			/** old stuff */
			lastModifiedDate: null
		},

		initialize: function(attributes, options) {
			this.options = _.assignIn(_.clone(this.options), options);

			if (this.options.gfile && this.options.relatedModel) {
				// you must provide relatedModel when importing new google file
				this.linkGoogleFile();
			} else if (this.options.file) {
				this.setLocalFile(this.options.file);
			} else {
				this.setState(states.READY);
			}

			this.selfUpdateFromSocket();
			this.selfDeleteFromSocket();
		},

		/**
		 * Get human readable file size like: "24 kB", "2.5MB"
		 * @return {String}
		 */
		getHumanizedFileSize: function() {
			const size = this.get('file_size') || this.get('size');

			return Helpers.combineHumanizedFileSize(size);
		},

		/**
		 * Returns the cid of the inline attachments, cleaned of unnecessary characters
		 * or the id of the attachment if no cid given (in case of the old, migrated files).
		 * @return {String}
		 */
		getCid: function() {
			return this.get('cid') ? this.get('cid').replace(/<|>|cid:/gi, '') : this.get('id');
		},

		/**
		 * get file owner name
		 * @return {String}
		 */
		getOwnerName: function() {
			const id = this.get('user_id');
			const user = Company.getUserById(id);

			return user ? user.get('name') : `(${_.gettext('hidden user')})`;
		},

		/**
		 * Get file type (generic for images)
		 * @return {String}
		 */
		getType: function() {
			let fileType = this.get('file_type');

			const isImageFile = _.includes(
				['img', 'png', 'jpg', 'jpeg', 'gif'],
				this.get('file_type')
			);

			if (isImageFile) {
				fileType = 'img';
			}

			return fileType;
		},

		/**
		 * Get file URL
		 * @return {String}
		 */
		getUrl: function() {
			let url = `${this.get('url')}?session_token=${Cookies.get('pipe-session-token')}`;

			if (this.get('url').includes('api-proxy')) {
				// Files added via marketplace application + websocket have wrong domain
				url = this.get('url').replace('api-proxy', 'app');
			}

			if (this.getType() === 'img') {
				// this is a hack to get google images to show up in fancybox
				url = `${url}&direct_download=1`;
			}

			return url;
		},

		/**
		 * Start uploading file to server
		 * @param  {Object} attributes to be send to server with file upload
		 * @param  {Object} options
		 */
		uploadFile: function(attributes, options) {
			if (this.get('state') !== states.LOCAL_FILE) {
				return;
			}

			if (
				this.get('size') &&
				this.get('size') > (User.additionalData.max_upload_size_bytes || 50e6)
			) {
				this.done = true;
				this.setState(states.ERROR_OVERSIZE);

				if (options && _.isFunction(options.error)) {
					options.error(states.ERROR_OVERSIZE);
				}

				return;
			}

			const self = this;
			const formData = new FormData();

			formData.append('file', this.blob || this.file);

			const data = _.assignIn({}, this.options.uploadAttributes, attributes);

			Helpers.addObjectToFormData(formData, data);

			this.setState(states.UPLOADING);

			this.uploadXhr = this.save(null, {
				formData,
				fileUpload: true,
				success: function(m) {
					self.onNewFileComplete();

					// old callback system
					if (options && _.isFunction(options.success)) {
						options.success(m);
					}
				},
				error: function(m, model, request) {
					self.done = true;

					self.setState(states.ERROR_UPLOAD);

					if (options && _.isFunction(options.error)) {
						options.error(m, model, request.xhr);
					}
				}
			});
		},

		isInline: function() {
			return this.get('inline_flag') || _.get(this, 'options.uploadAttributes.inline_flag');
		},

		hasExtension: function(extentions = []) {
			const extension = this.get('name')
				.split('.')
				.pop();

			return extentions.includes(extension);
		},

		/**
		 * Link existing google file to given relatedModel
		 * @param  {object} gfile
		 * @param  {object} options
		 * @void
		 */
		linkGoogleFile: function() {
			this.setState(states.UPLOADING);

			const self = this;
			const gfile = this.options.gfile;

			this.save(
				{
					remote_id: gfile.id,
					remote_location: 'googledrive',
					item_type: this.options.relatedModel.type,
					item_id: this.options.relatedModel.id
				},
				{
					url: `${app.config.api}/files/remoteLink`,
					success: _.bind(function(m) {
						self.onNewFileComplete();

						if (_.isFunction(this.options.success)) {
							this.options.success(m);
						}
					}, this),
					error: _.bind(function(m) {
						self.setState(states.ERROR_GOOGLE);

						if (_.isFunction(this.options.error)) {
							this.options.error(m);
						}
					}, this)
				}
			);

			// data for rendering until response arrives
			this.set({
				name: gfile.name,
				size: Number(gfile.sizeBytes),
				url: gfile.url,
				remote_id: gfile.id,
				loading: 90
			});
		},

		/**
		 * create new Google file and link it to relatedModel
		 * @param  {object} data
		 * @param  {object} options
		 * @void
		 */
		createGoogleFile: function(data, options) {
			this.setState(states.UPLOADING);

			const self = this;

			this.save(
				{
					file_type: data.type,
					title: data.title,
					remote_location: 'googledrive',
					item_type: options.relatedModel.type,
					item_id: options.relatedModel.id
				},
				{
					url: `${app.config.api}/files/remote`,
					success: function(m) {
						self.onNewFileComplete();

						if (_.isFunction(options && options.success)) {
							options.success(m);
						}
					},
					error: function(m) {
						self.setState(states.ERROR_GOOGLE);

						if (_.isFunction(options && options.error)) {
							options.error(m);
						}
					}
				}
			);

			// data used for rendering until response arrives
			this.set({
				name: data.title,
				loading: 90
			});
		},

		/**
		 * Cancel upload progress or remove file from server
		 * @param  {Object} options
		 * @return {XMLHttpRequest} Returns XHR object
		 */
		destroy: function(options) {
			this.cancelUpload();

			// eslint-disable-next-line no-undef
			return Backbone.Model.prototype.destroy.call(this, options);
		},

		/**
		 * Cancel upload progress
		 * @void
		 */
		cancelUpload: function() {
			if (this.uploadXhr) {
				this.uploadXhr.abort();
				this.uploadXhr = null;
			}
		},

		// privates
		setLocalFile: function(file) {
			const self = this;

			this.file = file;
			this.done = false;

			this.set({
				name: file.name,
				type: file.type,
				size: file.size,
				loading: 0
			});

			// old API :/
			if (this.options.lastModifiedDate) {
				this.set('lastModifiedDate', this.options.lastModifiedDate);
			}

			this.setState(states.LOCAL_FILE);

			Exif.getData(this.file, function() {
				if (this.exifdata) {
					self.orientation = this.exifdata.Orientation;
				}
			});

			this.readLocalFile();
		},

		readLocalFile: function() {
			try {
				// reader is only used for checking file access and type
				this.reader = new FileReader();
				this.reader.readAsDataURL(this.file);
				this.readerOnload(false);
			} catch (e) {
				this.setState(states.ERROR_UNSUPPORTED);

				// old callback system
				if (this.options.unsupported) {
					this.options.unsupported(e);
				}
			}
		},

		setOrientation: function(dataSrc) {
			if (!this.orientation || this.orientation === 1) {
				return;
			}

			const self = this;
			const canvas = document.createElement('canvas');
			const img = document.createElement('img');

			img.src = dataSrc;

			$(img).on('load', function() {
				// 90° rotation needs swap
				if (self.orientation < 5) {
					canvas.width = this.width;
					canvas.height = this.height;
				} else {
					canvas.width = this.height;
					canvas.height = this.width;
				}

				const ctx = canvas.getContext('2d');

				ctx.translate(canvas.width / 2, canvas.height / 2);
				self.rotationSpecifications(self.orientation, ctx);

				ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);

				self.dataURItoBlob(canvas.toDataURL());
			});
		},

		rotationSpecifications: function(orientation, ctx) {
			switch (orientation) {
				case 2:
					// horizontal flip
					ctx.scale(-1, 1);
					break;
				case 3:
					// 180° rotate left
					ctx.rotate(Math.PI);
					break;
				case 4:
					// vertical flip
					ctx.scale(1, -1);
					break;
				case 5:
					// vertical flip + 90 rotate right
					ctx.rotate(Math.PI / 2);
					ctx.scale(1, -1);
					break;
				case 6:
					// 90° rotate right
					ctx.rotate(Math.PI / 2);
					break;
				case 7:
					// horizontal flip + 90 rotate right
					ctx.rotate(Math.PI / 2);
					ctx.scale(-1, 1);
					break;
				case 8:
					// 90° rotate left
					ctx.rotate(-(Math.PI / 2));
					break;
				default:
					break;
			}
		},

		/**
		 * Creates a blob object out of canvas dataURI
		 * @param  {String} dataURI
		 * @void
		 * resource: https://gist.github.com/davoclavo/4424731
		 */
		dataURItoBlob: function(dataURI) {
			const dataUriSplit = dataURI.split(',');

			// convert base64 to raw binary data held in a string

			const byteString = window.atob(dataUriSplit[1]);

			// separate out the mime component

			const mimeString = dataUriSplit[0].split(':')[1].split(';')[0];

			// write the bytes of the string to an ArrayBuffer
			// eslint-disable-next-line no-undef

			const arrayBuffer = new ArrayBuffer(byteString.length);

			// eslint-disable-next-line no-undef

			const _ia = new Uint8Array(arrayBuffer);

			for (let i = 0; i < byteString.length; i++) {
				_ia[i] = byteString.charCodeAt(i);
			}
			// eslint-disable-next-line no-undef
			const dataView = new DataView(arrayBuffer);

			this.blob = new Blob([dataView], { type: mimeString });

			this.reader = new FileReader();
			this.reader.readAsDataURL(this.blob);
			this.readerOnload(true);
		},

		readerOnload: function(isOrientationChanged) {
			this.reader.onload = _.bind(function() {
				if (!isOrientationChanged) {
					this.setOrientation(this.reader.result);
				}

				if (this.options.autoUpload) {
					this.uploadFile();
				}

				// old callback system
				if (this.options.done) {
					this.options.done(this);
				}
			}, this);
		},

		onNewFileComplete: function() {
			this.done = true;
			this.set({ loading: 100 }, { silent: true });
			this.setState(states.READY);

			this.selfUpdateFromSocket();
			this.selfDeleteFromSocket();
		},

		// helpers
		setState: function(state) {
			this.set('state', state, { updateReadonly: true });
		}
	},
	{
		states
	}
);

module.exports = FileModel;
