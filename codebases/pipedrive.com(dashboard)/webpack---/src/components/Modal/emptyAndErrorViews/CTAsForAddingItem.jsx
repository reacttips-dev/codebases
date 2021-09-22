import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { completedQuerySelector } from 'store/modules/itemSearch';
import { useAppContext } from 'utils/AppContext';
import styles from './style.scss';
import translator from 'utils/translator';
import { Icon } from '@pipedrive/convention-ui-react';
import { ITEM_TYPES, ALL_CATEGORIES } from 'utils/constants';
import { setModalVisible } from 'store/modules/sharedState';
const { DEAL, LEAD, PERSON, ORGANIZATION, PRODUCT } = ITEM_TYPES;

const ALLOWED_TYPES = [DEAL, LEAD, PERSON, ORGANIZATION, PRODUCT];

function CTA({ type }) {
	if (!ALLOWED_TYPES.includes(type)) {
		return null;
	}
	const dispatch = useDispatch();

	const { term } = useSelector(completedQuerySelector);
	const { modals } = useAppContext();

	const onCtaClick = () => {
		openAddModal(modals, type, term);
		dispatch(setModalVisible(false));
	};

	return (
		<div className={styles.cta} onClick={onCtaClick}>
			<Icon icon={type} color="blue" size="s" />
			<div>{getAddNewText(type, term)}</div>
		</div>
	);
}

CTA.propTypes = {
	type: PropTypes.string.isRequired,
};

export default function CTAsForAddingItem() {
	const { category: selectedCategory } = useSelector(completedQuerySelector);

	return selectedCategory === ALL_CATEGORIES ? (
		<>
			<CTA type={PERSON} />
			<CTA type={DEAL} />
		</>
	) : (
		<CTA type={selectedCategory} />
	);
}

function openAddModal(modals, type, term) {
	modals.open('add-modals:froot', {
		type,
		prefill: {
			...(type === DEAL && {
				person_id: term,
				title: translator.pgettext('[Entered name] deal', '%s deal', term),
			}),
			...(type === LEAD && {
				person_id: term,
				title: translator.pgettext('[Entered name] lead', '%s lead', term),
			}),
			...(![DEAL, LEAD].includes(type) && { name: term }),
		},
		metricsData: {
			source: 'search',
		},
	});
}

function getAddNewText(type, term) {
	const entityTranslations = {
		[DEAL]: translator.gettext('deal'),
		[PERSON]: translator.gettext('person'),
		[ORGANIZATION]: translator.gettext('organization'),
		[LEAD]: translator.gettext('lead'),
		[PRODUCT]: translator.gettext('product'),
	};

	return translator.pgettext(
		'Create [deal, org, person, lead, product] [word that was entered to search box]',
		'Create %s ’%s’',
		[entityTranslations[type], term],
	);
}
