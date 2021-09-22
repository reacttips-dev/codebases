const _ = require('lodash');
const User = require('models/user');
const Pipedrive = require('pipedrive');
const { Sortable } = require('sortablejs');
const SidebarViewTemplate = require('templates/shared/sidebar-view.html');
const SidebarOrderTemplate = require('templates/shared/sidebar-manage.html');
const $ = require('jquery');

module.exports = Pipedrive.View.extend({
	templates: {
		view: _.template(SidebarViewTemplate),
		manage: _.template(SidebarOrderTemplate)
	},

	defaultBlockData: [],

	blockSettingName: '',

	states: {
		VIEW: 'view',
		MANAGE: 'manage'
	},

	state: 'view',

	sortable: null,

	canEditCustomFields: function() {
		return (
			User.get('is_admin') ||
			User.settings.get('can_add_custom_fields') ||
			User.settings.get('can_edit_custom_fields') ||
			User.settings.get('can_delete_custom_fields')
		);
	},

	initialize() {
		this.on('setState', ({ state }) => {
			if (state !== this.states.MANAGE) {
				if (this.sortable) {
					this.sortable.destroy();
				}
			}

			if (state === this.states.MANAGE) {
				this.onManageViewLoad();
			}
		});
	},

	onManageViewLoad: function() {},

	getState: function() {
		return this.state;
	},

	setState: function(state) {
		if (this.state !== state && _.includes(this.states, state)) {
			this.state = state;

			this.$el.toggleClass(this.states.MANAGE, false);
			$('.mainBlock .content').toggleClass(this.states.MANAGE, false);

			this.trigger('setState', { state });

			this.render();
		}
	},

	/**
	 * Retrieve the block settings.
	 * @return {object}
	 */
	getBlockSettings: function() {
		return User.settings.get(this.blockSettingName);
	},

	saveCurrentBlockSettings: function() {
		if (this.state === this.states.MANAGE) {
			const blockSettings = _.concat(this.fixedBlocks || []);

			this.$('.widget.manage').each(function() {
				const $el = $(this);
				const key = $el.data('key');
				const visible = $el.find('input[name="visible"]').is(':checked');

				blockSettings.push({
					type: key,
					visible
				});
			});

			_.forEach(this.defaultBlockData, (block) => {
				const hasSetting = _.find(blockSettings, (blockSetting) => {
					return blockSetting.type === block.key;
				});

				if (!hasSetting) {
					if (!block.ignored) {
						blockSettings.push({
							type: block.key,
							visible: false
						});

						return;
					}

					blockSettings.unshift({
						type: block.key,
						visible: true,
						fixed: true
					});
				}
			});

			const saveData = {};

			saveData[this.blockSettingName] = blockSettings;

			User.settings.save(saveData);

			this.setState(this.states.VIEW);
		}
	},

	getBlockData: function() {
		const blockData = _.clone(this.defaultBlockData);

		return this.applyBlockSettings(blockData);
	},

	/**
	 * Applies settings and reorders the blocks from company settings.
	 * @param  {array} blockData Raw block data
	 * @return {array}           Block data with settings applied
	 */
	applyBlockSettings: function(blockData) {
		const blockSettings = this.getBlockSettings();

		_.forEach(blockData, (block) => {
			const blockSetting = _.find(blockSettings, (blockSetting) => {
				return blockSetting.type === block.key;
			});

			if (blockSetting) {
				block.ignored = blockSetting.fixed;

				block.visible = blockSetting && blockSetting.visible;
			}
		});

		blockData = this.sortBlockData(blockData, blockSettings);

		return blockData;
	},

	/**
	 * Sorts the blocks by the order string.
	 * If the block is not represented in the string it is appended to the end of the new order using the current
	 * position(if there are more than one missing).
	 * @param  {array}  blockData Block data array to be sorted. Must contain objects and objects must have
	 * the attribute 'name'
	 * @return {array}            Result of the sorting. Contains everything that was in original blockData
	 */
	sortBlockData: function(blockData, blockSettings) {
		const savedBlocks = blockSettings.map((block) => block.type);

		blockData = _.sortBy(blockData, (block, key) => {
			if (block.ignored) {
				return false;
			}

			let position = _.findIndex(blockSettings, (blockSetting) => {
				return (
					blockSetting.type === block.key ||
					(this.isAppExtensionsBlockType(block.key) &&
						!_.includes(savedBlocks, block.key))
				);
			});

			if (position === -1) {
				position = key + blockData.length;
			}

			return position;
		});

		return blockData;
	},

	templateHelpers: function() {
		return {
			blockData: this.getBlockData()
		};
	},

	selfRender: function(...args) {
		this.template = this.templates[this.state];
		Pipedrive.View.prototype.selfRender.apply(this, ...args);
	},

	onLoad: function() {
		this.render();
	},

	afterRender: function() {
		if (this.state === this.states.MANAGE) {
			this.sortable = new Sortable(this.el, {
				draggable: '.manage',
				ghostClass: 'ghost',
				filter: 'input',
				onStart: function() {
					app.global.fire('ui.dnd.dropzone.disable');
				},
				onEnd: function() {
					app.global.fire('ui.dnd.dropzone.enable');
				}
			});

			this.$('.saveBlockSettings').on('click', _.bind(this.saveCurrentBlockSettings, this));
			this.$('.cancelBlockSettings').on(
				'click',
				_.bind(this.setState, this, this.states.VIEW)
			);
			this.$('input[name="visible"]').on('change', _.bind(this.toggleVisible, this));

			this.$el.toggleClass(this.states.MANAGE, true);
			$('.mainBlock .content').toggleClass(this.states.MANAGE, true);
		}
	},

	toggleVisible: function(ev) {
		const $checkbox = $(ev.currentTarget);
		const checked = $checkbox.is(':checked');

		$checkbox.closest('.widget').attr('data-visible', checked);
	},

	toggleManageSidebar: function() {
		this.setState(this.states.MANAGE, true);
	},

	/**
	 * Checks with unique app extensions panels key (`appExtensions-${clientId}-${id}`).
	 *
	 * @param blockKey
	 * @returns {boolean}
	 */
	isAppExtensionsBlockType: (blockKey) => {
		return _.startsWith(blockKey, 'appExtensions');
	},

	beforeAddBlockData: function() {},

	/**
	 * Adds new element to defaultBlockData set.
	 *
	 * @returns {boolean}
	 * @param panels
	 */
	addBlockData(panels) {
		this.beforeAddBlockData();

		panels.map((panel) => {
			const key = `appExtensions-${panel.client_id}-${panel.id}`;
			const name = panel.name;
			const visible = panel.user_settings ? !!panel.user_settings.is_visible : true;
			const isBlockExists = !!_.find(this.defaultBlockData, (block) => {
				return block.key === key;
			});

			if (!isBlockExists) {
				this.defaultBlockData = [
					{
						key,
						name,
						className: key,
						visible
					},
					...this.defaultBlockData
				];
			}
		});

		this.render();
	}
});
