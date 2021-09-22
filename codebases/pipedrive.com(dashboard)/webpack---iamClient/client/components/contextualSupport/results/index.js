import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@pipedrive/convention-ui-react';
import keys from 'constants/keyboard';
import { escapeRegExp } from 'lodash';
import SectionHeader from '../sectionHeader';
import ResultMeta from './resultMeta';
import ResultThumbnail from './resultThumbnail';
import { toggleLines } from 'utils/styleHelper';

import style from './style.css';

function results({
	gettext,
	results = [],
	header,
	highlight,
	open,
	clicked,
	query,
	locale = 'en_US',
	localLanguage,
}) {
	const items = results || [];
	const sanitizedLocale = locale?.replace('_', '-');
	const sourceMap = { support: gettext('Knowledge Base'), academy: gettext('Academy'), community: gettext('Community') };
	const typeMap = {
		chapter: gettext('Video'),
		course: gettext('Video course'),
		post: gettext('Post'),
		topic: gettext('Topic'),
		question: gettext('Question/Poll'),
	};

	// eslint-disable-next-line complexity
	const list = items.map((item, i) => {
		let title = item.title;
		let listItem;
		let date;

		if (item.source === 'community') {
			date = new Intl.DateTimeFormat(sanitizedLocale).format(new Date(item.publishedAt));
		}

		if (highlight) {
			const highlightedText = new RegExp(escapeRegExp(highlight), 'i').exec(title);

			if (highlightedText) {
				const prevText = title.substring(0, highlightedText.index);
				const nextText = title.substring(highlightedText.index + highlightedText[0].length, title.length);

				title = (
					<div>
						{prevText}
						<span className={style.Results__highlight}>
							{highlightedText[0]}
						</span>
						{nextText}
					</div>
				);
			}
		}

		const resultInfo = (<>
			{title}
			{query && <ResultMeta
				source={sourceMap[item.source]}
				type={typeMap[item.type] || 'Article'}
				date={date}
			/>
			}
		</>);

		if (item.source && item.source !== 'support') {
			// only send academy (english) title to amplitude
			const title = item.meta ? item.meta.inCourse : null;

			listItem = (
				<li key={item.id || item.url}
					tabIndex="0"
					className={style.Results__item}
					onMouseOver={() => toggleLines('transparent', i)}
					onMouseLeave={() => toggleLines('#eeeeee', i)}
				>
					<div className={style.Results__linkContainer}>
						<div className={style.Results__link}>
							{item.source === 'academy' && (item.thumbnail && <ResultThumbnail url={item.thumbnail}/>)}
							<a
								className={style.Results__linkText}
								href={item.url}
								rel="noopener noreferrer"
								target="_blank"
								onClick={() => {
									clicked(item.id, title, query, item.source);
								}}>
								{resultInfo}
							</a>
						</div>
						<div className={style.Results__icon}>
							<Icon icon='sm-redirect' color='black-32'/>
						</div>
					</div>

					{items[i + 1] && <div id={`line-${i}`} className={style.Results__line}/>}
				</li>);
		} else {
			listItem = (
				<li key={item.articleId || item.title}
					tabIndex="0"
					className={style.Results__item}
					onClick={() => {
						open(item.articleId, localLanguage);
					}}
					onKeyPress={(target) => {
						if (target.charCode === keys.charcodes.ENTER) {
							open(item.articleId, localLanguage);
						}
					}}
					onMouseOver={() => toggleLines('transparent', i)}
					onMouseLeave={() => toggleLines('#eeeeee', i)}
				>
					<div className={style.Results__linkContainer}>
						<div className={style.Results__link}>
							<div className={style.Results__linkText}>
								{resultInfo}
							</div>
						</div>
						<div className={style.Results__icon}>
							<Icon icon='sm-arrow-right' color='black-32'/>
						</div>
					</div>
					{items[i + 1] && <div id={`line-${i}`} className={style.Results__line}/>}
				</li>);
		}

		return listItem;
	});

	return (
		<div className={style.Results}>
			{header && <SectionHeader marginBottom={'4px'}>{header}</SectionHeader>}
			<ul className={style.Results__list}>
				{list}
			</ul>
		</div>
	);
}

results.propTypes = {
	gettext: PropTypes.func.isRequired,
	results: PropTypes.array,
	header: PropTypes.string,
	highlight: PropTypes.string,
	open: PropTypes.func.isRequired,
	clicked: PropTypes.func.isRequired,
	query: PropTypes.string,
	locale: PropTypes.string,
	localLanguage: PropTypes.string,
};

export default results;
