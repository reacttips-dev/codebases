import React from 'react';
import PropTypes from 'prop-types';
import TextVariablesWrapper from 'utils/textVariablesWrapper';
import translate from 'containers/translation';
import style from './style.css';

function infoMessage({
	data,
	open,
	clicked,
}) {
	const { articleId, message } = data;

	return (
		<div className={style.InfoMessage}>
			<TextVariablesWrapper text={message}>
				<span className={style.InfoMessage__link} onClick={() => {
					clicked();
					open(articleId);
				}} />
			</TextVariablesWrapper>
		</div>
	);
}

infoMessage.propTypes = {
	data: PropTypes.shape({
		articleId: PropTypes.number,
		message: PropTypes.string,
		amplitudeLink: PropTypes.string,
	}).isRequired,
	open: PropTypes.func.isRequired,
	clicked: PropTypes.func.isRequired,
};

export const InfoMessage = infoMessage;
export default translate()(infoMessage);
