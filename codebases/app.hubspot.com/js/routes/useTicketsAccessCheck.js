'use es6';

import { useEffect } from 'react';
import { isScoped } from '../containers/ScopeOperators';
import ScopesContainer from '../containers/ScopesContainer';
import RouterContainer from '../containers/RouterContainer';
export function useTicketsAccessCheck() {
  useEffect(function () {
    // split out of other effect to only run once on mount,
    // don't need to be checking scopes every time this re-renders
    if (!isScoped(ScopesContainer.get(), 'tickets-access')) {
      RouterContainer.get().navigate('/contacts');
    }
  }, []);
}