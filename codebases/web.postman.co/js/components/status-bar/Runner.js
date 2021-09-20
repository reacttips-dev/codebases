import React from 'react';
import { Icon } from '@postman/aether';

import XPath from '../base/XPaths/XPath';
import { openRunnerTab } from '@@runtime-repl/runner/_api/RunnerInterface';

export default {
  name: 'Runner',
  position: 'right',
  getComponent ({
    React,
    StatusBarComponents
  }) {
    return class Runner extends React.Component {
      render () {
        const { Item, Text } = StatusBarComponents;

        return (
          <XPath identifier='runner'>
            <Item>
              <Text
                render={() => {
                  return (
                    <div
                      className='runner-label-button'
                      onClick={() => openRunnerTab({}, { preview: false })}
                    >
                      <span className='runner-label-text'>
                        Runner
                      </span>
                      <Icon
                        name='icon-action-run-stroke'
                        size='small'
                      />
                    </div>
                  );
                }}
              />
            </Item>
          </XPath>
        );
      }
    };
  }
};
