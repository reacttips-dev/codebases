import React from 'react';

import { Box } from '@coursera/coursera-ui';

import ItemNavBreadcrumbs from 'bundles/item/components/navigation/ItemNavBreadcrumbs';
import PreviousAndNextItem from 'bundles/item/components/navigation/PreviousAndNextItem';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import type Lesson from 'pages/open-course/common/models/lesson';

import _t from 'i18n!nls/item';

import 'css!./__styles__/ItemPrimaryNavigation';

type Props = {
  courseSlug: string;
  itemId: string;
  lesson: Lesson;
  weekNumber: number;
};

const ItemPrimaryNavigation: React.SFC<Props> = ({ courseSlug, weekNumber, itemId, lesson }) => {
  const ariaLabel = _t('Primary breadcrumb');
  return (
    <div className="rc-ItemPrimaryNavigation">
      <Box justifyContent="between" alignItems="center">
        <ItemNavBreadcrumbs itemId={itemId} courseSlug={courseSlug} weekNumber={weekNumber} ariaLabel={ariaLabel} />
        <PreviousAndNextItem itemId={itemId} lesson={lesson} />
      </Box>
    </div>
  );
};

export default ItemPrimaryNavigation;
