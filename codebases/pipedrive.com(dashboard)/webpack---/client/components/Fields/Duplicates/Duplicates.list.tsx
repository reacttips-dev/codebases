import { Button, Checkbox, Icon, Text, Tooltip } from '@pipedrive/convention-ui-react';
import { DuplicateType } from '@pipedrive/form-fields/types/components';
import { ModalContext } from 'components/AddModal/AddModal.context';
import HighlightText from 'components/HighlightText';
import useQuickInfoCard from 'hooks/useQuickInfoCard';
import React, { useContext } from 'react';
import { ModalType, SearchParams } from 'Types/types';

import styles from './Duplicates.pcss';

interface DuplicatesListTypes {
	type: ModalType;
	togglePopover: () => void;
	searchParams: SearchParams;
	allowPick: boolean;
	pickContact: (contact: { id: number; name: string }) => void;
}

export const DuplicatesList = ({ type, togglePopover, searchParams, allowPick, pickContact }: DuplicatesListTypes) => {
	const {
		duplicates,
		translator,
		isAutomaticallyOpeningDuplicateChecker,
		setAutomaticallyOpeningDuplicateChecker,
		settings,
	} = useContext(ModalContext);

	const toggleCheckbox = () => {
		setAutomaticallyOpeningDuplicateChecker(!isAutomaticallyOpeningDuplicateChecker);

		settings.save('show_duplicates', !isAutomaticallyOpeningDuplicateChecker);
	};

	const QuickInfoCard = useQuickInfoCard();

	const renderDetailsLink = (duplicate: DuplicateType) => {
		const button = (
			<Button
				color="ghost"
				className={styles.link}
				target="_blank"
				rel="noopener noreferrer"
				href={`/${duplicate.type}/${duplicate.id}`}
			>
				<Icon icon="redirect" size="s" color="black-64" />
			</Button>
		);

		if (QuickInfoCard) {
			return (
				<QuickInfoCard
					type={type}
					id={duplicate.id}
					popoverProps={{
						portalTo: document.body,
						mouseLeaveDelay: 0,
						placement: 'left',
					}}
					source="contact_suggestions"
				>
					{button}
				</QuickInfoCard>
			);
		}

		return (
			<Tooltip placement="left" content={translator.gettext('Show details')}>
				{button}
			</Tooltip>
		);
	};

	return (
		<div className={styles.duplicates} data-test="duplicates-popover">
			<header className={styles.header}>
				<Text>
					<h5>{translator.gettext('Possible duplicate')}</h5>
					<Button color="ghost" className={styles.close} onClick={togglePopover}>
						<Icon size="s" icon="cross" />
					</Button>
				</Text>
			</header>

			{duplicates.map((duplicate) => (
				<Text className={styles.popoverContent} key={duplicate.id}>
					{allowPick && (
						<div
							className={styles.pick}
							onClick={() => pickContact({ id: duplicate.id, name: duplicate.title })}
						>
							<Button size="s">{translator.gettext('Pick')}</Button>
						</div>
					)}
					<div className={styles.content}>
						<div className={styles.title}>
							<HighlightText searchWords={[searchParams.name || '']} textToHighlight={duplicate.title} />
						</div>

						{duplicate.details.email && (
							<span className={styles.details}>
								<HighlightText
									searchWords={[searchParams.email || '']}
									textToHighlight={duplicate.details.email}
								/>
							</span>
						)}

						{duplicate.details.phone && (
							<span className={styles.details}>
								<HighlightText
									searchWords={[searchParams.phone || '']}
									textToHighlight={duplicate.details.phone}
								/>
							</span>
						)}

						{duplicate.details.org_address && (
							<span className={styles.details}>
								<HighlightText
									searchWords={[searchParams.address || '']}
									textToHighlight={duplicate.details.org_address}
								/>
							</span>
						)}
					</div>
					<div className={styles.linkWrap}>{renderDetailsLink(duplicate)}</div>
				</Text>
			))}
			<footer className={styles.footer}>
				<Checkbox checked={isAutomaticallyOpeningDuplicateChecker} onChange={toggleCheckbox} />
				<span>{translator.gettext('Show matches as I type')}</span>
			</footer>
		</div>
	);
};
