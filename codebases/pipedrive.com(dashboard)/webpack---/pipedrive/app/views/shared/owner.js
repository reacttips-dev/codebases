const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const Company = require('collections/company');
const fieldTemplate = require('templates/shared/owner.html');
const QuickInfoCard = require('views/quick-info-card');
const componentLoader = require('webapp-component-loader');

/**
 * Owner view component with transfer functionality
 *
 * @param  {Object}
 * @class views/shared/Owner
 * @augments module:Pipedrive.View
 */
module.exports = Pipedrive.View.extend({
	template: _.template(fieldTemplate),

	initialize: function() {
		this.setOwnerName();

		Company.ready(
			_.bind(function() {
				this.owner = Company.getUserById(Number(this.model.get(this.userField)));
				this.render();
			}, this)
		);

		this.model.onChange(`${this.userField} owner_name`, this.update, this);
	},

	setOwnerName: function() {
		this.ownerName = this.model.get('owner_name');
		this.userField = this.model.get('owner_id') ? 'owner_id' : 'user_id';
		this.userIsOwner = User.get('id') === this.model.get(this.userField);
		this.canSeeOwner = User.settings.get('can_see_other_users') || this.userIsOwner;

		if (!this.canSeeOwner) {
			this.ownerName = `(${_.gettext('hidden user')})`;
		}
	},

	addQuickInfoCard: function() {
		this.quickInfoCard = new QuickInfoCard({
			el: this.$('.link').get(0),
			id: this.model.get(this.userField),
			type: 'user',
			source: 'owner',
			popoverProps: {
				placement: 'bottom'
			}
		});
	},

	selfRender: function() {
		this.$el.html(this.template(this));

		this.$('.transferOwner')
			.on(
				'click.transferOwner',
				_.bind(async function(ev) {
					ev.preventDefault();

					const popover = await componentLoader.load('webapp:popover');

					popover.open({
						popover: 'changefieldvalue',
						params: {
							model: this.model,
							title: _.gettext('Transfer ownership'),
							fieldKey: this.userField,
							position: 'bottom-end',
							target: ev.delegateTarget,
							offset: 12
						}
					});
				}, this)
			)
			.tooltip({
				tip: _.gettext('Transfer ownership'),
				preDelay: 200,
				postDelay: 200,
				zIndex: 20000,
				fadeOutSpeed: 100,
				position: 'top',
				clickCloses: true
			});
	},

	beforeRender: function() {
		if (this.quickInfoCard) {
			this.quickInfoCard.onDestroy();
		}
	},

	afterRender: function() {
		if (!this.quickInfoCard) {
			this.addQuickInfoCard();
		}
	},

	update: function() {
		const changedFields = _.keys(this.model.changedAttributes());

		if (_.includes(changedFields, this.userField)) {
			this.owner = Company.getUserById(Number(this.model.get(this.userField)));
			this.setOwnerName();
		}

		this.render();
	},

	onDestroy: function() {
		if (this.quickInfoCard) {
			this.quickInfoCard.onDestroy();
		}
	}
});
