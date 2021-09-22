import React from 'react';
import PropTypes from 'prop-types';
import { activityQuickDetailsOpened } from '../../../utils/track-usage';
import AddPopover from '../components/add-popover';
import AddPopoverContainer from '../containers/add-popover';
import withContext from '../../../utils/context';

const ActivityInProgress = ({
	item,
	removeThisItem,
	addThisItem,
	updateThisItem,
	webappApi,
	children,
}) => {
	return (
		<AddPopoverContainer
			item={item}
			removeThisItem={removeThisItem}
			placement={item.get('context') === 'allday' ? 'bottom' : 'right'}
			visible={!(item.get('isHidden') || item.get('isRequestPending'))}
			content={
				<AddPopover
					item={item}
					addThisItem={addThisItem}
					updateThisItem={updateThisItem}
					removeThisItem={() => {
						removeThisItem();
						activityQuickDetailsOpened(webappApi);
					}}
				/>
			}
		>
			{children}
		</AddPopoverContainer>
	);
};

ActivityInProgress.propTypes = {
	item: PropTypes.object.isRequired,
	removeThisItem: PropTypes.func.isRequired,
	addThisItem: PropTypes.func.isRequired,
	updateThisItem: PropTypes.func.isRequired,
	webappApi: PropTypes.object.isRequired,
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default withContext(ActivityInProgress);
