export const processHeadersMiddleware = <T>(callback: (headers: Headers) => any) => (response: Response<T>) => {
  callback(response.headers);
  return response;
};
