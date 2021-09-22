const Pipedrive = require('pipedrive');
const _ = require('lodash');
const FileModel = require('models/file');
const GoogleFiles = require('utils/google-files');
const $ = require('jquery');

/**
 * Files collection
 *
 * @param  {Object}
 * @class collections/Files
 * @augments module:Pipedrive.Pipedrive.Collection
 */

module.exports = Pipedrive.Collection.extend(
	/** @lends collections/Files.prototype */ {
		model: FileModel,

		type: 'files',

		fileBrowseInput: null,

		browseFilesOptions: null,

		initialize: function() {
			this.fileBrowseInput = this.getFilesBrowseInput();
		},

		parse: function(response) {
			return response.data;
		},

		/**
		 * Open "add files" browser dialog as if clicking file input
		 * @param {object} options Attributes additional parameters to be sent to server on file upload
		 */
		browseFiles: function(options) {
			this.fileBrowseInput = this.fileBrowseInput || this.getFilesBrowseInput();

			this.browseFilesOptions = options || {};
			this.fileBrowseInput.val('').click();
		},

		getFilesBrowseInput: function() {
			return $('<input type="file" multiple="multiple">').on(
				'change',
				function(ev) {
					this.addLocalFiles(ev.target.files, this.browseFilesOptions);
				}.bind(this)
			);
		},

		/**
		 * Open "select files" modal dialog to select files from google.
		 * @param {object} options Attributes additional parameters to be sent to server on file upload
		 */
		browseGoogleFiles: function(options) {
			GoogleFiles.browseFiles(
				_.bind(function(files) {
					this.addGoogleFiles(files, options);
				}, this)
			);
		},

		/**
		 * Add list of local files
		 * @param {files} array file
		 * @param {object} options Passed when creating file model. .uploadAttributes is
		 * special property for providing extra values to object
		 */
		addLocalFiles: function(files, options) {
			_.forEach(
				files,
				_.bind(function(file) {
					this.addLocalFile(file, options);
				}, this)
			);
		},

		/**
		 * Upload not uploaded files
		 * @param {object} options Passed when uploading file model. .uploadAttributes is
		 * special property for providing extra values to object
		 */
		uploadLocalFiles: function(options) {
			this.each(
				_.bind(function(fileModel) {
					if (fileModel.get('state') === FileModel.states.LOCAL_FILE) {
						fileModel.uploadFile(null, options);
					}
				}, this)
			);
		},

		/**
		 * Add local file, from < input type="file" > control
		 * @param {file} file
		 * @param {object} options Passed when creating file model. .uploadAttributes is
		 * special property for providing extra values to object
		 *
		 * @example
		 * <caption>add new files to collection with browser dialog</caption>
		 * this.collection.browseFiles({
		 *    autoUpload:true,
		 *    uploadAttributes: {
		 *        deal_id: this.dealModel.get('id')
		 *    }
		 * });
		 */
		addLocalFile: function(file, options) {
			const model = new FileModel(
				null,
				_.assignIn(
					{
						file
					},
					options
				)
			);

			this.add(model);
		},

		/**
		 * Add files from google drive.
		 * @param {array} gfiles
		 * @param {object} options
		 */
		addGoogleFiles: function(gfiles, options) {
			_.forEach(
				gfiles,
				_.bind(function(gfile) {
					this.addGoogleFile(gfile, options);
				}, this)
			);
		},

		/**
		 * Add one file from google drive.
		 * @param {object} google file object
		 * @param {object} options
		 */
		addGoogleFile: function(gfile, options) {
			const model = new FileModel(
				null,
				_.assignIn(
					{
						gfile
					},
					options
				)
			);

			this.add(model);
		},

		isFileUploadInProgress: function() {
			const filesUploading = this.where({ state: 'uploading' });

			return !!filesUploading.length;
		},

		/**
		 * Returns attachments with inline_flag set 0 for the draft.
		 * 'file.options.uploadAttributes.inline_flag' is set when uploading new file.
		 * @void
		 */
		getNonInlineAttachments: function() {
			const realAttachments = this.filter(function(file) {
				return !file.isInline();
			});

			return realAttachments;
		}
	}
);
