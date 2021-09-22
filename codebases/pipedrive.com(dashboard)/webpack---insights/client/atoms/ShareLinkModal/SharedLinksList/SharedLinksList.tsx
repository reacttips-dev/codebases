import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import LinkButton from '../../../atoms/LinkButton';
import SharedLink, { SharedLinkItem } from '../SharedLink/SharedLink';

import styles from './SharedLinksList.pcss';

interface SharedLinksListProps {
	isLoading: boolean;
	publicLinks: SharedLinkItem[];
	onAddLinkClicked: () => void;
	onDeleteButtonClicked: (link: any) => void;
}

const SharedLinksList: React.FC<SharedLinksListProps> = ({
	isLoading,
	publicLinks,
	onAddLinkClicked,
	onDeleteButtonClicked,
}) => {
	const t = useTranslator();
	const message = t.pgettext(
		'Create separate links to control access for different viewer groups and name each link accordingly. ' +
			'To revoke access, simply delete a link.',
		'Create separate links to %s%s%s for different viewer groups and name each link accordingly. ' +
			'To revoke access, simply delete a link.',
		[
			`<strong class="${styles.textStrong}">`,
			t.gettext('control access'),
			'</strong>',
		],
	);

	return (
		<div className={styles.publicLinksContainer}>
			<p
				className={styles.descriptionText}
				/* eslint-disable-next-line react/no-danger */
				dangerouslySetInnerHTML={{ __html: message }}
			/>
			<ul>
				{publicLinks.map((link) => {
					return (
						<SharedLink
							key={link.id}
							link={link}
							onDeleteButtonClicked={onDeleteButtonClicked}
						/>
					);
				})}
			</ul>
			<div className={styles.linkButtonContainer}>
				<LinkButton
					text={t.gettext('Add new link')}
					icon="plus"
					onClick={onAddLinkClicked}
					disabled={isLoading}
				/>
			</div>
		</div>
	);
};

export default SharedLinksList;
