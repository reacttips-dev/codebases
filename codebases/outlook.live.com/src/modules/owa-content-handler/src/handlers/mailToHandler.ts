import type { ContentHandler } from 'owa-controls-content-handler-base';
import processMailToLink from '../utils/processMailToLink';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { logVerboseUsage } from 'owa-analytics';
import { getCurrentLanguage, getCurrentCulture } from 'owa-localize';
import { ComposeTarget } from 'owa-mail-compose-store';
import { lazyOpenCompose } from 'owa-mail-compose-actions';
import { lazyShowReportAbuseDialog } from 'owa-mail-report-abuse';
import type { ClientItem } from 'owa-mail-store';
import { getSelectedTableView } from 'owa-mail-list-store';
import getInstrumentationContextsFromTableView from 'owa-mail-list-store/lib/utils/getInstrumentationContextsFromTableView';
import { lazyAddGroupMember } from 'owa-group-add-member-integration';
import { lazyAddGroupMemberV2 } from 'owa-group-add-member-integration-v2';
import { lazyCreateGroup, UserType } from 'owa-group-create-integration';
import { lazyCreateGroupV2 } from 'owa-group-create-integration-v2';
import { isFeatureEnabled } from 'owa-feature-flags';
import { IsShareableCRUDEnabled } from 'owa-groups-shared-store/lib/utils/shareableCRUDFlight';

const CLICK_EVENT_NAME = 'click';
const HREF_ATTRIBUTE_NAME = 'href';
const MAIL_TO_HANDLER_SELECTOR = "a[href^='mailto:'],a[href^='MAILTO:']";
export const MAIL_TO_HANDLER_NAME = 'mailToHandler';

export class MailToHandler implements ContentHandler {
    public readonly cssSelector = MAIL_TO_HANDLER_SELECTOR;
    public readonly keywords = null;

    private item: ClientItem;

    private boundElements: {
        element: HTMLElement;
        handler: (clickEvent: MouseEvent) => void;
    }[];

    constructor(item: ClientItem) {
        this.boundElements = [];
        this.item = item;
    }

    public readonly handler = (element: HTMLElement, keyword?: string) => {
        const mailTo = element.getAttribute(HREF_ATTRIBUTE_NAME);
        const { composeInitProps, additionalMailToLinkParams, isValid } = processMailToLink(mailTo);

        // Log the mailTo processing occurrence.
        logVerboseUsage('MailToLinkProcessed', [isValid]);

        const clickHandler = (evt: MouseEvent) => {
            // Prevent default regardless.
            evt.preventDefault();

            // Log the user click event.
            logVerboseUsage('MailToLinkClicked', [isValid]);

            // If we the mailTo is valid, open compose
            if (isValid) {
                let defaultToCompose: boolean = true;

                if (additionalMailToLinkParams.isReportAbuseMailToLink) {
                    const tableView = getSelectedTableView();
                    const selectedRowKeys = tableView ? [...tableView.selectedRowKeys.keys()] : [];
                    if (selectedRowKeys.length === 1) {
                        const instrumentationContext = getInstrumentationContextsFromTableView(
                            selectedRowKeys,
                            tableView
                        )[0];

                        defaultToCompose = false;
                        lazyShowReportAbuseDialog.importAndExecute(
                            this.item,
                            tableView,
                            [instrumentationContext],
                            'Link'
                        );
                    }
                }

                if (
                    isFeatureEnabled('mailto-group-forms') &&
                    additionalMailToLinkParams.isAddMembersMailToLink
                ) {
                    defaultToCompose = false;
                    this.showAddGroupMembersDialog(
                        composeInitProps.to[0].EmailAddress,
                        additionalMailToLinkParams.mailToLinkSource
                    );
                }

                if (
                    isFeatureEnabled('mailto-group-forms') &&
                    additionalMailToLinkParams.isCreateGroupMailToLink
                ) {
                    defaultToCompose = false;
                    this.showCreateNewGroupDialog(additionalMailToLinkParams.mailToLinkSource);
                }

                if (defaultToCompose) {
                    lazyOpenCompose.importAndExecute(composeInitProps, ComposeTarget.SecondaryTab);
                }
            }
        };

        element.addEventListener(CLICK_EVENT_NAME, clickHandler);
        this.boundElements.push({ element: element, handler: clickHandler });
    };

    public readonly undoHandler = (elements: HTMLElement[]) => {
        this.boundElements.forEach(boundElement =>
            boundElement.element.removeEventListener(CLICK_EVENT_NAME, boundElement.handler)
        );
        this.boundElements = [];
    };

    showAddGroupMembersDialog = async (groupSmtpAddress: string, source: string) => {
        if (IsShareableCRUDEnabled()) {
            await lazyAddGroupMemberV2.importAndExecute(groupSmtpAddress, source);
        } else {
            const addGroupMember = await lazyAddGroupMember.import();
            addGroupMember(groupSmtpAddress, source);
        }
    };

    showCreateNewGroupDialog = async (source: string) => {
        if (IsShareableCRUDEnabled()) {
            const createGroup = await lazyCreateGroupV2.import();
            let sessionSettings = getUserConfiguration().SessionSettings;
            createGroup(
                sessionSettings.ExternalDirectoryUserGuid,
                getCurrentLanguage(),
                getCurrentCulture(),
                source
            );
        } else {
            const createGroup = await lazyCreateGroup.import();
            const usertype = isConsumer() ? UserType.Consumer : UserType.Enterprise;
            createGroup(usertype, getCurrentCulture(), source);
        }
    };
}
