import styled from '@emotion/styled';
import { TooltipPrimitive } from '@atlaskit/tooltip';
import { N0, N800, OpacityDark2 } from '@trello/colors';

// eslint-disable-next-line @trello/no-module-logic
export const TooltipPrimitiveLight = styled(TooltipPrimitive)`
  background: ${N0};
  border-radius: 4px;
  box-shadow: 0 1px 2px ${OpacityDark2};
  box-sizing: content-box;
  color: ${N800};
  max-height: 300px;
  max-width: 300px;
  padding: 8px 12px;
`;
