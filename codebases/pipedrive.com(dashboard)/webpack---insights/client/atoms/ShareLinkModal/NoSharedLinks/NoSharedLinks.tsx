import React from 'react';
import { Text, Button } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import NoSharedLinksSVG from '../../../utils/svg/NoSharedLinks.svg';

import styles from './NoSharedLinks.pcss';

interface NoSharedLinksProps {
	isLoading: boolean;
	onAddLinkClicked: () => void;
}

const NoSharedLinks: React.FC<NoSharedLinksProps> = ({
	isLoading,
	onAddLinkClicked,
}) => {
	const t = useTranslator();

	return (
		<div className={styles.noSharedLinksContainer}>
			<NoSharedLinksSVG className={styles.illustration} />
			<Text className={styles.noSharedLinksText}>
				<h2>{t.gettext('No public links yet')}</h2>
				<p className={styles.caption}>
					{t.gettext(
						'Let others view your live dashboard by simply sending them a link.',
					)}
				</p>
			</Text>
			<Button
				color="green"
				onClick={onAddLinkClicked}
				disabled={isLoading}
				data-test="share-link-modal-get-link-button"
			>
				{t.gettext('Get link')}
			</Button>
		</div>
	);
};

export default NoSharedLinks;
