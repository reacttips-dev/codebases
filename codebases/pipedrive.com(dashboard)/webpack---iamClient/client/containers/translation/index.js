import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TranslatorClient from '@pipedrive/translator-client';
import getTranslator from '@pipedrive/translator-client/fe';
import logger from 'utils/logger';
import getLanguageCode from 'utils/getLanguageCode';

// Current implementation of translator-client@3.0.1 only logs with 'error' level
// This is a temporary hack until we have the possibility to specify logging levels via the library
// https://github.com/pipedrive/translator-client/blob/efce248ded79735f3b322024599f210b857b2816/fe-es8.js#L20-L61
const hackyLogger = {
	remote(level, message, data) {
		switch (message) {
			case 'Bad response from translator-hub':
				logger.remote('warning', message, data);
				break;
			default:
				logger.remote(level, message, data);
				break;
		}
	},
};

const initialTranslator = new TranslatorClient({});

let gettext = initialTranslator.gettext.bind(initialTranslator);
let userLanguageCode;

export const mapStateToProps = (state) => {
	const newUserLanguageCode = getLanguageCode(
		state.user.userLang,
		state.user.userLangCountry,
	);

	if (userLanguageCode !== newUserLanguageCode) {
		userLanguageCode = newUserLanguageCode;

		getTranslator('iam-client', userLanguageCode, hackyLogger)
			.then((translator) => {
				gettext = translator.gettext.bind(translator);
			})
			.catch((error) => {
				logger.warn('Could not get translator-client', { error });
			});
	}

	return { gettext };
};

export default function translate() {
	return (Component) => {
		class TranslationComponent extends React.Component {
			render() {
				return <Component {...this.props} gettext={this.props.gettext}/>;
			}
		}

		TranslationComponent.propTypes = {
			gettext: PropTypes.func.isRequired,
		};

		return connect(mapStateToProps)(TranslationComponent);
	};
}
