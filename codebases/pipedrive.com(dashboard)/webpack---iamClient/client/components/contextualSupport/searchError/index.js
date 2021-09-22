/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import translate from 'containers/translation';
import TextVariablesWrapper from 'utils/textVariablesWrapper';
import style from './style.css';

function searchError({
	gettext,
	talkToUs,
}) {
	return (
		<div className={style.SearchError}>
			<TextVariablesWrapper text={gettext(`Oops! Something went wrong. Please try again or {{contact support}} if the problem persists`)}>
				<a href="#!" onClick={() => talkToUs('knowledge_base')} />
			</TextVariablesWrapper>
		</div>
	);
}

searchError.propTypes = {
	gettext: PropTypes.func,
	talkToUs: PropTypes.func.isRequired,
};

export const SearchError = searchError;
export default translate()(searchError);
