import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from 'styled-components';
import { Button, Icon, Spacing } from '@pipedrive/convention-ui-react';

import css from '../lib/variables.scss';
import activityCardContext from '../../../../utils/context';

const HeaderContainer = styled.div`
	width: 100%;
	display: flex;
	cursor: pointer;
`;
const Information = styled.div`
	flex-grow: 1;
`;
const ExpandIconWrapper = styled(Spacing)``;
const Counts = styled.div`
	color: ${css.guestCountColor};
	font-size: ${css.fontSizeSmall};
`;
const CountElem = styled.span`
	:not(:first-child)::before {
		content: ', ';
	}
`;

const getPropsForCounts = (guests, translator) => {
	const countProps = {
		yes: { count: 0 },
		no: { count: 0 },
		maybe: { count: 0 },
		pending: { count: 0 },
	};

	guests.forEach((guest) => {
		const status = guest.get('status');

		if (status && status in countProps) {
			countProps[status].count++;
		} else {
			countProps.pending.count++;
		}
	});

	Object.entries(countProps).forEach(([key, props]) => {
		const { count } = props;

		if (count <= 0) {
			delete countProps[key];

			return;
		}

		// These translations are defined in the jed-stubs for activity card entry point
		props.title =
			count === guests.size
				? translator.gettext(`All ${key}`)
				: translator.ngettext(`%d ${key}`, `%d ${key}`, count, count);
	});

	return Object.entries(countProps);
};

const RsvpStatus = (props) => {
	const { guests, translator } = props;

	return (
		<Counts>
			{getPropsForCounts(guests, translator).map(([key, cProps]) => (
				<CountElem key={key}>{cProps.title}</CountElem>
			))}
		</Counts>
	);
};

RsvpStatus.propTypes ={
	guests: ImmutablePropTypes.list,
	translator: PropTypes.object.isRequired,
};

const GuestsHeader = (props) => {
	const { expanded, guests, translator, hasActiveCalendarSync } = props;
	const total = guests.size;


	return (
		<HeaderContainer {...props}>
			<Information>
				<div>{translator.ngettext('%d guest', '%d guests', total, total)}</div>
				{ hasActiveCalendarSync && <RsvpStatus guests={guests} translator={translator} /> }
			</Information>
			<ExpandIconWrapper left="s">
				<Button color="ghost" size="s" >
					<Icon color="black-64" size="s" icon={expanded ? 'collapse' : 'expand'} />
				</Button>
			</ExpandIconWrapper>
		</HeaderContainer>
	);
};

GuestsHeader.propTypes = {
	expanded: PropTypes.bool,
	guests: ImmutablePropTypes.list,
	translator: PropTypes.object.isRequired,
	hasActiveCalendarSync: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	hasActiveCalendarSync: state.getIn(['activity', 'hasActiveCalendarSync']),
});

export default connect(mapStateToProps)(activityCardContext(GuestsHeader));
