import React, { FC, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const RQ_DEFAULT_QUERIES_OPTIONS = {
  refetchOnWindowFocus: false,
  staleTime: 1000 * 60 * 5,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: RQ_DEFAULT_QUERIES_OPTIONS,
  },
});

const ReactQueryProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export { RQ_DEFAULT_QUERIES_OPTIONS, ReactQueryProvider };
