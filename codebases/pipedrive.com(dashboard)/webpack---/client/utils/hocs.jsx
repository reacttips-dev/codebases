import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import getTranslator from '@pipedrive/translator-client/fe';

const getDisplayName = (WrappedComponent) => {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

const withWebApiAndTranslatorLoader = (
	ComponentToWrap,
	{ componentName, includeFormFieldsTranslator = false, logStateOnError = false },
) => {
	const WrappedComponent = (props) => {
		const [translator, setTranslator] = useState(props.translator);
		const [formFieldsTranslator, setFormFieldsTranslator] = useState(null);
		// support both
		const webappApi = props.webappApi || props.WebappApi;

		const logger = webappApi.logger(componentName);
		const language = webappApi.userSelf.attributes.language;
		const userLanguage = `${language.language_code}-${language.country_code}`;

		logger.facility = componentName;
		logger.logStateOnError = logStateOnError;

		useEffect(() => {
			getTranslator('activities-components', userLanguage, logger)
				.then((translator) => {
					setTranslator(translator);
				})
				.catch((error) => {
					logger.remote('error loading activities-components translator', error);
				});

			if (includeFormFieldsTranslator) {
				getTranslator('form-fields', userLanguage, logger)
					.then((translator) => {
						setFormFieldsTranslator(translator);
					})
					.catch((error) => {
						logger.remote('error loading form-fields translator', error);
					});
			}
		}, [userLanguage]);

		const areTranslatorsLoaded =
			translator && (!includeFormFieldsTranslator || formFieldsTranslator);
		const formFieldsTranslatorProp = includeFormFieldsTranslator
			? { formFieldsTranslator }
			: {};

		return areTranslatorsLoaded ? (
			<ComponentToWrap
				webappApi={webappApi}
				logger={logger}
				translator={translator}
				{...formFieldsTranslatorProp}
				{...props}
			/>
		) : null;
	};

	WrappedComponent.propTypes = {
		webappApi: PropTypes.object,
		WebappApi: PropTypes.object,
		translator: PropTypes.object,
	};

	WrappedComponent.displayName = `TranslatorWebApiLoaded-${getDisplayName(ComponentToWrap)}`;

	return WrappedComponent;
};

const withLoadingState = (LoadingComponent, LoadedComponent, loadingStateSelector) => {
	const WrappedComponent = (props) => {
		const { isLoading, ...rest } = props;

		return isLoading ? <LoadingComponent {...rest} /> : <LoadedComponent {...rest} />;
	};

	WrappedComponent.propTypes = {
		isLoading: PropTypes.bool,
	};
	WrappedComponent.defaultProps = {
		isLoading: true,
	};
	WrappedComponent.displayName = `IsLoadingWrapper-${getDisplayName(LoadedComponent)}`;

	return connect(loadingStateSelector, () => ({}))(WrappedComponent);
};

export {
	withWebApiAndTranslatorLoader,
	withLoadingState,
	getDisplayName as getComponentDisplayName,
};
