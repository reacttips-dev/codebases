class UsageTracking {
	constructor(options) {
		this.options = options;
	}

	phoneFieldValueCLicked(data) {
		data = {
			container_component: 'contextual_sidebar',
			field_type: 'phone',
			field_subtype: 'pseudo',
			field_link_syntax: this.options.API.userSelf.settings.get('callto_link_syntax'),
			object_id: data.objectId,
			object_type: data.objectType,
			parent_object_id: this.options.threadId,
			parent_object_type: 'mail_thread',
			mail_thread_id: this.options.threadId,
			filter_id: null
		};

		this.sendMetrics('field_component', 'value_clicked', data);
	}

	sendMetrics(component, action, data) {
		this.options.API.pdMetrics.trackUsage(null, component, action, data);
	}
}

export default UsageTracking;
