import { noSubjectText } from 'owa-locstrings/lib/strings/nosubjecttext.locstring.json';
import loc, { isStringNullOrWhiteSpace } from 'owa-localize';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { Icon } from '@fluentui/react/lib/Icon';
import { Category } from 'owa-categories';
import { ControlIcons } from 'owa-control-icons';
import { highlightTermsInHtmlElement } from 'owa-mail-highlight-terms';
import type ConversationReadingPaneViewState from 'owa-mail-reading-pane-store/lib/store/schema/ConversationReadingPaneViewState';
import type ItemReadingPaneViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemReadingPaneViewState';
import { lazyStartSearchWithCategory } from 'owa-mail-search';
import type { ActionSource, ClientItem } from 'owa-mail-store';
import mailStore from 'owa-mail-store/lib/store/Store';
import { isBrowserEdge, isBrowserIE } from 'owa-user-agent/lib/userAgent';
import type CLPLabel from 'owa-mail-protection-types/lib/schema/CLPLabel';
import { lazyLogReadCLPLabel, CLPSubjectHeaderLabel } from 'owa-mail-protection';
import { getLabelFromStore } from 'owa-mail-protection/lib/utils/clp/getExistingCLPInfo';
import * as React from 'react';
import { isImmersiveReadingPaneShown } from 'owa-mail-layout/lib/selectors/isImmersiveReadingPaneShown';
import { isFeatureEnabled } from 'owa-feature-flags';
import { ImmersiveExitButton } from 'owa-immersive-exit-button';
import { lazyRemoveCategoriesFromTable } from 'owa-mail-triage-action';
import { getSelectedTableView } from 'owa-mail-list-store';
import { getDensityModeString } from 'owa-fabric-theme';

import styles from './SubjectHeader.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface SubjectHeaderProps {
    subject: string;
    firstItemId?: string;
    categories?: string[];
    className?: string;
    isSmimeEncrypted?: boolean;
    viewState?: ConversationReadingPaneViewState | ItemReadingPaneViewState;
    specialCardIconName?: string;
    isSxS?: boolean;
}

@observer
export default class SubjectHeader extends React.Component<SubjectHeaderProps, any> {
    componentDidMount() {
        if (this.messageCLPLabel) {
            lazyLogReadCLPLabel.import().then(logReadCLPLabel => {
                logReadCLPLabel(this.messageCLPLabel);
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.messageCLPLabel && this.props.firstItemId != prevProps.firstItemId) {
            lazyLogReadCLPLabel.import().then(logReadCLPLabel => {
                logReadCLPLabel(this.messageCLPLabel);
            });
        }
    }

    @computed
    get messageCLPLabel(): CLPLabel {
        const { firstItemId } = this.props;
        if (firstItemId) {
            const item = mailStore.items.get(firstItemId);
            return item && getLabelFromStore(item.MSIPLabelGuid);
        }
        return null;
    }

    @computed
    get activeSubject(): string {
        if (this.props.viewState) {
            const itemReadingPaneViewState = this.props.viewState as ItemReadingPaneViewState;
            if (itemReadingPaneViewState?.itemViewState) {
                const itemId = itemReadingPaneViewState.itemId;
                if (itemId) {
                    const clientItem: ClientItem = mailStore.items.get(itemId);

                    if (clientItem?.TranslationData?.isShowingSubjectTranslation) {
                        return clientItem.TranslationData.subjectTranslationText;
                    }
                }
            } else {
                const conversationReadingPaneViewState = this.props
                    .viewState as ConversationReadingPaneViewState;
                if (conversationReadingPaneViewState.conversationId?.Id) {
                    const conversationItemParts = mailStore.conversations.get(
                        conversationReadingPaneViewState.conversationId.Id
                    );
                    // Get subject from inline translation if active
                    if (
                        conversationItemParts != null &&
                        conversationItemParts.subjectTranslationData != null &&
                        conversationItemParts.subjectTranslationData.isShowingTranslation
                    ) {
                        return conversationItemParts.subjectTranslationData.translationText;
                    }
                }
            }
        }
        return this.props.subject;
    }

    render() {
        const messageCLPLabel = this.messageCLPLabel;
        const subject = this.activeSubject;
        const subjectDisplay = isStringNullOrWhiteSpace(subject) ? loc(noSubjectText) : subject;
        const isEdgeOrIE = isBrowserEdge() || isBrowserIE();

        const isSpecialCaseCard = this.props.specialCardIconName != null;
        const containerClassNames = classNames(this.props.className, styles.readingPaneHeader, {
            isEdgeOrIE: isEdgeOrIE,
            isSpecialCaseCard: isSpecialCaseCard,
        });
        const shouldRenderCategories = !!this.props.categories;
        const hasDensityNext = isFeatureEnabled('mon-densities');
        const densityMode = hasDensityNext ? getDensityModeString() : null;

        const subjectClassNames = classNames(
            densityMode,
            styles.subject,
            'allowTextSelection',
            isFeatureEnabled('mon-tri-readingPaneRedlineUXUpdates') && styles.largerSubject
        );

        const subjectTextClass = classNames(densityMode, styles.subjectText, {
            subjectTextWithCategories:
                shouldRenderCategories && !messageCLPLabel && !hasDensityNext,
            subjectTextWithCategoriesDensity:
                shouldRenderCategories && !messageCLPLabel && hasDensityNext,
        });

        const immersiveExit = classNames(styles.immersiveExitContainer, {
            isSpecialCaseCard: isSpecialCaseCard,
        });

        const showNavigateBackButton = isImmersiveReadingPaneShown();

        const subjectAndLabelClassNames = classNames(styles.subjectAndLabelContainer, densityMode);
        return (
            <div
                className={containerClassNames}
                key={`subjectHeaderContainerDiv_${this.props.subject}`}>
                <div className={styles.readingPaneInnerContainer}>
                    <div className={subjectAndLabelClassNames}>
                        {showNavigateBackButton && !this.props.isSxS && (
                            <ImmersiveExitButton iconButtonContainer={immersiveExit} />
                        )}

                        {this.props.specialCardIconName &&
                            this.renderSpecialCardIcon(showNavigateBackButton)}
                        <div
                            key={'rp_subject'}
                            ref={onSubjectRef}
                            className={subjectClassNames}
                            title={this.props.subject}
                            role="heading"
                            aria-level={2}>
                            <span className={subjectTextClass}>{subjectDisplay}</span>
                        </div>
                        <CLPSubjectHeaderLabel subjectHeaderLabel={messageCLPLabel} />
                    </div>
                    {shouldRenderCategories &&
                        this.renderCategories(this.props.categories || [], densityMode)}
                    {this.props.isSmimeEncrypted && (
                        <Icon iconName={ControlIcons.Lock} className={styles.lockIcon} />
                    )}
                </div>
            </div>
        );
    }

    private onRemoveCategoryClicked(category: string) {
        const tableView = getSelectedTableView();
        lazyRemoveCategoriesFromTable.importAndExecute(
            [...tableView.selectedRowKeys.keys()],
            tableView,
            [category],
            'SubjectHeader',
            true
        );
    }

    private renderCategories(categories: string[], densityMode?: string): JSX.Element[] {
        const categoryElements = [];
        const outerContainerClassNames = classNames(styles.categoryOuterContainer, densityMode);

        for (let i = categories.length - 1; i >= 0; i--) {
            const categoryName = categories[i];
            categoryElements.push(
                <div key={categoryName} className={outerContainerClassNames}>
                    <Category
                        category={categoryName}
                        actionSource={'SubjectHeader'}
                        isLastInWell={i == 0}
                        onCategoryClicked={onCategoryClicked}
                        showCategoryRemove={true}
                        onRemoveCategoryClicked={this.onRemoveCategoryClicked}
                    />
                </div>
            );
        }

        return categoryElements;
    }

    private renderSpecialCardIcon(showNavigateBackButton: boolean): JSX.Element {
        const specialCardStyle = showNavigateBackButton
            ? styles.specialCardContainerWithExitTreatment
            : styles.specialCardIconContainer;
        const specialIconStyle = showNavigateBackButton
            ? styles.specialCardIconWithExitTreatment
            : styles.specialCardIcon;
        return (
            <div className={specialCardStyle}>
                <Icon iconName={this.props.specialCardIconName} className={specialIconStyle} />
            </div>
        );
    }
}

function onSubjectRef(ref: HTMLDivElement) {
    highlightTermsInHtmlElement(ref);
}

async function onCategoryClicked(
    ev: React.MouseEvent<unknown>,
    category: string,
    actionSource: ActionSource
) {
    // Need stop propagation so the click doesn't bubble up to container, i.e list view item and reading pane subject
    ev.stopPropagation();
    const startSearchWithCategory = await lazyStartSearchWithCategory.import();
    startSearchWithCategory(actionSource, category);
}
