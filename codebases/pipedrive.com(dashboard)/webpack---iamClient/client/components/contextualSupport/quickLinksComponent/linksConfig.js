import urls from 'constants/urls';

export default function linksConfig(getText, userLang) {
	return [
		{
			name: getText('Help center home'),
			icon: 'help',
			link: urls.helpCenter,
			id: 'help_center',
		},
		{
			name: getText('Knowledge Base'),
			icon: 'knowledge',
			link: `https://support.pipedrive.com/${userLang}`,
			id: 'knowledge_base',
		},
		{
			name: getText('Academy training videos'),
			icon: 'education',
			link: `https://www.pipedrive.com/${userLang}/academy?ref=contextual_support`,
			id: 'academy',
		},
		{
			name: getText('Community'),
			icon: 'community',
			link: urls.community,
			id: 'community',
		},
		{
			name: getText('What’s new'),
			icon: 'news',
			link: urls.communityNews,
			id: 'community_news',
		},
	];
}