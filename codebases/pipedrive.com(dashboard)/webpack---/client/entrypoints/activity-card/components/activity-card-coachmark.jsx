import PropTypes from 'prop-types';
import modalContext from '../../../utils/context';
import useCoachmarkEffect from '../../../utils/use-coachmark-effect';

const ActivityCardCoachmark = ({ fieldRef, setCoachmark, webappApi, translator, children }) => {
	useCoachmarkEffect({
		webappApi,
		elRef: fieldRef,
		setCoachmark,
		options: {
			detached: true,
			appearance: {
				placement: 'right',
				width: 316,
				zIndex: 6001,
				align: {
					points: ['cl', 'cr'],
					offset: [10, 0],
				},
			},
			actions: [
				{
					label: translator.gettext('Got it!'),
					primary: true,
				},
			],
			tag: 'activity_card_opened',
			content: translator.gettext(
				'The familiar editing view still exists. You can access it by clicking on Edit.',
			),
		},
	});

	return children;
};

ActivityCardCoachmark.propTypes = {
	fieldRef: PropTypes.object.isRequired,
	setCoachmark: PropTypes.func.isRequired,
	webappApi: PropTypes.object.isRequired,
	translator: PropTypes.object.isRequired,
	children: PropTypes.node,
};

export default modalContext(ActivityCardCoachmark);
