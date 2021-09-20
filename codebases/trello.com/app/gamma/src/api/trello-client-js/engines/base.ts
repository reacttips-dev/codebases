/* eslint-disable import/no-default-export */
import { urlToString } from 'app/gamma/src/util/url';
import type {
  ApiResponse,
  ApiRawResponse,
  ApiError,
  ApiSuccessResponse,
} from '../trello-client-js.types';
import delay from '../delay';

interface EngineOptions {
  maxRetries?: number;
  msBackoff?: number;
  getHeaders?: () => object;
}

export interface EngineEvents {
  onprogress?: XMLHttpRequestEventTarget['onprogress'];
}

interface ExtendedRequestInit extends RequestInit {
  url: URL;
  events?: EngineEvents;
  doNotRetry?: boolean;
  returnErrors?: boolean;
}

interface RequestFunction {
  <T>(extendedInit: ExtendedRequestInit & { returnErrors?: false }): Promise<T>;
  <T>(extendedInit: ExtendedRequestInit & { returnErrors: true }): Promise<
    ApiResponse<T>
  >;
}

const requestImpl: RequestFunction = async function <T>(
  this: BaseEngine,
  extendedRequestInit: ExtendedRequestInit,
): Promise<T | ApiResponse<T>> {
  const {
    url,
    events,
    doNotRetry,
    returnErrors,
    ...requestInitParams
  } = extendedRequestInit;
  const requestInit: RequestInit = {
    ...this.REQUEST_INIT_DEFAULTS,
    ...requestInitParams,

    headers: new Headers({
      ...this.REQUEST_INIT_DEFAULTS.headers,
      ...(this.getHeaders!() || {}),
      ...(requestInitParams.headers || {}),
    }),
  };
  const urlString = urlToString(url);
  const request = new Request(urlString, requestInit);

  const response = await this.requestWithRetries<T>(
    request,
    doNotRetry ? 0 : this.maxRetries,
    this.msBackoff,
    events,
  );

  if (returnErrors) {
    return response;
  } else {
    if (response.success) {
      return response.json;
    } else {
      throw response;
    }
  }
};

export default class BaseEngine {
  readonly maxRetries: number = 12;
  readonly msBackoff: number = 100;
  readonly REQUEST_INIT_DEFAULTS: RequestInit = {
    credentials: 'include',
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  readonly RETRYABLE_ERRORS = [408, 500, 502, 503, 504];
  readonly getHeaders: EngineOptions['getHeaders'] = () => ({});

  constructor(options: EngineOptions = {}) {
    if (typeof options.maxRetries === 'number') {
      this.maxRetries = options.maxRetries;
    }

    if (typeof options.msBackoff === 'number') {
      this.msBackoff = options.msBackoff;
    }

    if (options.getHeaders) {
      this.getHeaders = options.getHeaders;
    }
  }

  request: RequestFunction = requestImpl;

  requestWithRetries = async <T>(
    request: Request,
    retries: number,
    msBackoff: number,
    events?: EngineEvents,
  ): Promise<ApiResponse<T>> => {
    const response = this.fromRawResponse<T>(await this.tryRequest(request));

    if (response.success) {
      return this.createSuccess(response.json);
    } else if (
      retries > 0 &&
      this.RETRYABLE_ERRORS.includes(response.statusCode)
    ) {
      await delay(msBackoff);

      return this.requestWithRetries(
        request,
        retries - 1,
        msBackoff * 2,
        events,
      );
    } else {
      return response;
    }
  };

  private fromRawResponse = <T>({
    statusCode,
    body,
    contentType,
  }: ApiRawResponse): ApiResponse<T> => {
    let json: T | Error | undefined;
    let error: ApiError | undefined;

    if (contentType && contentType.includes('json')) {
      try {
        json = JSON.parse(body);
      } catch (ex) {
        error = this.createError(400, 'Unable to parse response');
      }
    }

    if (statusCode < 200 || statusCode >= 300) {
      if (json && 'message' in json) {
        error = this.createError(statusCode, json.message);
        error.stack = json.stack;
      } else {
        error = this.createError(statusCode, body);
      }
    }

    if (error) {
      return error;
    } else if (json) {
      return this.createSuccess(json as T);
    } else {
      return this.createError(400, "Response wasn't JSON");
    }
  };

  tryRequest: (
    request: Request,
    events?: EngineEvents,
  ) => Promise<ApiRawResponse>;

  protected createSuccess<T>(response: T): ApiSuccessResponse<T> {
    return {
      success: true,
      json: response,
    };
  }
  protected createError(statusCode: number, message: string): ApiError {
    const error: ApiError = new Error(`API Error: ${message}`) as ApiError;

    error.originalMessage = message;
    error.statusCode = statusCode;
    error.success = false;

    return error;
  }
  protected NETWORK_ERROR: ApiRawResponse = {
    statusCode: 500,
    contentType: 'text/plain',
    body: 'network error',
  };
}
