import React from 'react';
import PropTypes from 'prop-types';
import translate from 'containers/translation';
import TextVariablesWrapper from 'utils/textVariablesWrapper';
import Separator from 'components/sidebar/separator';
import urls from 'constants/urls';

import style from './style.css';
function notFound({
	gettext,
	trackExternalLink,
	talkToUs,
}) {
	const notFoundMessage = (
		<>
			<TextVariablesWrapper text={gettext('Need more help? Check our {{Community}} or {{contact support}}')}>
				<a href={urls.community} target="_blank" rel="noopener noreferrer" onClick={(ev) => trackExternalLink(ev.target.href, 'community_in_article_footer', 'knowledge_base')} />
				<a href="#!" onClick={() => talkToUs('knowledge_base')} />
			</TextVariablesWrapper>
		</>
	);

	return (
		<>
			<Separator />
			<div className={style.NotFound}>
				{notFoundMessage}
			</div>
		</>
	);
}

notFound.propTypes = {
	gettext: PropTypes.func.isRequired,
	trackExternalLink: PropTypes.func.isRequired,
	talkToUs: PropTypes.func,
};

export const NotFound = notFound;
export default translate()(notFound);
