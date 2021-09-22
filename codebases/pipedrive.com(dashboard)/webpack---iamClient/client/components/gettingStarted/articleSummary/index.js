import React from 'react';
import PropTypes  from 'prop-types';
import classNames from 'classnames';
import { Icon } from '@pipedrive/convention-ui-react';
import Wrapper from './wrapper';

import track from 'containers/tracking';
import { gettingStartedItemClicked } from 'actions/gettingStarted';

import style from './style.css';

function articleSummary(props) {
	const {
		title,
		subtitle,
		completed,
		articleId,
		url,
	} = props;

	return (
		<Wrapper
			className = {classNames({
				[style.ArticleSummary]: true,
				[style['ArticleSummary--clickable']]: articleId || url,
				[style['ArticleSummary--noDecoration']]: url,
			})}
			{...props}
		>
			<Icon
				className={style.ArticleSummary__icon}
				icon='check'
				color={completed ? 'green' : 'black-24'}
				size='s'
			/>
			<div
				className={classNames({
					[style.ArticleSummary__title]: true,
					[style['ArticleSummary__title--completed']]: completed,
				})}
			>
				{title}
			</div>
			<div className={style.ArticleSummary__subtitle}>{subtitle}</div>
		</Wrapper>
	);
}

articleSummary.propTypes = {
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	completed: PropTypes.bool.isRequired,
	articleId: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.object,
	]),
	url: PropTypes.string,
};

export const ArticleSummary = articleSummary;
export default track(gettingStartedItemClicked)(ArticleSummary);

