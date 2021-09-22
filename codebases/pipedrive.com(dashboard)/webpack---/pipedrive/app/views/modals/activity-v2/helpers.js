const _ = require('lodash');

export const shouldUseActivityModal = (path) => {
	const isActivityRoute = _.startsWith(path, 'activity');
	const isListView = _.endsWith(path, 'list');

	return isActivityRoute && !isListView;
};

/**
 * Cover flow entry point.
 */
export const getFlowView = () => {
	return import(/* webpackChunkName: "tabcontent" */ 'views/shared/flow/compose-activity-v2');
};

export const createFlowOnShow = (self, that) => {
	const noteTab = self.tabsView.getTabView('note', true);
	const $activityEditor = that.tabView.$('.bodyEditor.activityNote');
	const $noteEditor = noteTab.$('.richTextArea .bodyEditor');

	$activityEditor.on(
		'blur keyup paste input',
		_.debounce(() => {
			$noteEditor.html($activityEditor.html()).trigger('input');
		}, 10)
	);

	self.lastActive = 'activity';
	self.syncNoteBetweenTabs(self.wysiwygTabsSelectors.note, self.wysiwygTabsSelectors.activity);
};

export const getActivityWysiwygSelector = () => {
	return '.tabs .bodyEditor.activityNote';
};
