import {
    readWriteRecipient_CopyPrompt,
    readWriteRecipientMenu_Edit,
    readWriteRecipientMenu_Remove,
    readWriteRecipientMenu_Copy,
    readWriteRecipient_ExpandGroup,
    readWriteRecipient_RemoveButton,
} from './ReadWriteRecipient.locstring.json';
import loc from 'owa-localize';
import type { ReadWriteRecipientProps } from './ReadWriteRecipient.types';
import updateIsEditing from '../actions/updateIsEditing';
import RecipientAvailabilityType from '../store/schema/RecipientAvailabilityType';
import { ITheme, concatStyleSets } from '@fluentui/style-utilities';
import { classNamesFunction } from '@fluentui/utilities';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import type { PersonaPresence } from '@fluentui/react/lib/Persona';
import { ControlIcons } from 'owa-control-icons';
import { getExtendedTheme } from 'owa-fabric-theme';
import { isFeatureEnabled } from 'owa-feature-flags';
import PersonaControl from 'owa-persona/lib/components/PersonaControl';
import setCommonWellItemSelectedState from 'owa-readwrite-common-well/lib/actions/setCommonWellItemSelectedState';
import ReadWriteCommonWellItem from 'owa-readwrite-common-well/lib/components/ReadWriteCommonWellItem';
import { getStyles } from 'owa-readwrite-common-well/lib/components/ReadWriteCommonWellItem.styles';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import { ReadWriteRecipientWellSize } from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import { lazyTryRegisterForPresenceUpdates } from 'owa-skype-for-business';
import getPresenceFromStore from 'owa-skype-for-business/lib/presenceManager/getPresenceFromStore';
import { getPersonaSizeFromRecipientWellSize } from '../utils/getPersonaSizeFromRecipientWellSize';

import * as React from 'react';
import {
    IContextualMenuItem,
    ContextualMenu,
    DirectionalHint,
} from '@fluentui/react/lib/ContextualMenu';
import {
    useLivePersonaCard,
    PersonaCardBehaviorProps,
} from 'owa-persona/lib/components/PersonaCardBehavior';
import type {
    ReadWriteCommonWellItemStyles,
    ReadWriteCommonWellItemStyleProps,
} from 'owa-readwrite-common-well/lib/components/ReadWriteCommonWellItem.types';
import DraggableItem from 'owa-readwrite-common-well/lib/components/DraggableItem';
import getEmailWithRoutingType from 'owa-recipient-email-address/lib/utils/getEmailWithRoutingType';

const getClassNames = classNamesFunction<
    ReadWriteCommonWellItemStyleProps,
    ReadWriteCommonWellItemStyles
>();

const SMTP_ROUTING_TYPE = 'SMTP';
const PRIVATE_DL_ROUTING_TYPE = 'PDL';
const ONE_OFF_MAILBOX_TYPE = 'OneOff';

import styles from './ReadWriteRecipient.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

@observer
export default class ReadWriteRecipient extends ReadWriteCommonWellItem<
    ReadWriteRecipientViewState,
    ReadWriteRecipientProps
> {
    protected getCustomizedClassName = (): {
        [key in keyof ReadWriteCommonWellItemStyles]: string;
    } => {
        let {
            viewState,
            theme = getExtendedTheme() as ITheme,
            size,
            isSelected,
            isItemAligned,
            maxItemWidth,
            wellItemStyles,
        } = this.props;
        let email = viewState.persona.EmailAddress;
        // This will be handled on the change for common find people control.
        let isSmallSize = size == ReadWriteRecipientWellSize.Small;
        let isRegularSize = size == ReadWriteRecipientWellSize.Regular;

        let isExpandable =
            this.props.expandGroupOperation !== null &&
            /* Expanding a group causes the Advanced Search panel to close.
             * Expanding a group isn't a very userful feature in Advanced Search
             * so just disabling the ability for this scenario */
            this.props.scenario !== 'AdvancedSearch' &&
            (email.MailboxType == 'PrivateDL' ||
                email.MailboxType == 'PublicDL' ||
                email.MailboxType == 'GroupMailbox');

        const stylesFunction = wellItemStyles
            ? styleProps => concatStyleSets(getStyles(styleProps), wellItemStyles)
            : getStyles;

        const innerClassNames = getClassNames(stylesFunction, {
            isSmallSize: isSmallSize,
            isRegularSize: isRegularSize,
            isSelected: isSelected,
            isValid: viewState.isValid,
            isExpanding: viewState.isExpanding,
            isExpandable: isExpandable,
            theme: theme,
            isFadedOut: viewState.isFadedOut,
            isItemAligned: isItemAligned,
            maxItemWidth: maxItemWidth,
        });

        return innerClassNames;
    };

    protected getStringForRemoveButton = () => {
        return loc(readWriteRecipient_RemoveButton);
    };

    protected getRenderResult = () => {
        const { viewState } = this.props;
        const email = viewState.persona.EmailAddress;
        const personaId = viewState.persona.PersonaId ? viewState.persona.PersonaId.Id : undefined;
        return !viewState.isValid ? (
            <div onClick={this.onInvalidRecipientClicked}>{this.getWellItemContent()}</div>
        ) : (
            <LPCComposeRecipientWrapper
                emailAddress={getEmailWithRoutingType(email)}
                olsPersonaId={personaId}
                name={viewState.displayText}
                mailBoxType={email.MailboxType}
                disableHover={true}
                focusReturnElement={this.focusWrapper}
                clientScenario="ReadWriteRecipient">
                {this.getWellItemContent()}
            </LPCComposeRecipientWrapper>
        );
    };

    protected getPersonaControl = (): JSX.Element => {
        let { viewState, size } = this.props;
        let email = viewState.persona.EmailAddress;
        let personaSize = getPersonaSizeFromRecipientWellSize(size);

        const showFreeBusyBadge: boolean =
            this.props.showAvailability && viewState.persona.PersonaAvailability !== undefined;
        const availability: string = viewState.persona.PersonaAvailability;
        const isRecipientAvailabilityUnknown = availability === RecipientAvailabilityType.Unknown;
        const isRecipientAvailable = availability === RecipientAvailabilityType.Available;
        const icon: ControlIcons = isRecipientAvailabilityUnknown
            ? ControlIcons.Help
            : isRecipientAvailable
            ? ControlIcons.Accept
            : ControlIcons.Cancel;

        return (
            <>
                <div className={this.classNames.personaInfoWrapper}>
                    <PersonaControl
                        className={this.classNames.wellItemImage}
                        name={viewState.displayText}
                        emailAddress={getEmailWithRoutingType(email)}
                        size={personaSize}
                        presence={this.presence}
                        mailboxType={email.MailboxType}
                    />
                    <span className={this.classNames.wellItemText}>{viewState.displayText}</span>
                </div>
                {showFreeBusyBadge && (
                    <div
                        className={classNames(styles.freeBusyStatus, {
                            free: isRecipientAvailable,
                            unknown: isRecipientAvailabilityUnknown,
                        })}>
                        <Icon iconName={icon} className={styles.freeBusyIcon} />
                    </div>
                )}
            </>
        );
    };

    protected getLeadingElement = (): JSX.Element => {
        return (
            <IconButton
                onClick={this.expandGroup}
                iconProps={{
                    iconName: ControlIcons.Add,
                }}
                aria-label={loc(readWriteRecipient_ExpandGroup)}
                title={loc(readWriteRecipient_ExpandGroup)}
                styles={{
                    root: this.classNames.expandGroupButton,
                    rootHovered: this.classNames.actionButtonHovered,
                    rootPressed: this.classNames.actionButtonPressed,
                    icon: this.classNames.actionButtonIcon,
                }}
            />
        );
    };

    protected getDisplayTextFromItem = (item: ReadWriteRecipientViewState): string => {
        return item.displayText;
    };

    protected getCanDragItem = (item: ReadWriteRecipientViewState): boolean => {
        const { canDrag = true } = this.props;
        if (!canDrag) {
            return false;
        }

        let dragItem = item;
        return !(dragItem.blockWellItemRemoval && dragItem.shouldBlockSelection);
    };

    protected renderWellItem = () => (
        <div
            key={`rw_draggable_item_${this.props.index}`}
            ref={ref => (this.focusWrapper = ref)}
            data-is-focusable={true}
            data-is-sub-focuszone={true}
            onKeyDown={this.onKeyDown}
            data-selection-index={this.props.index}
            aria-label={this.props.viewState.displayText}
            role="listitem">
            <DraggableItem
                dragViewState={{ isBeingDragged: false }}
                dropViewState={this.props.dropViewState}
                item={this.props.viewState}
                itemIndex={this.props.index}
                displayText={this.getDisplayTextFromItem(this.props.viewState)}
                draggableItemType={this.props.draggableItemType}
                removeDroppedItemAction={this.props.removeOperation}
                canDrag={this.getCanDragItem}>
                {this.getRenderResult()}
            </DraggableItem>
        </div>
    );

    private expandGroup = (ev: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        // Stop propagation to ensure we dont open the Live Persona Card
        ev.stopPropagation();
        ev.preventDefault();

        setCommonWellItemSelectedState(this.props.viewState, false /* isSelected */);
        if (!this.props.viewState.isExpanding) {
            this.props.expandGroupOperation(this.props.viewState);
        }
    };

    protected copyItemContent = () => {
        let email = this.props.viewState.persona.EmailAddress;
        let copyText;

        if (email.RoutingType === SMTP_ROUTING_TYPE) {
            if (email.Name) {
                let nameToUse =
                    email.MailboxType == ONE_OFF_MAILBOX_TYPE
                        ? email.Name
                        : `"${email.Name.replace('"', '\\"')}"`;
                copyText = `${nameToUse} <${getEmailWithRoutingType(email)}>`;
            } else {
                copyText = getEmailWithRoutingType(email);
            }
        } else if (email.RoutingType === PRIVATE_DL_ROUTING_TYPE) {
            copyText = email.Name;
        } else {
            copyText = `${email.Name} [${getEmailWithRoutingType(email)}]`;
        }

        var copyInput = document.createElement('input') as HTMLInputElement;
        copyInput.className = this.classNames.copyInput;
        document.body.appendChild(copyInput);

        try {
            // Try to copy the text directly to the clipboard
            copyInput.value = copyText;
            copyInput.select();
            if (!document.execCommand('copy')) {
                // The command failed. Fallback to the method below.
                throw new Error();
            }
        } catch (err) {
            // The above method didn't work. Fallback to a prompt.
            window.prompt(loc(readWriteRecipient_CopyPrompt), copyText);
        } finally {
            document.body.removeChild(copyInput);
        }
    };

    private onInvalidRecipientClicked = (
        ev?: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
    ) => {
        if (this.props.canEdit) {
            this.editRecipient(ev);
        }
    };

    private editRecipient = (ev?: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        updateIsEditing(this.props.viewState, true /*isEditing*/);
    };

    componentDidMount() {
        if (isFeatureEnabled('fwk-skypeBusinessV2') && this.props.showPresence) {
            lazyTryRegisterForPresenceUpdates.import().then(tryRegisterForPresenceUpdates => {
                tryRegisterForPresenceUpdates(
                    this.props.viewState.persona.EmailAddress.EmailAddress
                );
            });
        }
    }

    @computed
    get presence(): PersonaPresence {
        return this.props.showPresence
            ? getPresenceFromStore(this.props.viewState.persona.EmailAddress.EmailAddress)
            : undefined;
    }

    protected getContextMenu = (): JSX.Element => {
        return (
            <RecipientContextMenu
                isOpen={this.props.viewState.isContextMenuOpen}
                personaSpan={this.personaSpan}
                canEdit={this.props.canEdit}
                blockRemoval={this.props.viewState.blockWellItemRemoval}
                onDismissContextMenu={this.onDismissContextMenu}
                editRecipient={this.editRecipient}
                removeItem={this.removeItem}
                copyItemContent={this.copyItemContent}
            />
        );
    };
}

function LPCComposeRecipientWrapper(
    props: PersonaCardBehaviorProps & { children?: React.ReactNode }
) {
    const PersonaCardBehavior = useLivePersonaCard(props);
    return (
        <PersonaCardBehavior>
            <span className="LPCWrapper">{props.children}</span>
        </PersonaCardBehavior>
    );
}

/**
 * Custom inner component for the context menu
 *
 * Because the fabric context menu cannot be rendered without reference to the mount point,
 * and when the context menu is rendered in the same render pass as the parent component, the ref
 * is cleared to `null`, we have to ensure that the context menu is not shown on first render, and
 * is a separate component than the component rendering the span it mounts against.
 */
const RecipientContextMenu = React.memo(
    ({
        isOpen,
        personaSpan,
        canEdit,
        blockRemoval,
        onDismissContextMenu,
        editRecipient,
        removeItem,
        copyItemContent,
    }: {
        isOpen: boolean;
        personaSpan: React.RefObject<HTMLSpanElement>;
        canEdit: boolean;
        blockRemoval: boolean;
        onDismissContextMenu: (ev: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
        editRecipient: () => void;
        removeItem: (ev: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
        copyItemContent: () => void;
    }) => {
        const [mountTarget, updateMountTarget] = React.useState(personaSpan.current);
        React.useEffect(() => {
            if (mountTarget !== personaSpan.current) {
                updateMountTarget(personaSpan.current);
            }
        });

        const items = React.useMemo<IContextualMenuItem[]>(() => {
            let menuItems = [];
            if (canEdit) {
                menuItems.push({
                    key: 'edit',
                    name: loc(readWriteRecipientMenu_Edit),
                    onClick: editRecipient,
                });
            }

            if (!blockRemoval) {
                menuItems.push({
                    key: 'remove',
                    name: loc(readWriteRecipientMenu_Remove),
                    onClick: removeItem,
                });
            }

            menuItems.push({
                key: 'copyAddress',
                name: loc(readWriteRecipientMenu_Copy),
                onClick: copyItemContent,
            });

            return menuItems;
        }, [canEdit, blockRemoval]);

        return (
            !!mountTarget &&
            isOpen && (
                <ContextualMenu
                    items={items}
                    onDismiss={onDismissContextMenu}
                    target={mountTarget}
                    directionalHint={DirectionalHint.bottomLeftEdge}
                />
            )
        );
    }
);
