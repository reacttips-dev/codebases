import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { Icon, Separator, Spacing } from '@pipedrive/convention-ui-react';
import { getSidePanelCategories } from 'utils/helpers';
import { categorySelector, onSearchCategoryChange, onQuickHelpClick } from 'store/modules/itemSearch';
import { ALL_CATEGORIES, KEYS } from 'utils/constants';
import { useAppContext } from 'utils/AppContext';
import track from 'utils/tracking';
import FeedbackLink from './Feedback/FeedbackLink';

import styles from './style.scss';
import translator from 'utils/translator';

const QUICK_HELP = 'help';

function getCategoryClasses(category, activeCategory) {
	const isActive = category === activeCategory;
	return classNames(styles.category, isActive && styles.activeCategory);
}

function SidePanelCategory({ type, name }) {
	const dispatch = useDispatch();
	const { supportSidebar } = useAppContext();

	const sidePanelClick = (category) => {
		if (category === QUICK_HELP) {
			dispatch(onQuickHelpClick(supportSidebar));
			return;
		}

		dispatch(onSearchCategoryChange(category));
		track.searchCategorySelected(category);
	};

	const onKeyDown = (key, type) => {
		if (key === KEYS.ENTER) {
			sidePanelClick(type);
		}
	};

	const activeCategory = useSelector(categorySelector);

	return (
		<div
			onClick={() => sidePanelClick(type)}
			onKeyDown={(e) => onKeyDown(e.key, type)}
			onMouseDown={(e) => {
				// Keep the input focused
				e.preventDefault();
			}}
			tabIndex="0"
			className={styles.categoryWrapper}
		>
			<div className={getCategoryClasses(type, activeCategory)} tabIndex="-1">
				{type !== ALL_CATEGORIES && (
					<Spacing right="m" className={styles.displayFlex}>
						<Icon icon={type} color={type === activeCategory ? 'blue' : 'black-64'} />
					</Spacing>
				)}
				<div>{name}</div>
			</div>
		</div>
	);
}

SidePanelCategory.propTypes = {
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
};

function SidePanel() {
	return (
		<div className={styles.sidePanel}>
			<Spacing all="s" top="l">
				{getSidePanelCategories().map((categoryData) => (
					<SidePanelCategory key={categoryData.name} {...categoryData} />
				))}
				<Spacing horizontal="s">
					<Separator />
				</Spacing>

				<SidePanelCategory name={translator.gettext('Quick help')} type={QUICK_HELP} />
				<FeedbackLink />
			</Spacing>
		</div>
	);
}

export default SidePanel;
