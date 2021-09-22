import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Formatter from '@pipedrive/formatter';

import HighlightedText from '../HighlightedText';
import SecondaryLink from './SecondaryLink';
import { highlightRegexSelector } from 'store/modules/itemSearch';
import translator from 'utils/translator';
import { getSidePanelCategories } from 'utils/helpers';
import { ITEM_TYPES } from 'utils/constants';
import searchItemPropType from 'utils/searchItemPropType';
import styles from '../style.scss';

const { ORGANIZATION, PERSON, DEAL } = ITEM_TYPES;

const formatter = new Formatter();
export function TextSpan({ children }) {
	return (
		<span className={styles.secondaryTextSpan}>
			<HighlightedText>{children}</HighlightedText>
		</span>
	);
}

TextSpan.propTypes = {
	children: PropTypes.string,
};

export function Value({ item }) {
	if (!item.value || !item.currency) {
		return null;
	}

	const formattedValue = formatter.format(item.value, item.currency);

	return <TextSpan>{formattedValue}</TextSpan>;
}

Value.propTypes = {
	item: searchItemPropType,
};

export function Organization({ item }) {
	const { organization } = item;

	if (!organization || !organization.name || !organization.id) {
		return null;
	}

	return (
		<SecondaryLink
			item={item}
			secondaryItem={{
				type: ORGANIZATION,
				id: organization.id,
			}}
		>
			<TextSpan>{organization.name}</TextSpan>
		</SecondaryLink>
	);
}

Organization.propTypes = {
	item: searchItemPropType,
};

export function OrganizationAddress({ item }) {
	const { organization } = item;
	const highlightRegex = useSelector(highlightRegexSelector);

	if (!organization || !organization.address || !organization.address.match(highlightRegex)) {
		return null;
	}

	return <TextSpan>{organization.address}</TextSpan>;
}

OrganizationAddress.propTypes = {
	item: searchItemPropType,
};

export function Person({ item }) {
	const { person } = item;

	if (!person || !person.name || !person.id) {
		return null;
	}

	return (
		<SecondaryLink
			item={item}
			secondaryItem={{
				type: PERSON,
				id: person.id,
			}}
		>
			<TextSpan>{person.name}</TextSpan>
		</SecondaryLink>
	);
}

Person.propTypes = {
	item: searchItemPropType,
};

export function Address({ item }) {
	const { address } = item;

	if (!address) {
		return null;
	}

	return <TextSpan>{address}</TextSpan>;
}

Address.propTypes = {
	item: searchItemPropType,
};

export function DealTitle({ item }) {
	const { deal } = item;

	if (!deal || !deal.title || !deal.id) {
		return null;
	}

	return (
		<SecondaryLink
			item={item}
			secondaryItem={{
				type: DEAL,
				id: deal.id,
			}}
		>
			<TextSpan>{deal.title}</TextSpan>
		</SecondaryLink>
	);
}

DealTitle.propTypes = {
	item: searchItemPropType,
};

export function DealStage({ item }) {
	const { stage } = item;

	if (!stage || !stage.name) {
		return null;
	}

	return <TextSpan>{stage.name}</TextSpan>;
}

DealStage.propTypes = {
	item: searchItemPropType,
};

export function ProductCode({ item }) {
	const { code } = item;

	if (!code) {
		return null;
	}

	return <TextSpan>{code}</TextSpan>;
}

ProductCode.propTypes = {
	item: searchItemPropType,
};

export function Emails({ item }) {
	const { emails } = item;

	if (!emails || emails.length === 0) {
		return null;
	}

	return emails.map((email) => <TextSpan key={email}>{email}</TextSpan>);
}

Emails.propTypes = {
	item: searchItemPropType,
};

export function PhoneNumbers({ item }) {
	const { phones } = item;

	if (!phones || phones.length === 0) {
		return null;
	}

	return phones.map((phone, index) => (
		<React.Fragment key={index}>
			<span className={styles.black}>
				{translator.gettext('Phone')}
				{': '}
			</span>
			<TextSpan>{phone}</TextSpan>
		</React.Fragment>
	));
}

PhoneNumbers.propTypes = {
	item: searchItemPropType,
};

export function Category({ item }) {
	const categoryText = getSidePanelCategories().find((category) => category.type === item.category).name;

	return <TextSpan>{categoryText}</TextSpan>;
}

Category.propTypes = {
	item: searchItemPropType,
};
