export default (gettext, completeStage) => ([
	{
		stageKey: 'signup_action',
		title: gettext('Sign up to Pipedrive'),
		subtitle: gettext('to get the ball rollin’'),
		excludeFromProgress: true,
	},
	{
		stageKey: 'add_deal_or_contact_action',
		title: gettext('Import your data'),
		subtitle: gettext('or add deals and contacts manually'),
		url: '/settings/import',
		target: '_self',
		importEnabled: true,
	},
	{
		stageKey: 'add_deal_or_contact_action',
		title: gettext('Import your data'),
		subtitle: gettext('or add deals and contacts manually'),
		url: 'https://pipedrive.hubs.vidyard.com/watch/y5HxrbuSNjtq5doAEL5r5U',
		target: 'video',
		importEnabled: false,
		excludeFromProgress: true,
	},
	{
		stageKey: 'has_synced_email_action',
		title: gettext('Sync your email'),
		subtitle: gettext('to link emails to deals automatically'),
		url: '/mail/inbox',
		target: '_self',
	},
	{
		stageKey: 'has_set_up_leadbooster',
		title: gettext('Set up LeadBooster'),
		subtitle: gettext('to collect new leads from your website'),
		url: '/leads/leadbooster',
		target: '_self',
		forFeatures: {
			leadbooster_addon: true,
		},
	},
	{
		stageKey: 'has_invited_a_new_user_action',
		title: gettext('Invite your team'),
		subtitle: gettext('to get everyone on the same page'),
		url: '/settings/users/add',
		target: '_self',
		forAdmins: true,
	},
	{
		stageKey: 'mobile_device_used_action',
		title: gettext('Install our mobile app'),
		subtitle: gettext('to manage your sales from anywhere'),
		url: 'https://www.pipedrive.com/features/mobile-apps',
		target: '_blank',
	},
	{
		stageKey: 'has_synced_with_google_cal_action',
		title: gettext('Sync with Google Calendar'),
		subtitle: gettext('to avoid scheduling conflicts'),
		url: '/settings/gcal',
		target: '_self',
		forFeatures: {
			nylas_calendar_sync: false,
		},
	},
	{
		stageKey: 'has_synced_with_google_cal_action',
		title: gettext('Sync your calendar'),
		subtitle: gettext('to avoid scheduling conflicts'),
		url: '/settings/calendar-sync',
		target: '_self',
		forFeatures: {
			nylas_calendar_sync: true,
		},
	},
	{
		stageKey: 'has_checked_integrations_action',
		title: gettext('Check out apps & integrations'),
		subtitle: gettext('to enhance your Pipedrive experience'),
		url: 'https://marketplace.pipedrive.com',
		target: '_blank',
		onClick: () => {
			completeStage('has_checked_integrations_action');
		},
	},
]);
