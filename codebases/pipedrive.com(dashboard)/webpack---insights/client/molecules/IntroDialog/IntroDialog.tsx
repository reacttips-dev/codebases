import React from 'react';
import { Dialog, Button } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import IntroTrackDataSVG from '../../utils/svg/IntroTrackData.svg';
import IntroBuildOverviewSVG from '../../utils/svg/IntroBuildOverview.svg';
import IntroShareResultsSVG from '../../utils/svg/IntroShareResults.svg';

import styles from './IntroDialog.pcss';

interface IntroDialogProps {
	onClose: () => void;
}

export const IntroDialog: React.FC<IntroDialogProps> = ({ onClose }) => {
	const translator = useTranslator();

	return (
		<Dialog
			className={styles.IntroDialog}
			title={translator.gettext('Discover what your data really means')}
			actions={
				<div className={styles.IntroDialogActions}>
					<Button color="green" onClick={() => onClose()}>
						{translator.gettext('Start exploring Insights')}
					</Button>
				</div>
			}
			visible
			onClose={() => onClose()}
		>
			<div className={styles.IntroDialogColumns}>
				<div className={styles.IntroDialogColumn}>
					<IntroTrackDataSVG />
					<p>{translator.gettext('Track the data you need')}</p>
				</div>
				<div className={styles.IntroDialogColumn}>
					<IntroBuildOverviewSVG />
					<p>
						{translator.gettext(
							'Build overviews for the full picture',
						)}
					</p>
				</div>
				<div className={styles.IntroDialogColumn}>
					<IntroShareResultsSVG />
					<p>
						{translator.gettext('Share the results with anyone ')}
					</p>
				</div>
			</div>
		</Dialog>
	);
};

export default IntroDialog;
