import React, { useCallback } from 'react';
import { forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { TemplateCreateIcon } from '@trello/nachos/icons/template-create';
import { CreateCardFromTemplatePopover } from 'app/src/components/CardTemplatesPopover';
import { navigate } from 'app/scripts/controller/navigate';
import { useCreateCardFromTemplateMutation } from 'app/src/components/CardTemplatesPopover/CreateCardFromTemplateMutation.generated';
import styles from './TemplateCardBanner.less';
import { Analytics } from '@trello/atlassian-analytics';
import { usePopover, Popover } from '@trello/nachos/popover';
import { sendErrorEvent } from '@trello/error-reporting';
import { Feature } from 'app/scripts/debug/constants';
import { CardTemplateTestIds } from '@trello/test-ids';
import { CardBackPresentationalBanner } from './CardBackPresentationalBanner';

const format = forTemplate('card_detail');

interface TemplateCardBannerProps {
  idCard: string;
  editable?: boolean;
  hasCover?: boolean;
  hasStickers?: boolean;
}

export const CARD_BACK_CREATE_FROM_TEMPLATE_NAME = Symbol(
  'CARD_BACK_CREATE_FROM_TEMPLATE',
);

export const TemplateCardBanner: React.FunctionComponent<TemplateCardBannerProps> = ({
  idCard,
  editable,
  hasCover,
  hasStickers,
}) => {
  const onShow = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'createCardFromTemplateButton',
      source: 'cardDetailScreen',
      attributes: {
        isTemplate: true,
      },
    });
  }, []);

  const {
    toggle,
    hide,
    popoverProps,
    triggerRef,
  } = usePopover<HTMLButtonElement>({ onShow });

  const [createCardMutation] = useCreateCardFromTemplateMutation();

  return (
    <CardBackPresentationalBanner
      bannerImageClass="template"
      bannerText={format('this-is-a-template-card')}
      hasCover={hasCover}
      hasStickers={hasStickers}
      testId={CardTemplateTestIds.TemplateCardBackBanner}
      boldBannerText={true}
    >
      {editable ? (
        <Button
          iconBefore={<TemplateCreateIcon color="light" size="medium" />}
          className={styles.templateCardBannerButton}
          appearance="primary"
          ref={triggerRef}
          onClick={toggle}
          testId={CardTemplateTestIds.CreateCardFromTemplateBannerButton}
        >
          {format('create-card-from-template')}
        </Button>
      ) : null}
      <Popover
        {...popoverProps}
        title={format('create-card-from-template')}
        dangerous_className={styles.popover}
      >
        <CreateCardFromTemplatePopover
          idCard={idCard}
          showLists
          hideEditButton
          // eslint-disable-next-line react/jsx-no-bind
          createCard={async (name, idCardSource, keepFromSource, idList) => {
            if (!idList) {
              return;
            }

            const traceId = Analytics.startTask({
              taskName: 'create-card/template',
              source: 'createCardFromTemplateInlineDialog',
            });

            Analytics.sendClickedButtonEvent({
              buttonName: 'createCardButton',
              source: 'createCardFromTemplateInlineDialog',
            });

            try {
              const { data } = await createCardMutation({
                variables: {
                  idCardSource,
                  idList,
                  name,
                  keepFromSource,
                  traceId,
                },
              });

              const card = data?.copyCard;

              if (card) {
                Analytics.sendTrackEvent({
                  action: 'created',
                  actionSubject: 'card',
                  source: 'createCardFromTemplateInlineDialog',
                  containers: {
                    card: { id: card.id },
                    list: { id: idList },
                  },
                  attributes: {
                    taskId: traceId,
                  },
                });

                Analytics.taskSucceeded({
                  taskName: 'create-card/template',
                  traceId,
                  source: 'createCardFromTemplateInlineDialog',
                });
                hide();
                navigate(`/c/${card.shortLink}`, {
                  trigger: true,
                });
              }
            } catch (error) {
              sendErrorEvent(error, {
                tags: {
                  ownershipArea: 'trello-panorama',
                  feature: Feature.TemplateCard,
                },
              });
              throw Analytics.taskFailed({
                taskName: 'create-card/template',
                traceId,
                source: 'createCardFromTemplateInlineDialog',
                error,
              });
            }
          }}
        />
      </Popover>
    </CardBackPresentationalBanner>
  );
};
