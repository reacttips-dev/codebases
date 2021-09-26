import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Popover } from '@pipedrive/convention-ui-react';

import activityCardContext from '../../../utils/context';
import { hideActivityCard, hideDeleteConfirmation } from '../actions/overlays';

import PopoverContent from './popover-content';
import ClickOutside from './lib/click-outside';
import CardSnackbar from './card-snackbar';

// The main menu bar at the top has z-index of 2000
const RaisedPopover = styled(Popover)`
	z-index: 2001;
`;

const ActivityPopover = (props) => {
	const { cardVisible, confirmationVisible, refElement, hideCard, hideConfirm } = props;

	return (
		<>
			{cardVisible && !!refElement && (
				<ClickOutside
					clickOutside={(e) => {
						e.stopPropagation();

						if (confirmationVisible) {
							hideConfirm();
						} else {
							hideCard();
						}
					}}
				>
					<RaisedPopover
						visible={cardVisible}
						portalTo={document.body}
						referenceElement={refElement}
						content={({ scheduleUpdate }) => (
							<PopoverContent updateActivityCardPlacement={scheduleUpdate} />
						)}
						spacing="none"
						placement="left"
						popperProps={{
							modifiers: {
								preventOverflow: {
									enabled: true,
									boundariesElement: 'viewport',
								},
								flip: {
									enabled: true,
								},
							},
						}}
					/>
				</ClickOutside>
			)}
			<CardSnackbar />
		</>
	);
};

ActivityPopover.propTypes = {
	refElement: PropTypes.object,
	cardVisible: PropTypes.bool,
	confirmationVisible: PropTypes.bool,
	hideCard: PropTypes.func.isRequired,
	hideConfirm: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	cardVisible: state.getIn(['overlays', 'activityCardVisible']),
	confirmationVisible: state.getIn(['overlays', 'deleteConfirmationVisible']),
});
const mapDispatchToProps = {
	hideCard: hideActivityCard,
	hideConfirm: hideDeleteConfirmation,
};

export default connect(mapStateToProps, mapDispatchToProps)(activityCardContext(ActivityPopover));
