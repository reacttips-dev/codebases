import { observer } from 'mobx-react-lite';
import {
    outlookComOption,
    gmailOption,
    yahooMailOption,
    outlookOption,
    currentOptionLabel,
    goToSettingsLabel,
    hotKeysMapCloseButton,
} from './HotkeysMap.locstring.json';
import loc, { format, formatToArray } from 'owa-localize';
import * as React from 'react';
import KeyboardShortcutsMode from 'owa-service/lib/contract/KeyboardShortcutsMode';

import setIsHotkeysMapVisible from '../actions/setIsHotkeysMapVisible';
import store from '../store/Store';
import TwoColumn from './TwoColumn';
import { getUserConfiguration } from 'owa-session-store';
import { HotkeyCommand, useGlobalHotkey, fixUpHotkeyCommand } from 'owa-hotkeys';
import { ControlIcons } from 'owa-control-icons';
import { convertModeToKey } from 'owa-readable-hotkeys/lib/utils/convertModeToKey';
import { convertHotkeyStringToReadableText } from 'owa-readable-hotkeys/lib/utils/convertHotkeyStringToReadableText';
import type { CommandCategory } from './CommandCategory';

import { IconButton } from '@fluentui/react/lib/Button';
import { Link } from '@fluentui/react/lib/Link';
import { Modal } from '@fluentui/react/lib/Modal';

import styles from './HotkeysMap.scss';

/**
 * To ensure each module is consistent, this component handles the hotkey for
 * invoking the hotkeys map, which is the "?" key.
 */
const SHOW_HOTKEYS_MAP_HOTKEY = '?';

export interface HotkeysMapProps {
    // Array of objects that describe the groups of commands.
    commandCategories: CommandCategory[];

    // Optional callback to bring user to options. Footer will not be rendered if falsy.
    goToOptions?: () => void;

    // Array of objects that represent the hotkeys to be displayed.
    hotkeyCommands: HotkeyCommand[];

    // Number of categories on the first column
    firstColumnLength?: number;
}

export default observer(function HotkeysMap(props: HotkeysMapProps) {
    useGlobalHotkey(
        {
            hotmail: SHOW_HOTKEYS_MAP_HOTKEY,
            yahoo: SHOW_HOTKEYS_MAP_HOTKEY,
            gmail: SHOW_HOTKEYS_MAP_HOTKEY,
            owa: SHOW_HOTKEYS_MAP_HOTKEY,
        },
        showHotkeysMap
    );
    /**
     * Renders the groups of hotkey commands with headers.
     * @param commandCategories CommandCategory objects with hotkey commands set
     */
    const renderHotkeyCommandCategories = (commandCategories: CommandCategory[]): JSX.Element[] => {
        return commandCategories.map((commandCategory: CommandCategory) => (
            <div className={styles.commandCategoryContainer} key={commandCategory.displayName}>
                <h3>{commandCategory.displayName}</h3>
                {renderCommands(getHotkeysForCommand(commandCategory))}
            </div>
        ));
    };
    /**
     * Renders the footer of the hotkeys modal, which tells the user
     * what style shortcuts they currently have enabled, as well as provides a
     * link to the settings page to change the style.
     */
    const renderFooter = () => {
        const keyboardShortcutsMode = getUserConfiguration().UserOptions.KeyboardShortcutsMode;
        let shortcutStyle = '';
        switch (keyboardShortcutsMode) {
            case KeyboardShortcutsMode.Hotmail:
                shortcutStyle = loc(outlookComOption);
                break;
            case KeyboardShortcutsMode.Gmail:
                shortcutStyle = loc(gmailOption);
                break;
            case KeyboardShortcutsMode.Yahoo:
                shortcutStyle = loc(yahooMailOption);
                break;
            case KeyboardShortcutsMode.Owa:
                shortcutStyle = loc(outlookOption);
                break;
        }
        return (
            <div className={styles.footer}>
                {formatToArray(
                    '{0} {1}',
                    <span>{format(loc(currentOptionLabel), shortcutStyle)}</span>,
                    <Link onClick={onGoToOptionsClick}>{loc(goToSettingsLabel)}</Link>
                )}
            </div>
        );
    };
    /**
     * Handler for clicking on the link to go to the options page. It brings
     * the user to the options page and also dismisses the modal.
     */
    const onGoToOptionsClick = () => {
        // Dismiss modal window.
        onDismiss();
        // Go to settings.
        props.goToOptions?.();
    };
    /**
     * Gets hotkey commands that belong to given category.
     * @param commandCategory The target category to find hotkey commands for
     */
    const getHotkeysForCommand = (commandCategory: CommandCategory): HotkeyCommand[] => {
        /**
         * Get hotkey commands from master list that belong to the current
         * category and assign them to the category.
         */
        return props.hotkeyCommands.filter((hotkeyCommand: HotkeyCommand) => {
            return hotkeyCommand.category === commandCategory.category;
        });
    };
    const shouldRenderFooter: boolean = props.goToOptions ? true : false;
    return (
        <Modal isOpen={store.isVisible} onDismiss={onDismiss}>
            <IconButton
                className={styles.closeButton}
                iconProps={{
                    iconName: ControlIcons.Cancel,
                }}
                onClick={onDismiss}
                aria-label={loc(hotKeysMapCloseButton)}
            />
            <div
                className={
                    shouldRenderFooter ? styles.containerWithFooter : styles.containerWithoutFooter
                }>
                <TwoColumn firstColumnLength={props.firstColumnLength}>
                    {renderHotkeyCommandCategories(props.commandCategories)}
                </TwoColumn>
            </div>
            {shouldRenderFooter && renderFooter()}
        </Modal>
    );
});

/**
 * Key handler to show the modal window.
 */
function showHotkeysMap() {
    const keyboardShortcutsMode = getUserConfiguration().UserOptions.KeyboardShortcutsMode;
    // If keyboard shortcuts are disabled, take no action.
    if (keyboardShortcutsMode !== KeyboardShortcutsMode.Off) {
        setIsHotkeysMapVisible(true);
    }
}

/**
 * Called to hide the modal window.
 */
function onDismiss() {
    setIsHotkeysMapVisible(false);
}

/**
 * Provides the elements to render for the given commands.
 * @param commands The commands to be rendered
 */
function renderCommands(commands: HotkeyCommand[]): JSX.Element[] {
    // Get the name of the keyboard shortcuts style the user has enabled.
    const keyboardShortcutsMode = getUserConfiguration().UserOptions.KeyboardShortcutsMode;
    const modeKey = convertModeToKey(keyboardShortcutsMode);
    /**
     * Iterates over the commands and creates an element for each command,
     * provided it has a hotkey for the style of keyboard shortcuts the user
     * has enabled.
     *
     * The keys are preprocessed based on platform, browser, etc prior to
     * being converted to display-friendly form in order to match the actual
     * registered bindings.
     */
    return commands
        .filter((command: HotkeyCommand) => command[modeKey])
        .map((command: HotkeyCommand) => (
            <span className={styles.shortcut} key={command.description}>
                <span className={styles.description}>{command.description}</span>
                <span className={styles.hotkey}>
                    {convertHotkeyStringToReadableText(fixUpHotkeyCommand(command)[modeKey])}
                </span>
            </span>
        ));
}
