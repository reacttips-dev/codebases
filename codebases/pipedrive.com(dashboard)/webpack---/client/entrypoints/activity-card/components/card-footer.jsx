import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Button, Checkbox, Spacing } from '@pipedrive/convention-ui-react';

import { toggleActivityDone } from '../actions/activity';
import { openActivityEditModal } from '../actions/overlays';
import activityCardContext from '../../../utils/context';
import css from './lib/variables.scss';
import DeleteButton from './delete-button';
import ActivityCardCoachmark from './activity-card-coachmark';

const FooterWrapper = styled(Spacing)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-top: 1px solid ${css.separatorColor};
`;
const EditWrapper = styled.div`
	display: flex;
	align-items: center;
`;
const CheckboxWrapper = styled(Checkbox)`
	display: flex;
	align-items: center;
`;

const CardFooter = (props) => {
	const { done, toggleDone, openActivityEdit, translator } = props;

	const [activityCardCoachmark, setActivityCardCoachmark] = useState();
	const activityCardRef = useRef(null);

	const handleActivityCardClick = () => {
		activityCardCoachmark && activityCardCoachmark.close();
	};

	return (
		<FooterWrapper horizontal="m" vertical="s" id="t123">
			<DeleteButton />
			<EditWrapper ref={activityCardRef}>
				<Spacing horizontal="m">
					<CheckboxWrapper
						data-test="activity-card-mark-done"
						checked={done}
						onChange={toggleDone}
						type="round"
					>
						{translator.gettext('Mark as done')}
					</CheckboxWrapper>
				</Spacing>
				<ActivityCardCoachmark
					fieldRef={activityCardRef}
					setCoachmark={setActivityCardCoachmark}
				>
					<Button
						onClick={() => {
							handleActivityCardClick();
							openActivityEdit();
						}}
					>
						{translator.gettext('Edit')}
					</Button>
				</ActivityCardCoachmark>
			</EditWrapper>
		</FooterWrapper>
	);
};

CardFooter.propTypes = {
	done: PropTypes.bool,
	toggleDone: PropTypes.func.isRequired,
	openActivityEdit: PropTypes.func.isRequired,
	translator: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	done: state.getIn(['activity', 'done']),
});

const mapDispatchToProps = {
	toggleDone: toggleActivityDone,
	openActivityEdit: openActivityEditModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(activityCardContext(CardFooter));
