import { HeaderTestIds } from '@trello/test-ids';
import { InformationIcon } from '@trello/nachos/icons/information';
import React, { Suspense, FunctionComponent, useCallback } from 'react';
import { Analytics } from '@trello/atlassian-analytics';
import HeaderButton from './button';
import { usePopover, Popover } from '@trello/nachos/popover';
import { forNamespace, forTemplate } from '@trello/i18n';
import classnames from 'classnames';
import styles from './header.less';
import { useLazyComponent } from '@trello/use-lazy-component';
const viewTitle = forNamespace('view title');
const format = forTemplate('header_user');

interface InfoMenuButton {
  infoMenuButtonRef?: React.RefObject<HTMLButtonElement>;
  redesign?: boolean;
}
export const InfoMenuButton: FunctionComponent<InfoMenuButton> = ({
  infoMenuButtonRef,
  redesign,
}) => {
  const HeaderInfoMenuPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "info-menu-popover" */ 'app/src/components/HeaderInfoMenu'
      ),
    { namedImport: 'HeaderInfoMenu' },
  );

  const { toggle, triggerRef, popoverProps } = usePopover<HTMLButtonElement>();

  const onClick = useCallback(() => {
    Analytics.sendScreenEvent({
      name: 'informationHeaderInlineDialog',
    });
    toggle();
  }, [toggle]);

  /*
   * We want to be able to have multiple refs for this component.
   * It requires a triggerRef for the Nachos Popover component and
   * we also need a ref for sending focus to the underlying element.
   *
   * mergeRefs accepts refs to merge and returns a single callback
   * ref that will properly set each ref passed, whether that ref
   * is a function or a ref object.
   */
  const mergeRefs = useCallback(
    (
      ...refs: [
        React.Ref<HTMLButtonElement>,
        React.RefObject<HTMLButtonElement> | undefined,
      ]
    ) => {
      const filteredRefs = refs.filter(Boolean);
      if (!filteredRefs.length) return null;
      if (filteredRefs.length === 1) return filteredRefs[0];
      return (refInstance: HTMLButtonElement) => {
        for (const ref of filteredRefs) {
          if (typeof ref === 'function') {
            ref(refInstance);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLElement | null>).current = refInstance;
          }
        }
      };
    },
    [],
  );

  return (
    <>
      <HeaderButton
        icon={<InformationIcon color="light" />}
        onClick={onClick}
        ref={mergeRefs(triggerRef, infoMenuButtonRef)}
        testId={HeaderTestIds.InfoButton}
        ariaLabel={format('open-information-menu')}
        className={classnames(redesign && styles.headerButtonRedesign)}
      />
      <Popover {...popoverProps} title={viewTitle('information')} size="large">
        <Suspense fallback={null}>
          <HeaderInfoMenuPopover />
        </Suspense>
      </Popover>
    </>
  );
};
