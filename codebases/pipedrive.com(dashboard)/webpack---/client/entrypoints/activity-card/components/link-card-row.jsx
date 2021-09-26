import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import activityCardContext from '../../../utils/context';
import CardRow from './card-row';

const Link = styled.a`
	color: inherit;
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
`;

const ItemLink = ({ url, webappApi, children }) => (
	<Link
		href={url}
		onClick={(e) => {
			e.preventDefault();
			webappApi.router.go(null, url, false, false);
		}}
	>
		{children}
	</Link>
);

ItemLink.propTypes = {
	url: PropTypes.string,
	children: PropTypes.any,
	webappApi: PropTypes.object,
};

export const LinkToItem = activityCardContext(ItemLink);

const LinkCardRow = (props) => {
	const { url, children, webappApi, ...cardRowProps } = props;

	return (
		<CardRow {...cardRowProps}>
			{children && (
				<ItemLink url={url} webappApi={webappApi}>
					{children}
				</ItemLink>
			)}
		</CardRow>
	);
};

LinkCardRow.propTypes = {
	url: PropTypes.string,
	children: PropTypes.any,
	webappApi: PropTypes.object,
};

export default activityCardContext(LinkCardRow);
