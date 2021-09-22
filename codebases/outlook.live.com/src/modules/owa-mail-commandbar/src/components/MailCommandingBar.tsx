import {
    sweep,
    undoCommandingBar,
    previousLabel,
    nextLabel,
    customizeToolbar,
    viewEmailFromNoteLabel,
} from './MailCommandingBar.locstring.json';
import { moveTo } from 'owa-locstrings/lib/strings/moveto.locstring.json';
import { stopIgnoring } from 'owa-locstrings/lib/strings/stopignoring.locstring.json';
import { ignore } from 'owa-locstrings/lib/strings/ignore.locstring.json';
import { unpin } from 'owa-locstrings/lib/strings/unpin.locstring.json';
import { snooze } from 'owa-locstrings/lib/strings/snooze.locstring.json';
import { categoryMenuItemMenuText } from 'owa-locstrings/lib/strings/categorymenuitemmenutext.locstring.json';
import { print } from 'owa-locstrings/lib/strings/print.locstring.json';
import { unflag } from 'owa-locstrings/lib/strings/unflag.locstring.json';
import { block } from 'owa-locstrings/lib/strings/block.locstring.json';
import { phishing } from 'owa-locstrings/lib/strings/phishing.locstring.json';
import { notjunk } from 'owa-locstrings/lib/strings/notjunk.locstring.json';
import { junk } from 'owa-locstrings/lib/strings/junk.locstring.json';
import { restoreItem } from 'owa-locstrings/lib/strings/restoreitem.locstring.json';
import { restoreAll } from 'owa-locstrings/lib/strings/restoreall.locstring.json';
import { mailEllipsisAriaLabelText } from 'owa-locstrings/lib/strings/mailellipsisarialabeltext.locstring.json';
import { newMailAction, newNoteAction } from '../strings.locstring.json';
import { markAsRead } from 'owa-locstrings/lib/strings/markasread.locstring.json';
import { markAllAsRead } from 'owa-locstrings/lib/strings/markallasread.locstring.json';
import { flag } from 'owa-locstrings/lib/strings/flag.locstring.json';
import { pin } from 'owa-locstrings/lib/strings/pin.locstring.json';
import { archive } from 'owa-locstrings/lib/strings/archive.locstring.json';
import { deleteItem } from 'owa-locstrings/lib/strings/deleteitem.locstring.json';
import { showInImmersiveReader as showInImmersiveReader_1 } from 'owa-locstrings/lib/strings/showinimmersivereader.locstring.json';
import { itemHeaderTranslate } from 'owa-locstrings/lib/strings/itemheadertranslate.locstring.json';
import { createRule } from 'owa-locstrings/lib/strings/createrule.locstring.json';
import { assignPolicyMenuItemName } from 'owa-locstrings/lib/strings/assignpolicymenuitemname.locstring.json';
import { markAsUnread } from 'owa-locstrings/lib/strings/markasunread.locstring.json';
import { itemHeaderForward } from 'owa-locstrings/lib/strings/itemheaderforward.locstring.json';
import { itemHeaderReplyAll } from 'owa-locstrings/lib/strings/itemheaderreplyall.locstring.json';
import { itemHeaderReply } from 'owa-locstrings/lib/strings/itemheaderreply.locstring.json';
import loc from 'owa-localize';
/* tslint:disable:jsx-no-lambda WI:47708 */
import onArchive from 'owa-mail-commands/lib/actions/onArchive';
import { onReply, onReplyAll, onForward } from 'owa-mail-commands/lib/actions/onResponse';
import { onFlagUnflag } from 'owa-mail-commands/lib/actions/onFlagUnflag';
import onBlock from 'owa-mail-commands/lib/actions/onBlock';
import onCreateRule from 'owa-mail-commands/lib/actions/onCreateRule';
import onDelete from 'owa-mail-commands/lib/actions/onDelete';
import onIgnoreStopIgnore from 'owa-mail-commands/lib/actions/onIgnoreStopIgnore';
import onJunkNotJunk from 'owa-mail-commands/lib/actions/onJunkNotJunk';
import onMarkAsPhishing from 'owa-mail-commands/lib/actions/onMarkAsPhishing';
import onMarkAsReadUnread from 'owa-mail-commands/lib/actions/onMarkAsReadUnread';
import onPinUnpin from 'owa-mail-commands/lib/actions/onPinUnpin';
import onPrint from 'owa-mail-commands/lib/actions/onPrint';
import onRestore from 'owa-mail-commands/lib/actions/onRestore';
import onShowInImmersiveReader from 'owa-mail-commands/lib/actions/onShowInImmersiveReader';
import onSnooze from 'owa-mail-commands/lib/actions/onSnooze';
import onSweep from 'owa-mail-commands/lib/actions/onSweep';
import onTranslate from 'owa-mail-commands/lib/actions/onTranslate';
import onUndo from 'owa-mail-commands/lib/actions/onUndo';
import * as lazyTriageActions from 'owa-mail-triage-action';
import * as React from 'react';
import * as undoActions from 'owa-mail-undo';
import checkAndCreateNewMessage from 'owa-mail-message-actions/lib/actions/checkAndCreateNewMessage';
import createSnoozeSubMenu from 'owa-mail-datepicker/lib/utils/createSnoozeSubMenu';
import getMailMenuItemShouldDisable from 'owa-mail-filterable-menu-behavior/lib/actions/getMailMenuItemShouldDisable';
import { isImmersiveReadingPaneShown } from 'owa-mail-layout/lib/selectors/isImmersiveReadingPaneShown';
import isReplyAllTheDefaultResponse from 'owa-mail-reading-pane-store/lib/utils/isReplyAllTheDefaultResponse';
import { classNamesFunction } from '@fluentui/react/lib/Utilities';
import { CommandBarButton } from '@fluentui/react/lib/Button';
import { computed } from 'mobx';
import { ControlIcons } from 'owa-control-icons';
import { SurfaceActionIcons } from 'owa-surface-action-icons';
import {
    DisplayOption,
    FilterableCommandBar,
    FilterableMenuItem,
    FilterableMenuItemArgs,
} from 'owa-filterable-menu';
import { lazyGetAssignPolicyPropertiesForMailContextMenu } from 'owa-mail-retention-policies';
import { getCategoryMenuPropertiesForCommandBar } from 'owa-mail-category-view';
import { getGroupId } from 'owa-group-utils';
import { getMailMenuItemShouldShowMap, MenuItemType } from 'owa-mail-filterable-menu-behavior';
import {
    getMenuItemStyles,
    IMenuItemStyles,
    IContextualMenuItem,
} from '@fluentui/react/lib/ContextualMenu';
import { getMoveToPropertiesForCommandBar } from 'owa-mail-movetofolder-view';
import { getTheme, ITheme } from '@fluentui/react/lib/Styling';
import { Icon } from '@fluentui/react/lib/Icon';
import { isBulkActionRunning } from 'owa-bulk-action-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import { MailIcons } from 'owa-mail-icons';
import { MailListItemSelectionSource } from 'owa-mail-store';
import { observer } from 'mobx-react';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import { selectRowInDirection } from 'owa-mail-actions/lib/mailListSelectionActions';
import { lazyMarkAsReadInTable, lazyOnNavigateAwayViaUpDown } from 'owa-mail-mark-read-actions';
import {
    getIsEverythingSelectedInTable,
    listViewStore,
    TableQueryType,
    TableView,
    SelectionDirection,
    isItemPartOperation,
    isFolderPaused,
} from 'owa-mail-list-store';
import getEmptyFolderText from 'owa-mail-list-store/lib/utils/getEmptyFolderText';
import type { OwaDate } from 'owa-datetime';
import { lazyOpenCompose } from 'owa-mail-compose-actions';
import NewMessageButton from './NewMessageButton';
import { lazyIsUpNextEventReady, UpNextV2 } from 'owa-upnext-v2';
import { lazyCreateNewNote, lazyDeleteNote, lazyViewEmailFromNote } from 'owa-notes-store';
import { NoteColorButton } from 'owa-notes-components';
import getDateOptions from 'owa-mail-datepicker/lib/utils/getDateOptions';
import { CommandBarAction, commandBarActionStore } from 'owa-mail-commandbar-actions';
import {
    getCommandBarDisplayOption,
    getCommandBarDirectionalHint,
} from '../utils/getCommandBarDisplayOption';
import { default as commandBarStore } from '../store/store';
import {
    CommandBarEditorContainer,
    shouldGoAboveDividerInCommandBarOverflowMenu,
    lazyOnOpenEditor,
    getStore as getCommandBarEditorStore,
} from 'owa-mail-commandbar-editor';
import { onOverflowMenuVisibilityChanged } from '../actions/onOverflowMenuVisibilityChanged';
import { lazyTryValidateDumpsterQuota } from 'owa-storage-store';
import LeftPaneHamburgerButton from './LeftPaneHamburgerButton';
import { shouldShowFolderPaneAsOverlay, shouldShowFolderPane } from 'owa-mail-layout';
import { getIsBitSet, ListViewBitFlagsMasks } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import { LazyCommandingModeMenu } from 'owa-commanding-mode-menu';
import styles from './MailCommandingBar.scss';
import classNames from 'classnames';
import { default as Add } from 'owa-fluent-icons-svg/lib/icons/AddRegular';
import { default as Tag } from 'owa-fluent-icons-svg/lib/icons/TagRegular';
import { default as Color } from 'owa-fluent-icons-svg/lib/icons/ColorRegular';
import { default as Mail } from 'owa-fluent-icons-svg/lib/icons/MailRegular';
import { default as ArrowReplyAll } from 'owa-fluent-icons-svg/lib/icons/ArrowReplyAllRegular';
import { default as ArrowReply } from 'owa-fluent-icons-svg/lib/icons/ArrowReplyRegular';
import { default as Delete } from 'owa-fluent-icons-svg/lib/icons/DeleteRegular';
import { default as ArrowHookUpLeft } from 'owa-fluent-icons-svg/lib/icons/ArrowHookUpLeftRegular';
import { default as Archive } from 'owa-fluent-icons-svg/lib/icons/ArchiveRegular';
import { default as Prohibited } from 'owa-fluent-icons-svg/lib/icons/ProhibitedRegular';
import { default as PersonProhibited } from 'owa-fluent-icons-svg/lib/icons/PersonProhibitedRegular';
import { default as Translate } from 'owa-fluent-icons-svg/lib/icons/TranslateRegular';
import { default as Broom } from 'owa-fluent-icons-svg/lib/icons/BroomRegular';
import { default as FolderArrowRight } from 'owa-fluent-icons-svg/lib/icons/FolderArrowRightRegular';
import { default as MailRead } from 'owa-fluent-icons-svg/lib/icons/MailReadRegular';
import { default as Clock } from 'owa-fluent-icons-svg/lib/icons/ClockRegular';
import { default as Flag } from 'owa-fluent-icons-svg/lib/icons/FlagRegular';
import { default as FlagFilled } from 'owa-fluent-icons-svg/lib/icons/FlagFilled';
import { default as Pin } from 'owa-fluent-icons-svg/lib/icons/PinRegular';
import { default as PinFilled } from 'owa-fluent-icons-svg/lib/icons/PinFilled';
import { default as Print } from 'owa-fluent-icons-svg/lib/icons/PrintRegular';
import { default as ImmersiveReader } from 'owa-fluent-icons-svg/lib/icons/ImmersiveReaderRegular';
import { default as ArrowUndo } from 'owa-fluent-icons-svg/lib/icons/ArrowUndoRegular';
import { default as ArrowUp } from 'owa-fluent-icons-svg/lib/icons/ArrowUpRegular';
import { default as ArrowDown } from 'owa-fluent-icons-svg/lib/icons/ArrowDownRegular';
import { default as Warning } from 'owa-fluent-icons-svg/lib/icons/WarningRegular';
import { default as Block } from 'owa-fluent-icons-svg/lib/icons/BlockRegular';
import { default as MailDismiss } from 'owa-fluent-icons-svg/lib/icons/MailDismissRegular';
import { default as FolderMail } from 'owa-fluent-icons-svg/lib/icons/FolderMailRegular';
import { default as MailSettings } from 'owa-fluent-icons-svg/lib/icons/MailSettingsRegular';
import { default as MailProhibited } from 'owa-fluent-icons-svg/lib/icons/MailProhibitedRegular';

const getClassNames = classNamesFunction<ITheme, IMenuItemStyles>();

const commandBarActionSource = 'CommandBar';

const enum ResponseType {
    Reply,
    ReplyAll,
    Forward,
}

export interface MailCommandingBarProps {
    tableViewId: string;
}

@observer
export default class MailCommandingBar extends React.Component<MailCommandingBarProps, {}> {
    private shouldShowBehaviorMap;
    constructor(props: MailCommandingBarProps) {
        super(props);
        this.shouldShowBehaviorMap = getMailMenuItemShouldShowMap();
    }
    private hasDensityNext = isFeatureEnabled('mon-densities');

    /**
     * UpNext component is delay rendered and its not guaranteed that there will be an event
     * always to render in this component. When it delay renders with an event, commanding bar has already done
     * calculations to determine how many items can fit, this will sometimes leave no space for UpNext
     * and UpNext shall be cut off. To fix this, we can update the cache key used for this component. Whenever a cacheKey
     * for any commandbar item changes it triggers a remeasure.
     */
    @computed
    get cacheKeyForUpNextItem(): string {
        if (isFeatureEnabled('tri-upNextV2')) {
            const isUpNextEventReady = lazyIsUpNextEventReady.tryImportForRender();
            if (isUpNextEventReady?.()) {
                return 'UpNextReady';
            }
        }
        return 'UpNext';
    }

    @computed
    get tableView(): TableView {
        return listViewStore.tableViews.get(this.props.tableViewId)!;
    }

    @computed
    get isItemPartCommandBarOperation(): boolean {
        return isItemPartOperation();
    }

    @computed
    get commandBarMargins(): string | undefined {
        if (
            !shouldShowFolderPane() ||
            shouldShowFolderPaneAsOverlay() ||
            isFeatureEnabled('mon-tri-commandbarStyling')
        ) {
            return undefined;
        }

        if (isFeatureEnabled('mon-ribbon')) {
            return getIsBitSet(ListViewBitFlagsMasks.HideSenderImage)
                ? styles.marginSenderImageOffAndRibbon
                : styles.marginSenderImageAndRibbon;
        }

        return getIsBitSet(ListViewBitFlagsMasks.HideSenderImage)
            ? styles.marginSenderImageOff
            : styles.marginSenderImage;
    }

    render() {
        return (
            <>
                {getCommandBarEditorStore().isEditing && <CommandBarEditorContainer />}
                <FilterableCommandBar
                    className={this.commandBarMargins}
                    filterableItems={this.commandingBarItems}
                    elipisisAriaLabel={loc(mailEllipsisAriaLabelText)}
                    onOverflowMenuVisibilityChanged={onOverflowMenuVisibilityChanged}
                    isOverflowMenuOpen={commandBarStore.isOverflowMenuOpen}
                    isMailModule={true}
                />
            </>
        );
    }

    @computed
    private get commandingBarItems(): any {
        return [
            ...this.leftItemsToDisplay,
            ...this.overflowItemsToDisplay,
            ...this.rightItemsToDisplay,
        ];
    }

    @computed
    private get leftItemsToDisplay(): FilterableMenuItem[] {
        const { surfaceActions } = commandBarActionStore;
        const leftItemsToDisplay = this.getItemsToDisplay(
            surfaceActions,
            false /* isOverflowMenu */
        );

        // Insert restore for deleted items and not junk, blocked, and phishing to surface for junk folder.
        // They appear in special folders as the second item (not including if reply is first)
        let indexToInsert = surfaceActions.indexOf(CommandBarAction.Reply) === 0 ? 2 : 1;
        const notJunkMenuItems = [
            this.notJunkMenuItem,
            this.markAsPhishingMenuItem,
            this.blockMenuItem,
        ];
        leftItemsToDisplay.splice(indexToInsert, 0, this.restoreMenuItem, ...notJunkMenuItems);
        // Insert newMessage, empty folder, and markAllAsRead, restoreAll menu items at the beginning
        leftItemsToDisplay.unshift(
            this.hamburgerItem,
            this.newMessageItem,
            this.newNoteItem,
            this.deleteNoteMenuItem,
            this.changeNoteColorMenuItem,
            this.viewEmailFromNoteMenuItem,
            this.emptyFolderMenuItem,
            this.markAllAsReadMenuItem,
            this.restoreAllMenuItem
        );
        return leftItemsToDisplay;
    }

    @computed
    private get overflowItemsToDisplay(): FilterableMenuItem[] {
        const { overflowActions } = commandBarActionStore;
        const overflowItemsToDisplay = this.getItemsToDisplay(
            overflowActions,
            true /* isOverflowMenu */
        );

        // Insert customize toolbar prompt at very end of overflow menu
        overflowItemsToDisplay.push(this.overflowDivider, this.customizeToolbarItem);
        return overflowItemsToDisplay;
    }

    @computed
    private get rightItemsToDisplay(): FilterableMenuItem[] {
        // Handle right aligned items
        const rightItemsToDisplay: FilterableMenuItem[] = [];
        const isInImmersiveReadingPane = isImmersiveReadingPaneShown();

        rightItemsToDisplay.push(this.pseudoItemForCorrection);

        // Show UpNext only when not in immersive RP
        if (isFeatureEnabled('tri-upNextV2') && !isInImmersiveReadingPane) {
            rightItemsToDisplay.push(this.upNextMenuItem);
        }

        if (isFeatureEnabled('mon-ribbon')) {
            rightItemsToDisplay.push(this.commandingModeMenuItem);
        }

        // Items to display on the right in immersive view.
        // These items depend on the list view selection.
        // We are not doing this using behavior as it ends up rendering the commanding bar when the selection changes.
        // This behavior is handled in this file itself
        if (isInImmersiveReadingPane) {
            rightItemsToDisplay.push(this.selectPreviousMenuItem);
            rightItemsToDisplay.push(this.selectNextMenuItem);
        }
        return rightItemsToDisplay;
    }

    private getItemsToDisplay(
        commandBarActions: CommandBarAction[],
        isOverflowMenu: boolean
    ): FilterableMenuItem[] {
        const menuItems: FilterableMenuItem[] = [];
        let hasAddedOverflowDivider = false;
        for (const action of commandBarActions) {
            // Add an overflow divider before the first non-triage action button in the overflow menu
            if (
                !hasAddedOverflowDivider &&
                isOverflowMenu &&
                !shouldGoAboveDividerInCommandBarOverflowMenu(action)
            ) {
                menuItems.push(this.overflowDivider);
                hasAddedOverflowDivider = true;
            }
            switch (action) {
                case CommandBarAction.Reply:
                    if (this.replyMenuItem) {
                        menuItems.push(this.replyMenuItem);
                    }
                    break;
                case CommandBarAction.Delete:
                    menuItems.push(this.deleteMenuItem);
                    break;
                case CommandBarAction.Archive:
                    menuItems.push(this.archiveDraftMenuItem);
                    break;
                case CommandBarAction.Junk:
                    menuItems.push(this.junkMenuItem);
                    break;
                case CommandBarAction.Sweep:
                    menuItems.push(this.sweepMenuItem);
                    break;
                case CommandBarAction.Move:
                    menuItems.push(this.moveToMenuItem);
                    break;
                case CommandBarAction.Categorize:
                    menuItems.push(this.categoryMenuItem);
                    break;
                case CommandBarAction.Snooze:
                    menuItems.push(this.scheduleMenuItem);
                    break;
                case CommandBarAction.Undo:
                    menuItems.push(this.undoMenuItem);
                    break;
                case CommandBarAction.MarkReadUnread:
                    menuItems.push(this.markAsUnreadMenuItem);
                    menuItems.push(this.markAsReadMenuItem);
                    break;
                case CommandBarAction.FlagUnflag:
                    menuItems.push(this.flagMenuItem);
                    menuItems.push(this.unflagMenuItem);
                    break;
                case CommandBarAction.PinUnpin:
                    menuItems.push(this.pinMenuItem);
                    menuItems.push(this.unpinMenuItem);
                    break;
                case CommandBarAction.IgnoreUnignore:
                    menuItems.push(this.ignoreMenuItem);
                    menuItems.push(this.stopIgnoringMenuItem);
                    break;
                case CommandBarAction.CreateRule:
                    menuItems.push(this.createRuleMenuItem);
                    break;
                case CommandBarAction.Print:
                    menuItems.push(this.printMenuItem);
                    break;
                case CommandBarAction.Translate:
                    menuItems.push(this.translateMenuItem);
                    break;
                case CommandBarAction.ShowImmersiveReader:
                    menuItems.push(this.showInImmersiveReaderMenuItem);
                    break;
                case CommandBarAction.AssignPolicy:
                    menuItems.push(this.assignPolicyMenuItem);
                    break;
                default:
                    break;
            }
        }
        return menuItems;
    }

    @computed
    private get hamburgerItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: 'hamburgerMenu',
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.Hamburger],
            [FilterableMenuItemArgs.onRender]: () => {
                return (
                    <LeftPaneHamburgerButton
                        isPaneExpanded={shouldShowFolderPane() && shouldShowFolderPaneAsOverlay()}
                    />
                );
            },
        });
    }

    @computed
    private get newMessageItem(): FilterableMenuItem {
        const onClick = () => {
            const groupId = !isFeatureEnabled('grp-groupHeaderV2') ? this.groupId : null;

            checkAndCreateNewMessage(commandBarActionSource, groupId);
        };
        const renderFluentHeroButton = () => {
            return (
                <NewMessageButton
                    scenario={'default'}
                    onClick={onClick}
                    onMouseOver={() => lazyOpenCompose.import()}
                />
            );
        };
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(newMailAction),
            [FilterableMenuItemArgs.onClick]: onClick,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.NewMessage
            ],
            [FilterableMenuItemArgs.disabled]: getMailMenuItemShouldDisable(
                MenuItemType.NewMessage
            ),
            [FilterableMenuItemArgs.onRender]: renderFluentHeroButton,
        });
    }

    @computed
    private get newNoteItem(): FilterableMenuItem {
        const renderFluentHeroButton = () => {
            return (
                <NewMessageButton
                    scenario={'notes'}
                    onClick={this.onNewNoteButtonClicked}
                    onMouseOver={() => lazyCreateNewNote.import()}
                />
            );
        };

        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(newNoteAction),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Add : ControlIcons.Add,
            [FilterableMenuItemArgs.onClick]: this.onNewNoteButtonClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.NewNote],
            [FilterableMenuItemArgs.onRender]: renderFluentHeroButton,
        });
    }

    private onNewNoteButtonClicked() {
        lazyCreateNewNote.importAndExecute('NotesFolder');
    }

    @computed
    private get groupId(): string {
        return getGroupId(this.tableView);
    }

    @computed
    private get categoryMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(categoryMenuItemMenuText),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Tag : ControlIcons.Tag,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.Categories
            ],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.Categorize
            ),
            [FilterableMenuItemArgs.menuContent]: getCategoryMenuPropertiesForCommandBar(
                this.tableView,
                commandBarActionSource,
                getCommandBarDirectionalHint(CommandBarAction.Categorize)
            ),
        });
    }

    private get changeNoteColorMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Color : ControlIcons.Color,
            [FilterableMenuItemArgs.displayOption]: DisplayOption.Left,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.NoteActions
            ],
            [FilterableMenuItemArgs.menuContent]: [],
            [FilterableMenuItemArgs.key]: 'changeNoteColor',
            [FilterableMenuItemArgs.onRender]: () => {
                return <NoteColorButton />;
            },
        });
    }

    @computed
    private get viewEmailFromNoteMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(viewEmailFromNoteLabel),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Mail : ControlIcons.Mail,
            [FilterableMenuItemArgs.onClick]: this.onViewEmailFromNoteClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.ViewEmailFromNote
            ],
        });
    }

    private hasNeutralTextColor = isFeatureEnabled('mon-tri-commandbarStyling');
    private fluentReplyButtonStyles = {
        splitButtonMenuIcon: classNames(
            styles.replyButtonContent,
            this.hasNeutralTextColor && styles.neutralTextColor
        ),
        splitButtonContainer: styles.replyButtonContainerFluent,
        splitButtonMenuButton: styles.replyButtonMenuButtonFluent,
        root: styles.replyButtonRootFluent,
        label: classNames(
            styles.replyButtonContent,
            this.hasNeutralTextColor && styles.neutralTextColor
        ),
        icon: styles.replyButtonContent,
    };

    @computed
    private get replyMenuItem() {
        if (this.shouldHideReplyMenu) {
            return null;
        }

        const isReplyAll = isReplyAllTheDefaultResponse();
        const displayOption = getCommandBarDisplayOption(CommandBarAction.Reply);
        let text = loc(itemHeaderReply);
        let icon;
        let key = 'replyMain';
        if (isReplyAll) {
            text = loc(itemHeaderReplyAll);
            icon = this.hasDensityNext ? ArrowReplyAll : ControlIcons.ReplyAll;
            key = 'replyAllMain';
        } else {
            this.hasDensityNext ? ArrowReply : ControlIcons.Reply;
        }
        if (displayOption === DisplayOption.Overflow) {
            return new FilterableMenuItem({
                [FilterableMenuItemArgs.name]: text,
                [FilterableMenuItemArgs.icon]: icon,
                [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                    MenuItemType.ReplyReplyAllForwardCommandBar
                ],
                [FilterableMenuItemArgs.displayOption]: displayOption,
                [FilterableMenuItemArgs.menuContent]: [
                    new FilterableMenuItem({
                        [FilterableMenuItemArgs.name]: loc(itemHeaderReply),
                        [FilterableMenuItemArgs.onClick]: () =>
                            this.onRespondToRow(ResponseType.Reply),
                        [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                            MenuItemType.Reply
                        ],
                    }),
                    new FilterableMenuItem({
                        [FilterableMenuItemArgs.name]: loc(itemHeaderReplyAll),
                        [FilterableMenuItemArgs.onClick]: () =>
                            this.onRespondToRow(ResponseType.ReplyAll),
                        [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                            MenuItemType.ReplyAll
                        ],
                    }),
                    new FilterableMenuItem({
                        [FilterableMenuItemArgs.name]: loc(itemHeaderForward),
                        [FilterableMenuItemArgs.onClick]: () =>
                            this.onRespondToRow(ResponseType.Forward),
                        [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                            MenuItemType.Forward
                        ],
                    }),
                ],
                [FilterableMenuItemArgs.key]: key,
            });
        }

        return new FilterableMenuItem({
            [FilterableMenuItemArgs.icon]: icon,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.ReplyReplyAllForwardCommandBar
            ],
            [FilterableMenuItemArgs.displayOption]: displayOption,
            [FilterableMenuItemArgs.menuContent]: [],
            [FilterableMenuItemArgs.key]: key,
            [FilterableMenuItemArgs.onRender]: () => {
                return (
                    <CommandBarButton
                        iconProps={{ iconName: icon }}
                        data-automation-id={isReplyAll ? 'replyAll' : 'reply'}
                        text={text}
                        onClick={() =>
                            this.onRespondToRow(
                                isReplyAll ? ResponseType.ReplyAll : ResponseType.Reply
                            )
                        }
                        split={true}
                        styles={this.fluentReplyButtonStyles}
                        menuProps={{
                            items: [
                                {
                                    key: 'reply',
                                    name: loc(itemHeaderReply),
                                    disabled: !this.shouldShowBehaviorMap[MenuItemType.Reply](),
                                    onClick: () => this.onRespondToRow(ResponseType.Reply),
                                },
                                {
                                    key: 'replyall',
                                    name: loc(itemHeaderReplyAll),
                                    disabled: !this.shouldShowBehaviorMap[MenuItemType.ReplyAll](),
                                    onClick: () => this.onRespondToRow(ResponseType.ReplyAll),
                                },
                                {
                                    key: 'forward',
                                    name: loc(itemHeaderForward),
                                    disabled: !this.shouldShowBehaviorMap[MenuItemType.Forward](),
                                    onClick: () => this.onRespondToRow(ResponseType.Forward),
                                },
                            ],
                        }}
                    />
                );
            },
        });
    }

    @computed
    private get shouldHideReplyMenu(): boolean {
        return isReplyAllTheDefaultResponse()
            ? !this.shouldShowBehaviorMap[MenuItemType.ReplyAll]()
            : !this.shouldShowBehaviorMap[MenuItemType.Reply]();
    }

    @computed
    private get deleteMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: this.getDeleteMenuItemString,
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Delete : ControlIcons.Delete,
            [FilterableMenuItemArgs.onClick]: this.onDeleteClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.Delete],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.Delete
            ),
            [FilterableMenuItemArgs.disabled]: getMailMenuItemShouldDisable(MenuItemType.Delete),
            [FilterableMenuItemArgs.key]: 'deleteMenuItem',
        });
    }

    @computed
    private get getDeleteMenuItemString(): string {
        return getIsEverythingSelectedInTable(this.tableView)
            ? getEmptyFolderText(this.tableView)
            : loc(deleteItem);
    }

    @computed
    private get deleteNoteMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: this.getDeleteMenuItemString,
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Delete : ControlIcons.Delete,
            [FilterableMenuItemArgs.onClick]: this.onDeleteNoteClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.NoteActions
            ],
        });
    }

    @computed
    private get restoreMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(restoreItem),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext
                ? ArrowHookUpLeft
                : MailIcons.RevToggleKey,
            [FilterableMenuItemArgs.onClick]: onRestore,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.Restore],
        });
    }

    @computed
    private get restoreAllMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(restoreAll),
            [FilterableMenuItemArgs.icon]: MailIcons.RevToggleKey,
            [FilterableMenuItemArgs.onClick]: this.onRestoreAllClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.RestoreAll
            ],
            [FilterableMenuItemArgs.displayOption]: DisplayOption.Left,
            [FilterableMenuItemArgs.disabled]: isBulkActionRunning(this.tableView.serverFolderId),
        });
    }

    @computed
    private get archiveDraftMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(archive),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Archive : ControlIcons.Archive,
            [FilterableMenuItemArgs.onClick]: this.onArchiveClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.Archive],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.Archive
            ),
        });
    }

    @computed
    private get junkMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(junk),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Prohibited : ControlIcons.Blocked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.MarkAsJunk
            ],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.Junk
            ),
            [FilterableMenuItemArgs.menuContent]: [
                new FilterableMenuItem({
                    [FilterableMenuItemArgs.name]: loc(junk),
                    [FilterableMenuItemArgs.onClick]: this.onJunkNotJunkClicked,
                    [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Prohibited : undefined,
                }),
                new FilterableMenuItem({
                    [FilterableMenuItemArgs.name]: loc(phishing),
                    [FilterableMenuItemArgs.onClick]: this.onPhishingClicked,
                    [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Warning : undefined,
                }),
                new FilterableMenuItem({
                    [FilterableMenuItemArgs.name]: loc(block),
                    [FilterableMenuItemArgs.onClick]: this.onBlockClicked,
                    [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                        MenuItemType.Block
                    ],
                    [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Block : undefined,
                }),
            ],
        });
    }

    @computed
    private get notJunkMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(notjunk),
            [FilterableMenuItemArgs.icon]: ControlIcons.MailCheck,
            [FilterableMenuItemArgs.onClick]: this.onJunkNotJunkClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.JunkEmailSafetyAction
            ],
        });
    }

    @computed
    private get blockMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(block),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext
                ? PersonProhibited
                : ControlIcons.BlockContact,
            [FilterableMenuItemArgs.onClick]: this.onBlockClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.JunkEmailSafetyAction
            ],
        });
    }

    @computed
    private get markAsPhishingMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(phishing),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext
                ? Warning
                : SurfaceActionIcons.Phishing,
            [FilterableMenuItemArgs.onClick]: this.onPhishingClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.JunkEmailSafetyAction
            ],
        });
    }

    @computed
    private get translateMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(itemHeaderTranslate),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext
                ? Translate
                : ControlIcons.MicrosoftTranslatorLogo,
            [FilterableMenuItemArgs.onClick]: this.onTranslateClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.Translate],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.Translate
            ),
        });
    }

    @computed
    private get sweepMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(sweep),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Broom : MailIcons.Broom,
            [FilterableMenuItemArgs.onClick]: onSweep,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.Sweep],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.Sweep
            ),
            [FilterableMenuItemArgs.disabled]: isFolderPaused(this.tableView.tableQuery.folderId),
        });
    }

    @computed
    private get moveToMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(moveTo),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext
                ? FolderArrowRight
                : ControlIcons.FabricMovetoFolder,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.Move],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.Move
            ),
            [FilterableMenuItemArgs.menuContent]: getMoveToPropertiesForCommandBar(
                this.tableView,
                this.shouldShowBehaviorMap,
                getCommandBarDirectionalHint(CommandBarAction.Move)
            ),
        });
    }

    @computed
    private get emptyFolderMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: getEmptyFolderText(this.tableView),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Delete : ControlIcons.Delete,
            [FilterableMenuItemArgs.onClick]: this.onDeleteAllClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.EmptyFolder
            ],
            [FilterableMenuItemArgs.displayOption]: DisplayOption.Left,
            [FilterableMenuItemArgs.disabled]: isBulkActionRunning(this.tableView.serverFolderId),
        });
    }

    @computed
    private get markAllAsReadMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(markAllAsRead),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? MailRead : ControlIcons.Read,
            [FilterableMenuItemArgs.onClick]: this.onMarkAllAsReadClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.MarkAllAsRead
            ],
            [FilterableMenuItemArgs.displayOption]: DisplayOption.Left,
            [FilterableMenuItemArgs.disabled]: isBulkActionRunning(this.tableView.serverFolderId),
        });
    }

    @computed
    private get markAsUnreadMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(markAsUnread),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Mail : ControlIcons.Mail,
            [FilterableMenuItemArgs.onClick]: this.onMarkAsUnreadClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.MarkAsUnread
            ],
            [FilterableMenuItemArgs.displayOption]: this.groupId
                ? DisplayOption.Left
                : getCommandBarDisplayOption(CommandBarAction.MarkReadUnread),
            [FilterableMenuItemArgs.disabled]: isBulkActionRunning(this.tableView.serverFolderId),
        });
    }

    @computed
    private get markAsReadMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(markAsRead),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? MailRead : ControlIcons.Read,
            [FilterableMenuItemArgs.onClick]: this.onMarkAsReadClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.MarkAsRead
            ],
            [FilterableMenuItemArgs.displayOption]: this.groupId
                ? DisplayOption.Left
                : getCommandBarDisplayOption(CommandBarAction.MarkReadUnread),
            [FilterableMenuItemArgs.disabled]: isBulkActionRunning(this.tableView.serverFolderId),
        });
    }

    @computed
    private get scheduleMenuItem(): FilterableMenuItem {
        const scheduleSubMenuDates = getDateOptions();
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(snooze),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Clock : ControlIcons.Clock,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.Schedule],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.Snooze
            ),
            [FilterableMenuItemArgs.menuContent]: createSnoozeSubMenu(
                this.onSnoozeClicked,
                scheduleSubMenuDates,
                getCommandBarDirectionalHint(CommandBarAction.Snooze)
            ),
        });
    }

    private onSnoozeClicked(date?: OwaDate) {
        onSnooze(date, commandBarActionSource);
    }

    @computed
    private get flagMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(flag),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext
                ? FlagFilled
                : ControlIcons.EndPointSolid,
            [FilterableMenuItemArgs.onClick]: this.onFlagUnflagClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.Flag],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.FlagUnflag
            ),
            [FilterableMenuItemArgs.key]: loc(flag),
        });
    }

    @computed
    private get unflagMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(unflag),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Flag : ControlIcons.Flag,
            [FilterableMenuItemArgs.onClick]: this.onFlagUnflagClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.Unflag],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.FlagUnflag
            ),
            [FilterableMenuItemArgs.key]: loc(unflag),
        });
    }

    @computed
    private get pinMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(pin),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? PinFilled : ControlIcons.Pinned,
            [FilterableMenuItemArgs.onClick]: this.onPinUnpinClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.Pin],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.PinUnpin
            ),
            [FilterableMenuItemArgs.key]: loc(pin),
        });
    }

    @computed
    private get unpinMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(unpin),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Pin : ControlIcons.PinnedSolid,
            [FilterableMenuItemArgs.onClick]: this.onPinUnpinClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.Unpin],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.PinUnpin
            ),
            [FilterableMenuItemArgs.key]: loc(unpin),
        });
    }

    @computed
    private get ignoreMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(ignore),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext
                ? MailProhibited
                : MailIcons.IgnoreConversation,
            [FilterableMenuItemArgs.onClick]: this.onIgnoreStopIgnoringClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.Ignore],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.IgnoreUnignore
            ),
            [FilterableMenuItemArgs.key]: loc(ignore),
        });
    }

    @computed
    private get stopIgnoringMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(stopIgnoring),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext
                ? MailDismiss
                : MailIcons.IgnoreConversation,
            [FilterableMenuItemArgs.onClick]: this.onIgnoreStopIgnoringClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.StopIgnoring
            ],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.IgnoreUnignore
            ),
            [FilterableMenuItemArgs.key]: loc(stopIgnoring),
        });
    }

    @computed
    private get overflowDivider(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: '-',
            [FilterableMenuItemArgs.icon]: '-',
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.OverflowDivider
            ],
            [FilterableMenuItemArgs.displayOption]: DisplayOption.Overflow,
        });
    }

    @computed
    private get createRuleMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(createRule),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext
                ? FolderMail
                : SurfaceActionIcons.CreateMailRule,
            [FilterableMenuItemArgs.onClick]: this.onCreateRuleClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.InboxRule],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.CreateRule
            ),
        });
    }

    @computed
    private get printMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(print),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? Print : ControlIcons.Print,
            [FilterableMenuItemArgs.onClick]: this.onPrintClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.Print],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.Print
            ),
        });
    }

    @computed
    private get showInImmersiveReaderMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(showInImmersiveReader_1),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext
                ? ImmersiveReader
                : MailIcons.ReadingMode,
            [FilterableMenuItemArgs.onClick]: this.onShowInImmersiveReaderClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.ShowInImmersiveReader
            ],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.ShowImmersiveReader
            ),
        });
    }

    @computed
    private get assignPolicyMenuItem(): FilterableMenuItem {
        const item = new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(assignPolicyMenuItemName),
            [FilterableMenuItemArgs.icon]: ' ', // empty icon to trigger onRenderIcon
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.AssignPolicy
            ],
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.AssignPolicy
            ),
            [FilterableMenuItemArgs.menuContent]: {
                items: [{ key: 'assignPolicySubMenu' }],
            },
            [FilterableMenuItemArgs.onRenderIcon]: () => {
                // delay getting subMenuProps until onRenderIcon callback
                const getAssignPolicyMenu = lazyGetAssignPolicyPropertiesForMailContextMenu.tryImportForRender();
                let submenuProps;
                if (getAssignPolicyMenu) {
                    submenuProps = getAssignPolicyMenu(
                        this.props.tableViewId,
                        commandBarActionSource /* actionSource */
                    );
                }
                item.subMenuProps = submenuProps;

                // render default style to align with rest of the menu items
                const fabricStyles = getClassNames(getMenuItemStyles, getTheme());
                // Note: ControlIcons.MailOptions is temporary until a proper icon is added to Fabric
                return (
                    <Icon
                        iconName={this.hasDensityNext ? MailSettings : ControlIcons.MailOptions}
                        className={classNames(
                            !this.hasDensityNext && 'ms-ContextualMenu-icon',
                            !this.hasDensityNext && fabricStyles.icon,
                            styles.assignPolicyIcon
                        )}
                    />
                );
            },
        });

        return item;
    }

    @computed
    private get undoMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(undoCommandingBar),
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? ArrowUndo : ControlIcons.Undo,
            [FilterableMenuItemArgs.onClick]: this.onUndoClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.Undo
            ] /* Hide in search mode and immersive RP */,
            [FilterableMenuItemArgs.displayOption]: getCommandBarDisplayOption(
                CommandBarAction.Undo
            ),
            [FilterableMenuItemArgs.disabled]: !undoActions.hasUndoableAction(),
        });
    }

    @computed
    private get customizeToolbarItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.name]: loc(customizeToolbar),
            [FilterableMenuItemArgs.onClick]: lazyOnOpenEditor.importAndExecute,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.CustomizeToolbar
            ],
            [FilterableMenuItemArgs.displayOption]: DisplayOption.Overflow,
        });
    }

    /**
     * We are adding this item so that commanding bar left and right items do not overlap
     * This is currently happening because of the fluent button styles which are adding
     * custom margins\border etc which are not accounted for in command bar measurement
     * calculations. 48px seems to work fine with and helps in pushing enough items in overflow
     * so that left items do not overlap with right.
     */
    private get pseudoItemForCorrection(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.displayOption]: DisplayOption.Right,
            [FilterableMenuItemArgs.key]: 'pseudoItemForCorrection',
            [FilterableMenuItemArgs.onRender]: () => {
                return <div style={{ width: '48px' }} aria-hidden={true} />;
            },
        });
    }

    @computed
    private get upNextMenuItem(): FilterableMenuItem {
        const upNextButtonStyles = {
            root: styles.upNextButtonRoot,
            flexContainer: {
                height: 'auto',
                lineHeight: '15px',
            },
        };

        return new FilterableMenuItem({
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[MenuItemType.UpNext],
            [FilterableMenuItemArgs.displayOption]: DisplayOption.Right,
            [FilterableMenuItemArgs.key]: 'upNextMenuItem',
            [FilterableMenuItemArgs.onRender]: () => {
                return <UpNextV2 containerStyle={upNextButtonStyles} />;
            },
            [FilterableMenuItemArgs.cacheKey]: this.cacheKeyForUpNextItem,
        });
    }

    @computed
    private get commandingModeMenuItem(): FilterableMenuItem {
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.CommandingModeMenu
            ],
            [FilterableMenuItemArgs.displayOption]: DisplayOption.Right,
            [FilterableMenuItemArgs.key]: 'commandingModeMenuItem',
            [FilterableMenuItemArgs.onRender]: () => {
                return <LazyCommandingModeMenu />;
            },
        });
    }

    @computed
    private get isSelectPreviousMenuItemDisabled(): boolean {
        const tableView = this.tableView;
        const selectedRowKeys = [...tableView.selectedRowKeys.keys()];
        return tableView.selectedRowKeys.size == 1 && tableView.rowKeys[0] == selectedRowKeys[0];
    }

    @computed
    private get selectPreviousMenuItem(): FilterableMenuItem {
        const name = loc(previousLabel);
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? ArrowUp : ControlIcons.Up,
            [FilterableMenuItemArgs.onClick]: this.onUpClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.SelectionNavigation
            ],
            [FilterableMenuItemArgs.displayOption]: DisplayOption.Right,
            [FilterableMenuItemArgs.disabled]: this.isSelectPreviousMenuItemDisabled,
            [FilterableMenuItemArgs.key]: 'previous',
            [FilterableMenuItemArgs.ariaLabel]: name,
            [FilterableMenuItemArgs.title]: name,
        }); // disabled for the first item of the table
    }

    @computed
    private get isSelectNextMenuItemDisabled(): boolean {
        const tableView = this.tableView;
        const selectedRowKeys = [...tableView.selectedRowKeys.keys()];
        return (
            tableView.selectedRowKeys.size == 1 &&
            tableView.rowKeys[tableView.rowKeys.length - 1] == selectedRowKeys[0]
        );
    }

    @computed
    private get selectNextMenuItem(): FilterableMenuItem {
        const name = loc(nextLabel);
        return new FilterableMenuItem({
            [FilterableMenuItemArgs.icon]: this.hasDensityNext ? ArrowDown : ControlIcons.Down,
            [FilterableMenuItemArgs.onClick]: this.onDownClicked,
            [FilterableMenuItemArgs.shouldShow]: this.shouldShowBehaviorMap[
                MenuItemType.SelectionNavigation
            ],
            [FilterableMenuItemArgs.displayOption]: DisplayOption.Right,
            [FilterableMenuItemArgs.disabled]: this.isSelectNextMenuItemDisabled,
            [FilterableMenuItemArgs.key]: 'next',
            [FilterableMenuItemArgs.ariaLabel]: name,
            [FilterableMenuItemArgs.title]: name,
        }); // disabled for the last item of the table
    }

    private onRespondToRow(responseType: ResponseType) {
        switch (responseType) {
            case ResponseType.Reply:
                onReply(commandBarActionSource);
                break;
            case ResponseType.ReplyAll:
                onReplyAll(commandBarActionSource);
                break;
            case ResponseType.Forward:
                onForward(commandBarActionSource);
                break;
            default:
                throw new Error('Unhandled ResponseType');
                break;
        }
    }

    private onDeleteClicked() {
        onDelete(
            commandBarActionSource /* actionSourceMailStore */,
            commandBarActionSource /* actionSourceAnalyticsActions */
        );
    }

    private onDeleteNoteClicked() {
        lazyDeleteNote.importAndExecute('NotesFolder');
    }

    private onViewEmailFromNoteClicked() {
        lazyViewEmailFromNote.importAndExecute('NotesFolder');
    }

    private onArchiveClicked() {
        onArchive(commandBarActionSource);
    }

    private onRestoreAllClicked = () => {
        lazyTriageActions.lazyRestoreAllItems.importAndExecute(
            this.tableView,
            commandBarActionSource
        );
        lazyResetFocus.importAndExecute();
    };

    private onJunkNotJunkClicked(ev?: any, item?: IContextualMenuItem) {
        const isJunkValueToSet = item?.name == loc(junk);
        onJunkNotJunk(commandBarActionSource, isJunkValueToSet);
    }

    private onPhishingClicked() {
        onMarkAsPhishing(commandBarActionSource);
    }

    private onDeleteAllClicked = async () => {
        if (await this.isDumpsterQuotaEnforced()) {
            return;
        }

        const tableView = this.tableView;
        if (tableView.tableQuery.type == TableQueryType.Search) {
            // currently we do not support EmptyFolder in search view
            lazyTriageActions.lazyEmptySearchTableView.importAndExecute(tableView);
        } else {
            lazyTriageActions.lazyEmptyTableView.importAndExecute(
                tableView,
                false /*isExplicitSoftDelete*/,
                commandBarActionSource,
                [] /*rowKeysToExclude*/
            );
        }
    };

    private onMarkAsReadClicked() {
        onMarkAsReadUnread(commandBarActionSource, true /* isReadValueToSet */);
    }

    private onMarkAsUnreadClicked() {
        onMarkAsReadUnread(commandBarActionSource, false /* isReadValueToSet */);
    }

    private onBlockClicked() {
        onBlock(commandBarActionSource);
    }

    private onFlagUnflagClicked() {
        onFlagUnflag(commandBarActionSource);
    }

    private onPinUnpinClicked() {
        onPinUnpin(commandBarActionSource);
    }

    private onIgnoreStopIgnoringClicked(ev?: any, item?: IContextualMenuItem) {
        onIgnoreStopIgnore(commandBarActionSource, item?.key == loc(ignore) /* shouldIgnore */);
    }

    private onShowInImmersiveReaderClicked() {
        onShowInImmersiveReader(commandBarActionSource);
    }

    private onUndoClicked() {
        onUndo(commandBarActionSource);
    }

    private onUpClicked = () => {
        const tableView = this.tableView;
        const selectedRowkeys = [...tableView.selectedRowKeys.keys()];

        if (!selectedRowkeys[0]) {
            throw new Error('undefined row key ' + selectedRowkeys);
        }

        lazyOnNavigateAwayViaUpDown.importAndExecute(selectedRowkeys[0], tableView);
        selectRowInDirection(
            tableView,
            SelectionDirection.Previous,
            MailListItemSelectionSource.CommandBarArrows
        );
    };

    private onDownClicked = () => {
        const tableView = this.tableView;
        const selectedRowkeys = [...tableView.selectedRowKeys.keys()];

        if (!selectedRowkeys[0]) {
            throw new Error('undefined row key ' + selectedRowkeys);
        }

        lazyOnNavigateAwayViaUpDown.importAndExecute(selectedRowkeys[0], tableView);
        selectRowInDirection(
            tableView,
            SelectionDirection.Next,
            MailListItemSelectionSource.CommandBarArrows
        );
    };

    private onMarkAllAsReadClicked = () => {
        const tableView = this.tableView;

        let isInVirtualSelectAllMode: boolean;
        let exclusionList: string[];
        let rowKeysToActOn: string[];

        /**
         * "Mark all as read" commands can generally be treated as virtual
         * select all. However, in the case of seach results, it needs to be
         * special-cased to use all item IDs since there's no backing folder
         * for the markAllAsReadService to use.
         */
        if (tableView.tableQuery.type === TableQueryType.Search) {
            isInVirtualSelectAllMode = false;
            exclusionList = [];
            rowKeysToActOn = tableView.rowKeys;
        } else {
            isInVirtualSelectAllMode = true;
            exclusionList = tableView.virtualSelectAllExclusionList ?? [];
            rowKeysToActOn = [];
        }

        lazyMarkAsReadInTable.importAndExecute(
            commandBarActionSource,
            exclusionList,
            isInVirtualSelectAllMode /* isActingOnAllItemsInTable */,
            true /* isReadValueToSet */,
            rowKeysToActOn,
            tableView,
            true /* isMarkAllAsRead */
        );

        lazyResetFocus.importAndExecute();
    };

    /**
     * Called when user clicks on the create rule menu item
     */
    private onCreateRuleClicked() {
        onCreateRule(commandBarActionSource);
    }

    private onPrintClicked() {
        onPrint(commandBarActionSource);
    }

    private async isDumpsterQuotaEnforced() {
        const tryValidateDumpsterQuota = await lazyTryValidateDumpsterQuota.import();
        return tryValidateDumpsterQuota(this.tableView.tableQuery.folderId);
    }

    private onTranslateClicked() {
        onTranslate(commandBarActionSource);
    }
}
