/* eslint-disable import/no-default-export */
import { HeaderTestIds } from '@trello/test-ids';
import { memberId } from '@trello/session-cookie';
import { EnterpriseIcon } from '@trello/nachos/icons/enterprise';
import { Analytics } from '@trello/atlassian-analytics';
import React, { Suspense, FunctionComponent, useCallback } from 'react';
import HeaderButton from './button';
import { usePopover, Popover } from '@trello/nachos/popover';
import { forNamespace } from '@trello/i18n';
import { useLazyComponent } from '@trello/use-lazy-component';
import { useEnterpriseMenuButtonQuery } from './EnterpriseMenuButtonQuery.generated';
import classnames from 'classnames';
import styles from './header.less';

const viewTitle = forNamespace('view title');

interface EnterpriseMenuButtonProps {
  redesign?: boolean;
}

const EnterpriseMenuButton: FunctionComponent<EnterpriseMenuButtonProps> = ({
  redesign,
}) => {
  const EnterpriseMenu = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "enterprise-menu-popover" */ 'app/gamma/src/components/popovers/enterprise-menu'
      ),
  );

  const { data, loading } = useEnterpriseMenuButtonQuery({
    fetchPolicy: 'cache-only',
    variables: {
      memberId: memberId || '',
    },
  });

  const {
    toggle,
    hide,
    triggerRef,
    popoverProps,
  } = usePopover<HTMLButtonElement>();
  const onClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'enterpriseButton',
      source: 'appHeader',
    });
    toggle();
  }, [toggle]);
  if (
    loading ||
    !data?.member?.confirmed ||
    !data?.member?.idEnterprisesAdmin?.length
  ) {
    return null;
  }

  return (
    <>
      <HeaderButton
        icon={<EnterpriseIcon color="light" />}
        onClick={onClick}
        ref={triggerRef}
        testId={HeaderTestIds.EnterpriseDashboardButton}
        ariaLabel={viewTitle('trello enterprise')}
        className={classnames(redesign && styles.headerButtonRedesign)}
      />
      <Popover {...popoverProps} title={viewTitle('trello enterprise')}>
        <Suspense fallback={null}>
          <EnterpriseMenu onEnterpriseSelected={hide} />
        </Suspense>
      </Popover>
    </>
  );
};

export default EnterpriseMenuButton;
