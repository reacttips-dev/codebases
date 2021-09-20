/* eslint-disable import/no-default-export */
import {
  BoardSearchResultsPayload,
  SearchResultsPayload,
} from 'app/gamma/src/api/normalizers/search-results';
import Cookies from 'js-cookie';
import {
  DeploymentsResponse,
  MemberResponse,
  AccountStatusResponse,
} from 'app/gamma/src/types/responses';
import { AjaxEngine, BaseEngine, FetchEngine } from './engines';
import type {
  TrelloClientOptions,
  TrelloClientQuery,
  TrelloClientRestInit,
  ApiResponse,
  TrelloClientRest,
  TrelloClientSearchBoardsParams,
  TrelloClientSearchMembersParams,
  TrelloClientSearchParams,
} from './trello-client-js.types';

const API_BASE_PATH = '/1';

const DEFAULT_OPTIONS: TrelloClientOptions = {
  apiHost: window.location.origin,
  engine: 'fetch',
  getHeaders: () => ({}),
  getToken: () => '',
};

export default class TrelloClient {
  options: TrelloClientOptions;
  private engine: BaseEngine;
  private ajaxEngine: AjaxEngine;
  private fetchEngine: FetchEngine;
  private getToken: TrelloClientOptions['getToken'];

  constructor(constructorOptions: Partial<TrelloClientOptions> = {}) {
    const { getHeaders, getToken } = constructorOptions;

    this.getToken = getToken || DEFAULT_OPTIONS.getToken;

    this.ajaxEngine = new AjaxEngine({
      getHeaders: getHeaders || DEFAULT_OPTIONS.getHeaders,
    });
    this.fetchEngine = new FetchEngine({
      getHeaders: getHeaders || DEFAULT_OPTIONS.getHeaders,
    });

    this.options = { ...DEFAULT_OPTIONS, ...constructorOptions };

    if (this.options.engine === 'ajax' || !window.fetch) {
      this.engine = this.ajaxEngine;
    } else {
      this.engine = this.fetchEngine;
    }
  }

  private getAPIUrl(route: string, query?: TrelloClientQuery) {
    const url = new URL(this.options.apiHost);

    url.pathname = `${API_BASE_PATH}/${route}`;

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, value.toString());
        }
      });
    }

    return url;
  }

  private generateRestMethod = (method: 'get' | 'put' | 'post' | 'delete') => <
    T
  >(
    route: string,
    init?: TrelloClientRestInit,
  ): Promise<T | ApiResponse<T>> => {
    const query = init && init.query;
    const body = init && init.body;
    let parsedBody: string = '';
    const isUpload =
      // are we using a form?
      body instanceof FormData &&
      // is one of the values in the form a file?
      [...body.values()].some((value) => value instanceof Blob);

    if (method !== 'get') {
      parsedBody = JSON.stringify({
        ...(body || {}),
        token: this.getToken(),
      });
    }

    // fetch does not support upload progress
    return (isUpload ? this.ajaxEngine : this.engine).request<T>(
      // eslint-disable-next-line prefer-object-spread
      Object.assign(
        {
          url: this.getAPIUrl(route, query),
          method: method.toUpperCase(),
        },
        !!parsedBody && { body: parsedBody },
      ),
    );
  };

  rest: TrelloClientRest = {
    post: this.generateRestMethod('post').bind(this),
    get: this.generateRestMethod('get').bind(this),
    put: this.generateRestMethod('put').bind(this),
    del: this.generateRestMethod('delete').bind(this),
  };

  getAccountStatus = () => {
    const url = new URL(this.options.apiHost);
    url.pathname = '1/member/me/aaStatus';

    return this.engine.request<AccountStatusResponse>({
      url,
      method: 'GET',
      doNotRetry: true,
    });
  };

  deployments = () => {
    const url = new URL(this.options.apiHost);
    url.pathname = 'web/deployments';

    return this.engine.request<DeploymentsResponse>({
      url,
      method: 'GET',
      doNotRetry: true,
    });
  };

  search = (query: TrelloClientSearchParams, doNotRetry?: boolean) =>
    this.engine.request<SearchResultsPayload>({
      url: this.getAPIUrl('search', {
        ...query,
        dsc: Cookies.get('dsc'),
      }),
      method: 'GET',
      doNotRetry,
    });

  searchMembers = (
    query: TrelloClientSearchMembersParams,
    doNotRetry?: boolean,
  ) =>
    this.engine.request<MemberResponse[]>({
      url: this.getAPIUrl('search/members', query),
      method: 'GET',
      doNotRetry,
    });

  searchBoards = (
    query: TrelloClientSearchBoardsParams,
    doNotRetry?: boolean,
  ) =>
    this.engine.request<BoardSearchResultsPayload>({
      url: this.getAPIUrl('search', {
        ...query,
        dsc: Cookies.get('dsc'),
      }),
      method: 'GET',
      doNotRetry,
    });

  batch = <T = []>(urls: string[], doNotRetry?: boolean) =>
    this.engine.request<T>({
      url: this.getAPIUrl('batch', { urls }),
      method: 'GET',
      doNotRetry,
    });
}
