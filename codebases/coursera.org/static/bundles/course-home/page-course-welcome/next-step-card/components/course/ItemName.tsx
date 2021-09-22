import React from 'react';
import { Item } from 'bundles/course-v2/types/Item';

type Props = {
  item: Item;
  overrideName: string | JSX.Element;
};

const ItemName: React.SFC<Props> = (props) => {
  const { item, overrideName } = props;

  return (
    <div className="rc-ItemName body-2-text title">
      {!!overrideName && overrideName}
      {!overrideName && item.name}
    </div>
  );
};

export default ItemName;
