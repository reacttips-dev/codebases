import React from 'react';
import toHumanReadableTypeName from 'bundles/ondemand/utils/toHumanReadableTypeName';

import { Item } from 'bundles/course-v2/types/Item';

import _t from 'i18n!nls/course-home';

import 'css!./__styles__/ItemStatus';

type Props = {
  item: Item;
  courseId: string;
};

class ItemStatus extends React.Component<Props> {
  render() {
    const { courseId, item } = this.props;
    const key = `${courseId}_${item.id}`;

    let typeName;

    switch (item.contentSummary.typeName) {
      case 'ungradedLti':
      case 'gradedLti':
        typeName = _t('Assignment');
        break;

      default:
        typeName = toHumanReadableTypeName(item.contentSummary.typeName);
        break;
    }

    return (
      <li className="rc-ItemStatus horizontal-box align-items-vertical-center" key={key}>
        <div className={item.status.toLowerCase()} />
        <div>{typeName}</div>
      </li>
    );
  }
}

export default ItemStatus;
