/** @jsx jsx */
import React from 'react';
import { compose } from 'recompose';
import { Link } from 'react-router';
import { jsx } from '@emotion/react';
import { Button } from '@coursera/cds-core';
import { ChevronPreviousIcon, ChevronNextIcon } from '@coursera/cds-icons';

import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

import _t from 'i18n!nls/item';

import 'css!./__styles__/PreviousAndNextItem';

type Props = OuterProps & {
  courseMaterial: any;
};

type OuterProps = {
  itemId: string;
  lesson: any;
};

const PreviousAndNextItem: React.SFC<Props> = ({ itemId, lesson, courseMaterial }) => {
  const itemGroup = lesson.get('itemGroups').at(0);
  const item = itemId && courseMaterial.getItemMetadata(itemId);
  const { previous, next } = courseMaterial.getNeighboringNavigationItems(item || itemGroup);

  return (
    <div className="rc-PreviousAndNextItem horizontal-box">
      <Button
        component={Link}
        variant="ghost"
        size="small"
        icon={<ChevronPreviousIcon size="small" />}
        iconPosition="before"
        to={previous?.getLink()}
        aria-label={_t('Previous Item')}
      >
        {_t('Previous')}
      </Button>
      <Button
        component={Link}
        variant="ghost"
        size="small"
        icon={<ChevronNextIcon size="small" />}
        to={next?.getLink()}
        aria-label={_t('Next Item')}
      >
        {_t('Next')}
      </Button>
    </div>
  );
};

export default compose<Props, OuterProps>(
  connectToStores(['CourseStore'], ({ CourseStore }, props) => ({
    courseMaterial: CourseStore.getMaterials(),
  }))
)(PreviousAndNextItem);
