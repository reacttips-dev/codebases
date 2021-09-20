import api from 'app/gamma/src/api';
import { atlassianApiGateway } from '@trello/config';
import { MemberResponse } from 'app/gamma/src/types/responses';

export interface MigrationResponse {
  aaExists: boolean;
  redirect_url: string;
  emailVerificationRequired?: boolean;
}

export interface AccountsResponse {
  atlassian: {
    email: string | undefined | null;
  };
  trello: {
    email: string | undefined | null;
    loginId: string | undefined | null;
  };
}

export interface TrelloAccountResponse {
  name: string | undefined | null;
  email: string | undefined | null;
  loginId: string;
}

export interface AtlassianAccountResponse {
  email: string;
  name: string;
  avatar: string;
}

export class AtlassianAccountMigrationClient {
  static async migrate(): Promise<MigrationResponse | null> {
    try {
      const response = await api.client.rest.post<MigrationResponse>(
        `members/me/atlassianAccount/migrate`,
        {
          body: {
            // Show the "success overlay". See `AtlassianConfirmation.tsx`
            returnUrl: `${window.location.pathname}?onboarding=success`,
          },
        },
      );
      return response;
    } catch (err) {
      return null;
    }
  }

  static async fetchAccountsInfo(): Promise<AccountsResponse | null> {
    const trelloMember = await this.fetchTrelloAccountInfo();
    const aaMember = await this.fetchAtlassianAccountInfo();
    return {
      atlassian: {
        email: aaMember?.email,
      },
      trello: {
        email: trelloMember?.email,
        loginId: trelloMember?.loginId,
      },
    };
  }

  static async fetchTrelloAccountInfo(): Promise<TrelloAccountResponse | null> {
    try {
      const response = await api.client.rest.get<MemberResponse>('members/me', {
        query: {
          fields: 'email,fullName',
          logins: true,
        },
      });
      const primaryLogin = response?.logins?.find((login) => login.primary);
      const primaryEmailLoginId = primaryLogin?.id ?? '';
      return {
        name: response?.fullName,
        email: response?.email,
        loginId: primaryEmailLoginId,
      };
    } catch (err) {
      console.error('Failed to fetch Trello account', { err });
      return null;
    }
  }

  static async fetchAtlassianAccountInfo(): Promise<AtlassianAccountResponse | null> {
    try {
      // eslint-disable-next-line @trello/fetch-includes-client-version
      const response = await fetch(`${atlassianApiGateway}gateway/api/me`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`Invalid response status code: ${response.status}`);
      }
      const data = await response.json();
      return {
        name: data?.name,
        email: data?.email,
        avatar: data?.picture,
      };
    } catch (err) {
      console.error('Failed to fetch Atlassian account', { err });
      return null;
    }
  }
}
