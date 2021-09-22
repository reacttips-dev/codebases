import React from 'react';
import { Icon, Tooltip } from '@pipedrive/convention-ui-react';

import { CoachmarkTags } from '../../utils/constants';
import useOnboardingCoachmarks from '../../utils/onboardingCoachmarkUtils';

import style from './Coachmark.pcss';

interface CoachmarkProps {
	children: JSX.Element;
	coachmark: CoachmarkTags;
}

const Coachmark: React.FC<CoachmarkProps> = ({ children, coachmark }) => {
	const coachMarkParameters = useOnboardingCoachmarks()[coachmark];

	const {
		content = null,
		placement = null,
		visible,
		close,
	} = coachMarkParameters;

	if (!visible) {
		return children;
	}

	const classes = [style.coachmark, style[`coachmark--${placement}`]];

	const getCoachmark = () => (
		<div className={classes.join(' ')} onClick={() => confirm}>
			<div className={style.coachmark__content}>{content}</div>
			<div className={style.coachmark__closeWrapper} onClick={close}>
				<Icon
					icon="cross"
					color="white"
					size="s"
					className={`${style.coachmark__close} closeCoachmark`}
				/>
			</div>
		</div>
	);

	return (
		<Tooltip
			className={style.wrapper}
			placement={placement}
			portalTo={document.body}
			spacing="none"
			visible
			content={getCoachmark()}
		>
			{children}
		</Tooltip>
	);
};

export default Coachmark;
