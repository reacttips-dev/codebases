import type NetworkInfo from '../types/NetworkInfo';

export default function (): NetworkInfo | null {
    let nav = <any>navigator;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    return connection
        ? {
              type: connection.type,
              effectiveType: connection.effectiveType,
              downlink: connection.downlink,
              rtt: connection.rtt,
              saveData: connection.saveData,
          }
        : null;
}
