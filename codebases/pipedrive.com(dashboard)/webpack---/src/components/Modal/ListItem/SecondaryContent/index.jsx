import React from 'react';

import searchItemPropType from 'utils/searchItemPropType';
import { ITEM_TYPES } from 'utils/constants';
import {
	Address,
	Category,
	DealTitle,
	Emails,
	Organization,
	OrganizationAddress,
	Person,
	PhoneNumbers,
	ProductCode,
	Value,
	DealStage,
} from './fragments';

import styles from '../style.scss';

const { DEAL, LEAD, PERSON, ORGANIZATION, PRODUCT, FILE, KEYWORD } = ITEM_TYPES;

function Content({ item }) {
	switch (item.type) {
		case DEAL:
			return (
				<>
					<Value item={item} />
					<Person item={item} />
					<Organization item={item} />
					<OrganizationAddress item={item} />
					<DealStage item={item} />
				</>
			);
		case LEAD:
			return (
				<>
					<Value item={item} />
					<Person item={item} />
					<Organization item={item} />
					<OrganizationAddress item={item} />
				</>
			);
		case PERSON:
			return (
				<>
					<Organization item={item} />
					<OrganizationAddress item={item} />
					<Emails item={item} />
					<PhoneNumbers item={item} />
				</>
			);
		case ORGANIZATION:
			return (
				<>
					<Address item={item} />
				</>
			);
		case PRODUCT:
			return (
				<>
					<ProductCode item={item} />
				</>
			);
		case FILE:
			return (
				<>
					<DealTitle item={item} />
					<Person item={item} />
					<Organization item={item} />
				</>
			);
		case KEYWORD:
			return (
				<>
					<Category item={item} />
				</>
			);

		default:
			return null;
	}
}

Content.propTypes = {
	item: searchItemPropType,
};

function SecondaryContent({ item }) {
	return (
		<div className={styles.secondaryContent}>
			<Content item={item} />
		</div>
	);
}

SecondaryContent.propTypes = {
	item: searchItemPropType,
};

export default SecondaryContent;
