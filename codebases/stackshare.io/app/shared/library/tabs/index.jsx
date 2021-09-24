import React from 'react';
import {BaseTabs} from './base';
import {TabButtons, TabButton, TabItems, TabItem} from './shared';

// eslint-disable-next-line react/prop-types
function Tabs({items, ...props}) {
  return (
    <BaseTabs {...props}>
      {({openIndex, handleTabClick}) => (
        <React.Fragment>
          <TabButtons>
            {items.map((item, index) => (
              <TabButton
                key={`tab-btn-${index}`}
                onClick={() => handleTabClick(index)}
                isOpen={index === openIndex}
              >
                {item.title}
              </TabButton>
            ))}
          </TabButtons>
          <TabItems>
            {items.map((item, index) => (
              <TabItem key={`tab-item-${index}`} isOpen={index === openIndex}>
                {item.contents}
              </TabItem>
            ))}
          </TabItems>
        </React.Fragment>
      )}
    </BaseTabs>
  );
}

export {Tabs};
