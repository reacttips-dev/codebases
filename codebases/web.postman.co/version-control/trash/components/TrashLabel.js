import React from 'react';
import { Icon as BaseIcon } from '@postman/aether';
import styled from 'styled-components';
import { observer } from 'mobx-react';

import XPath from '../../../js/components/base/XPaths/XPath';
import Link from '../../../appsdk/components/link/Link';
import { getStore } from '../../../js/stores/get-store';
import { CustomTooltip } from '../../common';
import Item from '../../../js/components/status-bar/base/Item';
import Text from '../../../js/components/status-bar/base/Text';

const TrashWrapper = styled(Link)`
  opacity: ${(props) => (props.disabled && '0.5')};
`;

@observer
export default class TrashLabel extends React.Component {
  render () {
    const isOffline = !getStore('SyncStatusStore').isSocketConnected,
      isScratchpad = pm.isScratchpad,
      isDisabled = isScratchpad || isOffline;
    
    let tooltipBody = null;

    if (isScratchpad) {
      tooltipBody = 'You need to exit scratchpad to perform this action';
    }
    else if (isOffline) {
      tooltipBody = 'You can perform this action once you\'re back online';
    }

    return (
      <TrashWrapper
        to={{
          routeIdentifier: 'trash'
        }}
        disabled={isDisabled}
      >
        <XPath identifier='trash'>
          <Item tooltip='Trash'>
            <Text
              render={() => {
                return (
                  <CustomTooltip
                    align='top'
                    body={tooltipBody}
                  >
                    <div
                      className={isDisabled ? 'trash-label-button-disabled' : 'trash-label-button'}
                    >
                      <span className='trash-label-text'>
                        Trash
                      </span>
                      <BaseIcon
                        name='icon-action-delete-stroke'
                        size='small'
                      />
                    </div>
                  </CustomTooltip>
                );
              }}
            />
          </Item>
        </XPath>
      </TrashWrapper>
    );
  }
}
