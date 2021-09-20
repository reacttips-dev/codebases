import { clientVersion } from '@trello/config';
import { token } from '@trello/session-cookie';
import { ButlerAlert } from '../showButlerAlert';

interface Args {
  idButton: string;
  idBoard: string;
  idCard?: string;
}

export async function runButlerButton({
  idButton,
  idBoard,
  idCard,
}: Args): Promise<ButlerAlert> {
  try {
    const response = await fetch(
      `/1/boards/${idBoard}/butlerButtons/${idButton}/runs`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Trello-Client-Version': clientVersion,
        },
        body: JSON.stringify({
          idCard,
          token,
        }),
      },
    );
    if (!response.ok) {
      if (response.status === 504) {
        return ButlerAlert.GatewayTimeout;
      }
      const message = await response.text();
      if (message === 'CANT_PARSE_COMMAND') {
        return ButlerAlert.InvalidCommand;
      } else if (message === 'MEMBER_NOT_CONFIRMED') {
        return ButlerAlert.Unauthorized;
      }
      try {
        const data = JSON.parse(message);
        if (data.message === 'Command quota exceeded') {
          return ButlerAlert.PowerupUsageExceeded;
        }
        // eslint-disable-next-line no-empty
      } catch {}
      return ButlerAlert.RunButtonError;
    }
  } catch (e) {
    return ButlerAlert.NetworkError;
  }
  return ButlerAlert.Success;
}
