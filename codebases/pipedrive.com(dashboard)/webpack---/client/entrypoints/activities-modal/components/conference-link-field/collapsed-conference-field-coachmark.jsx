import PropTypes from 'prop-types';
import modalContext from '../../../../utils/context';
import useCoachmarkEffect, {
	getConferenceMeetingCoachmarkOptions,
} from '../../../../utils/use-coachmark-effect';

const CollapsedConferenceFieldCoachmark = ({
	integrationInstalled,
	fieldRef,
	setCoachmark,
	webappApi,
	translator,
	handleExpansion,
	children,
}) => {
	const actions = [
		{
			label: translator.gettext('Got it!'),
		},
		{
			label: translator.gettext('Install integration'),
			handler: handleExpansion,
			primary: true,
		},
	];

	useCoachmarkEffect({
		webappApi,
		elRef: fieldRef,
		setCoachmark,
		options: getConferenceMeetingCoachmarkOptions({
			integrationInstalled,
			detached: false,
			translator,
			...(!integrationInstalled && { actions }),
		}),
	});

	return children;
};

CollapsedConferenceFieldCoachmark.propTypes = {
	integrationInstalled: PropTypes.bool,
	fieldRef: PropTypes.object.isRequired,
	setCoachmark: PropTypes.func.isRequired,
	webappApi: PropTypes.object.isRequired,
	translator: PropTypes.object.isRequired,
	handleExpansion: PropTypes.func.isRequired,
	children: PropTypes.node,
};

export default modalContext(CollapsedConferenceFieldCoachmark);
