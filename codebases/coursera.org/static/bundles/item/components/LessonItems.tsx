import React from 'react';
import NavItem from 'bundles/learner-progress/components/item/nav/NavItem';

// eslint-disable-next-line no-restricted-imports
import ItemMetadata from 'pages/open-course/common/models/itemMetadata';

type Props = {
  items: Array<ItemMetadata>;
  currentItemId?: string;
};

const LessonItems = ({ items, currentItemId }: Props) => (
  <ul className="rc-LessonItems nostyle">
    {items.map((itemMetadata) => {
      const highlighted = currentItemId === itemMetadata.getId();

      return (
        <li key={itemMetadata.getId()}>
          <NavItem highlighted={highlighted} itemMetadata={itemMetadata} />
        </li>
      );
    })}
  </ul>
);

export default LessonItems;
