/* eslint-disable import/no-default-export */
import { forTemplate } from '@trello/i18n';
import { memberId } from '@trello/session-cookie';
import React from 'react';
import styles from './enterprise-menu.less';
import { PopoverMenuLink, PopoverMenu } from 'app/src/components/PopoverMenu';
import { useEnterpriseAdminIdsQuery } from './EnterpriseAdminIdsQuery.generated';
import { useEnterprisesQuery } from './EnterprisesQuery.generated';

const format = forTemplate('header_enterprise_admin_dashboard_menu');

interface OwnProps {
  onEnterpriseSelected: () => void;
}

const EnterpriseMenu: React.FC<OwnProps> = ({
  onEnterpriseSelected,
}: OwnProps) => {
  // Fetch the idAdminEnterprises field for the member...
  const {
    data: idAdminEnterprisesResponse,
    loading: idAdminEnterprisesLoading,
  } = useEnterpriseAdminIdsQuery({
    variables: {
      memberId: memberId || '',
    },
  });

  const idAdminEnterprises =
    idAdminEnterprisesResponse?.member?.idEnterprisesAdmin ?? [];

  // ...fetch the enterprises for each of the IDs returned above. This is
  // necessary because server doesn't include enterprises for a member if the
  // member is an admin but not in any of the enterprise's teams. This will
  // cause a batch request to fetch each enterprise the member is an admin of,
  // which could possibly cause the GET query params to be too long, but in
  // practice this should be nearly impossible.
  const {
    data: enterprisesResponse,
    loading: enterprisesLoading,
  } = useEnterprisesQuery({
    variables: {
      enterpriseIds: idAdminEnterprises,
    },
    skip: !idAdminEnterprises.length,
  });

  if (idAdminEnterprisesLoading || enterprisesLoading) {
    return <div>{format('loading')}</div>;
  }

  const adminEnterprises = (
    enterprisesResponse?.enterprises ?? []
  ).filter(({ id }) => idAdminEnterprises.includes(id));

  if (adminEnterprises.length === 0) {
    return <div>{format('no-enterprises')}</div>;
  }

  return (
    <PopoverMenu className={styles.popoverMenu}>
      {adminEnterprises.map((enterprise) => (
        <PopoverMenuLink
          key={`enterprise-${enterprise.id}`}
          href={`/e/${enterprise.name}/admin`}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => onEnterpriseSelected()}
        >
          {enterprise.displayName}
        </PopoverMenuLink>
      ))}
    </PopoverMenu>
  );
};

export default EnterpriseMenu;
