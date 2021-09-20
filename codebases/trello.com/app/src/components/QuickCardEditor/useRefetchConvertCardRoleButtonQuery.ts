import { useEffect } from 'react';

import { rpc, RpcUpdatePayload } from 'app/scripts/network/rpc';

import { useConvertCardRoleButtonQuery } from './ConvertCardRoleButtonQuery.generated';

export function useRefetchConvertCardRoleButtonQuery(idCard: string): void {
  const { refetch } = useConvertCardRoleButtonQuery({
    variables: {
      idCard,
    },
  });

  useEffect(() => {
    const rpcHandler = (updatePayload: RpcUpdatePayload): void => {
      if (
        updatePayload.typeName === 'Card' &&
        updatePayload.deltas.find((d) => d.id === idCard)
      ) {
        refetch();
      }
    };

    rpc.on('updateModels', rpcHandler);

    return () => rpc.off('updateModels', rpcHandler);
  });
}
