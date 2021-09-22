import getTranslator from '@pipedrive/translator-client/fe';

const translator = {
	/* eslint-disable no-unused-vars */
	npgettext: (context, s1, s2, count) => s1,
	pgettext: (context, string) => string,
	ngettext: (s1, s2, count) => s1,
	gettext: (s) => s,
	/* eslint-enable no-unused-vars */

	init: async (language) => {
		const client = await getTranslator('search-fe', language);

		translator.gettext = client.gettext.bind(client);
		translator.ngettext = client.ngettext.bind(client);
		translator.pgettext = client.pgettext.bind(client);
		translator.npgettext = client.npgettext.bind(client);
	},
};

export default translator;
