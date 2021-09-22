import React from 'react';
import Downshift, { ControllerStateAndHelpers } from 'downshift';
import {
	Avatar,
	Input,
	Dropmenu,
	Option,
	AvatarProps,
	Separator,
	Spacing,
} from '@pipedrive/convention-ui-react';
import classNames from 'classnames';
import { useTranslator } from '@pipedrive/react-utils';

import { SharingOptionType } from '../../../../types/apollo-query-types';

import styles from './UserSelectInput.pcss';

export type SearchOption = {
	id: number | null;
	name: string;
	type: SharingOptionType;
	iconUrl?: string;
	numberOfUsers?: number;
};

type UserSelectOptions = {
	users: SearchOption[];
	teams: SearchOption[];
	everyone: SearchOption[];
};

interface UserSelectInputProps {
	placeholder: string;
	onOptionSelected: (value: SearchOption | null) => void;
	options: UserSelectOptions;
}

const hasOnlyEmptyArrays = (object: UserSelectOptions) =>
	Object.values(object)?.every((type) => type.length === 0);

const UserSelectInput = ({
	placeholder,
	onOptionSelected,
	options,
}: UserSelectInputProps) => {
	const translator = useTranslator();

	const getFilteredItems = (
		items: SearchOption[],
		downshiftProps: ControllerStateAndHelpers<any>,
	) => {
		return items.filter((item) => {
			if (downshiftProps.inputValue && item.name) {
				return item.name
					.toLowerCase()
					.includes(downshiftProps.inputValue.toLowerCase());
			}

			return true;
		});
	};

	const infoMessage = (message: string) => (
		<div className={styles.dropmenuContainer}>
			<Spacing horizontal="m">
				<div className={styles.infoMessage}>{message}</div>
			</Spacing>
		</div>
	);

	const renderOption = (
		item: SearchOption,
		index: number,
		downshiftProps: ControllerStateAndHelpers<any>,
	) => {
		const isHighlighted = downshiftProps.highlightedIndex === index;
		const isUserOption = item.type === SharingOptionType.USER;
		const isEveryoneOption = item.type === SharingOptionType.EVERYONE;
		const optionAdditionalInfo =
			item.numberOfUsers > 0 ? (
				<div
					className={classNames(styles.optionAdditionalInfo, {
						[styles.highlightedOption]: isHighlighted,
					})}
				>
					{translator.ngettext(
						'%d member',
						'%d members',
						item.numberOfUsers,
						item.numberOfUsers,
					)}
				</div>
			) : null;

		return (
			<Option
				{...downshiftProps.getItemProps({
					key: `${item.type}-${item.id}`,
					index,
					item,
				})}
				className={classNames(styles.dropmenuOption, {
					[styles.highlightedOption]: isHighlighted,
				})}
				highlighted={isHighlighted}
				data-test={`user-option-${item.id}`}
			>
				{!isEveryoneOption && (
					<Avatar
						img={item.iconUrl}
						type={item.type as AvatarProps['type']}
						size="s"
						{...(isUserOption ? { name: item.name } : {})}
					/>
				)}

				<div
					className={classNames(styles.optionLabel, {
						[styles.everyoneOptionLabel]: isEveryoneOption,
					})}
				>
					{item.name}
					{optionAdditionalInfo}
				</div>
			</Option>
		);
	};

	const renderDropdown = (downshiftProps: ControllerStateAndHelpers<any>) => {
		if (hasOnlyEmptyArrays(options)) {
			return infoMessage(
				translator.gettext('Already shared with all users'),
			);
		}

		const filtered = {
			everyone: getFilteredItems(options.everyone, downshiftProps),
			users: getFilteredItems(options.users, downshiftProps),
			teams: getFilteredItems(options.teams, downshiftProps),
		};

		if (hasOnlyEmptyArrays(filtered)) {
			return infoMessage(translator.gettext('No results were found'));
		}

		const shouldRenderEveryone = filtered.everyone.length > 0;
		const shouldRenderTeams = filtered.teams.length > 0;
		const shouldRenderUsersBlockSeparator =
			shouldRenderEveryone || shouldRenderTeams;

		return (
			<div className={styles.dropmenuContainer}>
				{shouldRenderEveryone &&
					renderOption(filtered.everyone[0], 0, downshiftProps)}

				{shouldRenderTeams && (
					<>
						{shouldRenderEveryone && <Separator />}
						{filtered.teams.map((item, index) =>
							renderOption(
								item,
								index + filtered.everyone.length,
								downshiftProps,
							),
						)}
					</>
				)}

				{filtered.users.length > 0 && (
					<>
						{shouldRenderUsersBlockSeparator && <Separator />}
						{filtered.users.map((item, index) =>
							renderOption(
								item,
								index +
									filtered.teams.length +
									filtered.everyone.length,
								downshiftProps,
							),
						)}
					</>
				)}
			</div>
		);
	};

	const renderInput = (downshiftProps: ControllerStateAndHelpers<any>) => {
		return (
			<Input
				type="text"
				placeholder={placeholder}
				icon="search"
				iconPosition="right"
				onClick={() => downshiftProps.openMenu()}
				{...downshiftProps.getInputProps()}
				data-test="user-select-input-field"
			/>
		);
	};

	return (
		<Downshift
			onChange={(
				selectedItem,
				downshiftProps: ControllerStateAndHelpers<any>,
			) => {
				if (selectedItem?.value === undefined) {
					downshiftProps.clearSelection();
					onOptionSelected(selectedItem);
				}
			}}
			itemToString={() => ''}
		>
			{(downshiftProps) => (
				<div>
					<Dropmenu
						content={renderDropdown(downshiftProps)}
						popoverProps={{ visible: downshiftProps.isOpen }}
					>
						{renderInput(downshiftProps)}
					</Dropmenu>
				</div>
			)}
		</Downshift>
	);
};

export default UserSelectInput;
