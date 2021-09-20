import React, { Suspense } from 'react';
import cx from 'classnames';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { ExternalLinkIcon } from '@trello/nachos/icons/external-link';
import { useLazyComponent } from '@trello/use-lazy-component';
import { forNamespace, forTemplate } from '@trello/i18n';
import { Feature } from 'app/scripts/debug/constants';
import { PopOver } from 'app/scripts/views/lib/pop-over';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import {
  FeatureId,
  NewPill,
  useNewFeature,
} from 'app/src/components/NewFeature';
import {
  showButlerDirectory,
  ButlerTab,
  ButlerNewCommandId,
} from '../showButlerDirectory';
import { useHasButlerAccess } from '../useHasButlerAccess';
import {
  ButlerListRuleTemplate,
  hydrateListRuleTemplate,
} from './hydrateListRuleTemplate';
import styles from './ButlerListMenuSection.less';

const format = forTemplate('list_menu');
const formatPopover = forNamespace(['butler', 'create list rule popover']);
const formatButler = forNamespace('butler');

interface Props {
  listName: string;
  idList: string;
  idBoard: string;
  idOrganization: string | undefined;
}

export const ButlerListMenuSection: React.FC<Props> = ({
  listName,
  ...ids
}) => {
  const CreateListRulePopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "create-list-rule-popover" */ './CreateListRulePopover'
      ),
    { namedImport: 'CreateListRulePopover' },
  );

  const { acknowledgeNewFeature } = useNewFeature(FeatureId.ButlerOnBoardsV2);

  const { idBoard } = ids;
  const hasButlerAccess = useHasButlerAccess(idBoard);
  if (!hasButlerAccess) {
    return null;
  }

  const templateOptions: ButlerListRuleTemplate[] = [
    'when-a-card-is-added-to-the-list',
    'every-day-sort-list-by',
    'every-monday-sort-list-by',
  ];

  const onClickTemplate = (template: ButlerListRuleTemplate): void => {
    acknowledgeNewFeature({ explicit: true, source: 'listMenuInlineDialog' });
    hydrateListRuleTemplate({
      template,
      listName,
    });

    PopOver.pushView({
      getViewTitle: () => formatPopover('new rule'),
      reactElement: (
        <ComponentWrapper key="butlerCreateListRulePopover">
          <Suspense fallback={null}>
            <ErrorBoundary
              tags={{
                ownershipArea: 'trello-workflowers',
                feature: Feature.ButlerOnBoards,
              }}
            >
              <CreateListRulePopover {...ids} />
            </ErrorBoundary>
          </Suspense>
        </ComponentWrapper>
      ),
    });

    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'menuItem',
      actionSubjectId: 'butlerRuleTemplateMenuItem',
      source: 'listMenuInlineDialog',
      containers: formatContainers(ids),
      attributes: { template },
    });
  };

  const onClickCustomRule = async () => {
    acknowledgeNewFeature({ explicit: true, source: 'listMenuInlineDialog' });
    await showButlerDirectory(idBoard, ButlerTab.Rules, ButlerNewCommandId);

    Analytics.sendClickedButtonEvent({
      buttonName: 'createCustomButlerRuleButton',
      source: 'listMenuInlineDialog',
      containers: formatContainers(ids),
    });

    PopOver.hide();
  };

  return (
    <>
      {/* The list menu is subdivided by hrs styled by a global `.pop-over hr`
          declaration. If this section exists, it must be prepended by a hr. */}
      <hr />
      <div className={styles.header}>
        <div className={styles.title}>
          {formatButler('automation')}
          <span className={styles.newPill}>
            <NewPill
              featureId={FeatureId.ButlerOnBoardsV2}
              source="listMenuInlineDialog"
            />
          </span>
        </div>
      </div>
      <ul className={cx('pop-over-list', styles.templates)}>
        {templateOptions.map((template) => {
          const templateName = format(template);
          return (
            <li key={template}>
              <a
                className={styles.template}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => onClickTemplate(template)}
                role="link"
                title={templateName}
                tabIndex={0}
              >
                {templateName}
              </a>
            </li>
          );
        })}
        <li>
          <a
            className={styles.customRuleButton}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={onClickCustomRule}
            role="link"
            title={format('create-a-custom-rule')}
            tabIndex={0}
          >
            <span className={styles.customRuleLabel}>
              {format('create-a-custom-rule')}
            </span>
            <span className={styles.externalLinkIcon}>
              <ExternalLinkIcon />
            </span>
          </a>
        </li>
      </ul>
    </>
  );
};
