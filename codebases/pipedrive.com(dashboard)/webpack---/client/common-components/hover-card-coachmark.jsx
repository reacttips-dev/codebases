import PropTypes from 'prop-types';
import modalContext from '../utils/context';
import useCoachmarkEffect from '../utils/use-coachmark-effect';

const HoverCardCoachmark = ({ fieldRef, setCoachmark, webappApi, translator, children }) => {
	useCoachmarkEffect({
		webappApi,
		elRef: fieldRef,
		setCoachmark,
		options: {
			detached: true,
			appearance: {
				placement: 'top',
				width: 316,
				zIndex: 6001,
				align: {
					points: ['bl', 'tl'],
				},
			},
			actions: [
				{
					label: translator.gettext('Got it!'),
					primary: true,
				},
			],
			tag: 'activity_hover_card_teaser',
			content: translator.gettext(
				'Hover over the linked organization, person and deal to quickly see details for each',
			),
		},
	});

	return children;
};

HoverCardCoachmark.propTypes = {
	fieldRef: PropTypes.object.isRequired,
	setCoachmark: PropTypes.func.isRequired,
	webappApi: PropTypes.object.isRequired,
	translator: PropTypes.object.isRequired,
	children: PropTypes.node,
};

export default modalContext(HoverCardCoachmark);
